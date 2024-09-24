import { AdminAction, TerminalData } from "@event-mapping/schema";

type CreateDefaultTerminalDataProps = {
  width: number;
  height: number;
  sessionId: string;
};

export const createDefaultTerminalData = ({
  width,
  height,
  sessionId,
}: CreateDefaultTerminalDataProps): TerminalData => {
  return {
    id: sessionId,
    sessionId,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    displayname: "test",
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    scale: 1,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };
};

export const sendMessage = <T extends AdminAction>(
  ws: WebSocket,
  message: T
) => {
  ws.send(JSON.stringify(message));
};
