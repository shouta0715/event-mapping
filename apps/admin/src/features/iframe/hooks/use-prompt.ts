import { PromptAction } from "@event-mapping/schema";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

const TIMESTAMP = 1000;

const onPrompt = async ({
  sourceId,
  target,
}: {
  sourceId: string;
  target: "admin" | "all";
}) => {
  const url = new URL(`${env.NEXT_PUBLIC_API_URL}/sources/${sourceId}/prompt`);

  url.searchParams.set("target", target);

  const data: PromptAction["data"] = { timestamp: TIMESTAMP };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throwHttpErrorFromStatus(res.status);
  }

  return res.json<{ time: number }>();
};

export const usePrompt = (sourceId: string) => {
  return useMutation({
    mutationFn: (target: "admin" | "all") => onPrompt({ sourceId, target }),
  });
};
