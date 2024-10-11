import { Source } from "@event-mapping/db";
import { Node } from "@xyflow/react";
import { IFRAME_NODE_TYPE } from "@/constant/node";

export type IframeNodeData = Source;

export type IframeNode = Node<IframeNodeData, typeof IFRAME_NODE_TYPE>;
