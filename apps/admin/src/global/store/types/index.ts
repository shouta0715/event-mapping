import {
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
  Node,
} from "@xyflow/react";

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
export type TerminalNode = Node<TerminalNodeData>;

/**
 * @description: 端末のエッジ
 */
export type TerminalEdge = Edge<TerminalEdgeData>;

/**
 * @description: フローのノードの状態
 */
export type FlowNodeState = {
  nodes: TerminalNode[];
};

/**
 * @description: フローのノードのアクション
 */
export type FlowNodeActions = {
  onNodesChange: OnNodesChange<TerminalNode>;
  setNodes: (nodes: TerminalNode[]) => void;
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
