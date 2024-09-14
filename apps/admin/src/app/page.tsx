import { EventMapping } from "@/features/event-mapping/components";
import { createIframeNode } from "@/features/iframe/utils";
import { TerminalStateProvider } from "@/global/store/provider";

const eventUrl = "http://localhost:3001";

export default function Home() {
  const iframeNode = createIframeNode({ url: eventUrl });

  return (
    <TerminalStateProvider
      defaultState={{
        nodes: [iframeNode],
        edges: [],
      }}
    >
      <EventMapping />
    </TerminalStateProvider>
  );
}
