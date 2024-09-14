import {
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
  Node,
} from "@xyflow/react";

import { TERMINAL_NODE_TYPE } from "@/constant/node";
import { IframeNode } from "@/features/iframe/types";

/**
 * @description: 端末のノードのデータ
 */
export type TerminalNodeData = {
  id: string;
  width: number;
  height: number;
};

/**
 * @description: 端末のエッジのデータ
 */
export type TerminalEdgeData = {
  source: string;
  target: string;
};

/**
 * @description: 端末のノード
 */
export type TerminalNode = Node<TerminalNodeData, typeof TERMINAL_NODE_TYPE>;

/**
 * @description: 端末のエッジ
 */
export type TerminalEdge = Edge<TerminalEdgeData>;

export type NodeType = TerminalNode | IframeNode;

/**
 * @description: フローのノードの状態
 */
export type FlowNodeState = {
  nodes: NodeType[];
};

/**
 * @description: フローのノードのアクション
 */
export type FlowNodeActions = {
  onNodesChange: OnNodesChange<NodeType>;
  setNodes: (nodes: NodeType[]) => void;
};

/**
 * @description: フローのエッジの状態
 */
export type FlowEdgeState = {
  edges: TerminalEdge[];
};

/**
 * @description: フローのエッジのアクション
 */
export type FlowEdgeActions = {
  onEdgesChange: OnEdgesChange<TerminalEdge>;
  onConnect: OnConnect;
  setEdges: (edges: TerminalEdge[]) => void;
};

/**
 * @description: フローの状態（ノードとエッジの状態）
 */
export type FlowState = FlowNodeState & FlowEdgeState;

/**
 * @description: フローのアクション（ノードとエッジのアクション）
 */
export type FlowActions = FlowNodeActions & FlowEdgeActions;

export type FlowGlobalState = FlowState & FlowActions;
