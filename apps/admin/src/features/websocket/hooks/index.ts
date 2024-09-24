import { AdminAction, parseActionMessage } from "@event-mapping/schema";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { env } from "@/env";

const getWsUrl = (eventId: string, sourceId: string) => {
  return `${env.NEXT_PUBLIC_WS_URL}/events/${eventId}/sources/${sourceId}/subscribe/admin`;
};

export function useWs(eventId: string, sourceId: string) {
  const url = getWsUrl(eventId, sourceId);

  const { sendMessage, readyState, lastJsonMessage } =
    useWebSocket<AdminAction>(url, {
      reconnectInterval: (attemptNumber) =>
        Math.min(2 ** attemptNumber * 1000, 10000),
      reconnectAttempts: 10,
      shouldReconnect: (e) => e.code !== 1000,
      share: true,
      heartbeat: {
        message: "ping",
        returnMessage: "pong",
        timeout: 5 * 60 * 1000,
        interval: 1 * 60 * 1000,
      },
      filter: ({ data }) => {
        console.log(data);
        if (typeof data === "string" && data === "pong") return false;
        const d = parseActionMessage("admin", data);

        if (!d) return false;
        const { action } = d;

        if (action === "warning") {
          // eslint-disable-next-line no-console
          console.warn(d.message);
          toast.warning(d.message);

          return false;
        }

        return true;
      },
    });

  const status = {
    [ReadyState.CONNECTING]: "connecting" as const,
    [ReadyState.OPEN]: "open" as const,
    [ReadyState.CLOSING]: "closing" as const,
    [ReadyState.CLOSED]: "closed" as const,
    [ReadyState.UNINSTANTIATED]: "uninstantiated" as const,
  }[readyState];

  const isOpen = readyState === ReadyState.OPEN;
  const isConnecting = readyState === ReadyState.CONNECTING;
  const isClosing = readyState === ReadyState.CLOSING;
  const isClosed = readyState === ReadyState.CLOSED;
  const isUninstantiated = readyState === ReadyState.UNINSTANTIATED;

  return {
    status,
    isOpen,
    isConnecting,
    isClosing,
    isClosed,
    isUninstantiated,
    sendMessage,
    lastJsonMessage,
  };
}
