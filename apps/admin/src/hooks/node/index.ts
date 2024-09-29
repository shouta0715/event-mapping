import { NodeMouseHandler } from "@xyflow/react";
import { useQueryState, parseAsString } from "nuqs";
import { NodeType } from "@/global/store/types";

export const useNodeHandler = () => {
  const [node, setNode] = useQueryState(
    "node",
    parseAsString.withOptions({
      shallow: true,
      history: "replace",
    })
  );

  const onNodeClick: NodeMouseHandler<NodeType> = (_, { id }) => {
    setNode(id);
  };

  const onNodeDoubleClick: NodeMouseHandler<NodeType> = (_, { id }) => {
    setNode(id);
  };

  const getIsNodeSelected = (id: string) => {
    return node === id;
  };

  const onPanClick = () => {
    setNode(null);
  };

  return {
    onNodeClick,
    onNodeDoubleClick,
    getIsNodeSelected,
    onPanClick,
    node,
    setNode,
  };
};
