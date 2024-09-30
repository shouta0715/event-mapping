import { SourceInsert } from "@event-mapping/db";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSourceId, useTerminalState } from "@/global/store/provider";
import { updateIframeData as updateIframeDataApi } from "@/hooks/iframe/api";

export const useUpdateIframeData = (showToast = true) => {
  const { updateIframeData } = useTerminalState((state) => ({
    updateIframeData: state.updateIframeData,
  }));

  const sourceId = useSourceId();

  return useMutation({
    mutationFn: ({ data }: { data: SourceInsert }) =>
      updateIframeDataApi({ sourceId, data }),
    onSuccess: ({ data }) => {
      updateIframeData(data);
    },
    onError: (error) => {
      if (!showToast) return;
      toast.error("データを更新できませんでした。", {
        description: error.message,
      });
    },
  });
};
