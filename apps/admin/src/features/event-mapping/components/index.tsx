"use client";

import "@xyflow/react/dist/style.css";

import { Event, Source } from "@event-mapping/db";
import {
  Background,
  Controls,
  Panel as RfPanel,
  ReactFlow,
} from "@xyflow/react";
import React from "react";
import { Rnd } from "react-rnd";
import { IFRAME_NODE_TYPE, TERMINAL_NODE_TYPE } from "@/constant/node";
import { useEventMapping } from "@/features/event-mapping/hooks";
import { IframeNode } from "@/features/iframe/components";
import { Panel } from "@/features/panel/components";
import { TerminalNode } from "@/features/terminal/components";

const nodeTypes = {
  [IFRAME_NODE_TYPE]: IframeNode,
  [TERMINAL_NODE_TYPE]: TerminalNode,
};

type Props = {
  event: Event;
  source: Source;
};

function EventMapping({ event, source }: Props) {
  const {
    nodes,
    edges,
    onEdgesChange,
    onNodesChange,
    onNodeClick,
    onNodeDoubleClick,
    onPanClick,
    onNodeDragStop,
  } = useEventMapping({ sourceId: source.id });

  return (
    <div className="h-screen">
      <ReactFlow
        edges={edges}
        fitView
        minZoom={0.1}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDragStop={onNodeDragStop}
        onNodesChange={onNodesChange}
        onPaneClick={onPanClick}
      >
        <RfPanel
          className="relative h-full"
          position="top-left"
          style={{ margin: "0" }}
        >
          <Rnd
            className="rounded-2xl border-2 bg-background/80 p-4"
            default={{
              height: "96%",
              width: 320,
              x: 20,
              y: 20,
            }}
            disableDragging
            enableResizing={{
              bottom: false,
              bottomLeft: false,
              bottomRight: false,
              left: false,
              right: true,
              top: false,
              topLeft: false,
              topRight: false,
            }}
            maxWidth="90vw"
            minWidth={320}
            position={{ x: 20, y: 20 }}
          >
            <div>
              <Panel event={event} source={source} />
            </div>
          </Rnd>
        </RfPanel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default EventMapping;
