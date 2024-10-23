import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Loader } from "@/components/animation";
import { createIframeNode } from "@/features/iframe/utils";
import { getSource } from "@/features/sources/api";
import { WSStatusProvider } from "@/features/websocket/components";

import { SourceProvider, TerminalStateProvider } from "@/global/store/provider";

const DynamicEventMapping = dynamic(
  () => import("@/features/event-mapping/components"),
  {
    loading: Loader,
  }
);

export default async function Page({
  params,
}: {
  params: Promise<{ "source-id": string }>;
}) {
  const { "source-id": sourceId } = await params;
  const source = await getSource(sourceId);
  if (!source) notFound();

  const iframeNode = createIframeNode({ data: source });

  return (
    <TerminalStateProvider
      defaultState={{
        nodes: [iframeNode],
        edges: [],
      }}
    >
      <SourceProvider sourceId={source.id}>
        <WSStatusProvider sourceId={source.id}>
          <DynamicEventMapping event={source.event} source={source} />
        </WSStatusProvider>
      </SourceProvider>
    </TerminalStateProvider>
  );
}
