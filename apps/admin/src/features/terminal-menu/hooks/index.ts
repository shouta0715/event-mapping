import { TerminalData } from "@event-mapping/schema";
import { useEventPrompt } from "@/features/terminal-menu/hooks/use-event-prompt";
import { useSourceId } from "@/global/store/provider";
import { useUpdateNodeData } from "@/hooks/node";

type UseTerminalMenu = {
  data: TerminalData;
  id: string;
};

export function useTerminalMenu({ data, id }: UseTerminalMenu) {
  const sourceId = useSourceId();

  const { mutate } = useUpdateNodeData();
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
    mutateAsyncPrompt(id);
  };

  return { handleResetSize, handlePrompt, mutateAsyncPrompt };
}
