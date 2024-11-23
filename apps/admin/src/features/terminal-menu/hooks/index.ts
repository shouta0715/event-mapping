import { TerminalData } from "@event-mapping/schema";
import { toast } from "sonner";
import { useEventPrompt } from "@/features/terminal-menu/hooks/use-event-prompt";
import { useSourceId, useTerminalState } from "@/global/store/provider";
import { useUpdateNodeData } from "@/hooks/node";

type UseTerminalMenu = {
  data: TerminalData;
  id: string;
};

export function useTerminalMenu({ data, id }: UseTerminalMenu) {
  const sourceId = useSourceId();

  const { mutate } = useUpdateNodeData();
  const { getNodeData } = useTerminalState((state) => ({
    getNodeData: state.getNodeData,
  }));
  const { mutateAsync: mutateAsyncPrompt } = useEventPrompt(sourceId);

  const handleResetSize = () => {
    const w = data.windowWidth;
    const h = data.windowHeight;
    mutate({
      nodeId: id,
      data: { ...data, windowWidth: w, windowHeight: h, width: w, height: h },
    });
  };

  const handlePrompt = () => {
    const node = getNodeData(id);

    const prefixMessage = `${node?.displayname ?? id} の`;

    toast.promise(mutateAsyncPrompt(id), {
      loading: `${prefixMessage}プロンプトを実行しています...`,
      success: `${prefixMessage}プロンプトを実行しました。`,
      error: `${prefixMessage}プロンプトを実行できませんでした。`,
    });
  };

  return { handleResetSize, handlePrompt, mutateAsyncPrompt };
}
