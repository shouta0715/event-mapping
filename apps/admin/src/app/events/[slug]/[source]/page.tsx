import dynamic from "next/dynamic";
import { createIframeNode } from "@/features/iframe/utils";
import { TerminalStateProvider } from "@/global/store/provider";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <svg
        className="size-6 animate-spin text-black duration-300 dark:text-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

const DynamicEventMapping = dynamic(
  () => import("@/features/event-mapping/components"),
  {
    ssr: false,
    loading: Loading,
  }
);

const eventUrl = "http://localhost:3001";

export default function Page() {
  const iframeNode = createIframeNode({ url: eventUrl });

  return (
    <TerminalStateProvider
      defaultState={{
        nodes: [iframeNode],
        edges: [],
      }}
    >
      <DynamicEventMapping />
    </TerminalStateProvider>
  );
}
