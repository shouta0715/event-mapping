import { EventMapping } from "@/features/event-mapping/components";
import { TerminalStateProvider } from "@/global/store/provider";

export default function Home() {
  return (
    <TerminalStateProvider>
      <EventMapping />
    </TerminalStateProvider>
  );
}
