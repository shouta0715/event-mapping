import { TerminalData } from "@event-mapping/schema";
import { useMutation } from "@tanstack/react-query";
import { NodeMouseHandler } from "@xyflow/react";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { useSourceId, useTerminalState } from "@/global/store/provider";
import { NodeType } from "@/global/store/types";
import { deleteNodeCache, updateTerminalData } from "@/hooks/node/api";

export const useUpdateNodeData = (
  onSuccess?: (data: TerminalData) => void,
  showToast = true
) => {
  const { updateNodeData } = useTerminalState((state) => ({
    updateNodeData: state.updateNodeData,
  }));

  const sourceId = useSourceId();

  return useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: string; data: TerminalData }) =>
      updateTerminalData({ sourceId, nodeId, data }),
    onSuccess: ({ data }) => {
      onSuccess?.(data);

      updateNodeData(data.id, data);
    },
    onError: (error) => {
      if (!showToast) return;
      toast.error("データを更新できませんでした。", {
        description: error.message,
      });
    },
  });
};

export const useDeleteNode = () => {
  const { deleteNode } = useTerminalState((state) => ({
    deleteNode: state.deleteNode,
  }));

  const sourceId = useSourceId();

  return useMutation({
    mutationFn: ({ nodeId }: { nodeId: string }) =>
      deleteNodeCache({ sourceId, nodeId }),
    onSuccess: ({ id }) => {
      deleteNode(id);
    },
  });
};

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
