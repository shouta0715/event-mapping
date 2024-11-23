import { PromptAction } from "@event-mapping/schema";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";
import { wait } from "@/utils";

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

  const { time } = await res.json<{ time: number }>();

  const waitTime = time - Date.now();

  await wait(waitTime);
};

export const usePrompt = (sourceId: string) => {
  return useMutation({
    mutationFn: (target: "admin" | "all") => onPrompt({ sourceId, target }),
  });
};
