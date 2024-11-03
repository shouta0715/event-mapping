import { TerminalData } from "@event-mapping/schema";
import { useUpdateNodeData } from "@/hooks/node";

type UseTerminalMenu = {
  data: TerminalData;
  id: string;
};

export function useTerminalMenu({ data, id }: UseTerminalMenu) {
  const { mutate } = useUpdateNodeData();

  const handleResetSize = () => {
    const w = data.windowWidth;
    const h = data.windowHeight;
    mutate({
      nodeId: id,
      data: { ...data, windowWidth: w, windowHeight: h, width: w, height: h },
    });
  };

  return { handleResetSize };
}
