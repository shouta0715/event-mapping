import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IS_DEVELOPMENT } from "@/env";
import { IframeNodeData } from "@/features/iframe/types";

type Props = {
  onRestart: () => Promise<void>;
  data: IframeNodeData;
};

export function useIframeMenu({ onRestart, data }: Props) {
  const { setCenter } = useReactFlow();
  const [openEditForm, setOpenEditForm] = useState(false);

  const handleRestart = useCallback(async () => {
    toast.promise(onRestart(), {
      loading: "同期中...",
      success: "同期しました。",
      error: "同期できませんでした。",
    });
  }, [onRestart]);

  const handleCenter = useCallback(() => {
    const { width, height } = data;
    const center = { x: width / 2 - 400, y: height / 2 };

    setCenter(center.x, center.y, { zoom: 0.2 });
  }, [setCenter, data]);

  const handleOpenContent = useCallback(() => {
    const URL = IS_DEVELOPMENT ? data.dev_url : data.url;
    window.open(URL, "_blank");
  }, [data.url, data.dev_url]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "r") {
        e.preventDefault();
        handleRestart();
      }

      if (e.metaKey && e.shiftKey && e.key === "o") {
        e.preventDefault();
        handleOpenContent();
      }

      if (e.metaKey && e.key === "m") {
        e.preventDefault();
        handleCenter();
      }

      if (e.metaKey && e.key === "e") {
        e.preventDefault();
        setOpenEditForm((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleOpenContent, handleRestart, handleCenter]);

  return {
    handleCenter,
    handleOpenContent,
    handleRestart,
    openEditForm,
    setOpenEditForm,
  };
}
