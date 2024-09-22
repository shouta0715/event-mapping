import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Loader } from "@/components/animation";
import { createIframeNode } from "@/features/iframe/utils";
import { getSource } from "@/features/sources/api";
import { WSStatusProvider } from "@/features/websocket/components";

import { TerminalStateProvider } from "@/global/store/provider";

const DynamicEventMapping = dynamic(
  () => import("@/features/event-mapping/components"),
  {
    ssr: false,
    loading: Loader,
  }
);

export default async function Page({
  params,
}: {
  params: { "source-id": string };
}) {
  const source = await getSource(params["source-id"]);
  if (!source) notFound();

  const iframeNode = createIframeNode({ url: source.url });

  return (
    <TerminalStateProvider
      defaultState={{
        nodes: [iframeNode],
        edges: [],
      }}
    >
      <WSStatusProvider>
        <DynamicEventMapping />
      </WSStatusProvider>
    </TerminalStateProvider>
  );
}
