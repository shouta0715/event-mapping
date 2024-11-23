import { EventPrompt } from "@event-mapping/schema";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

const TIMESTAMP = 1000;

const onEventPrompt = async ({
  sourceId,
  id,
}: {
  sourceId: string;
  id: string;
}) => {
  const url = new URL(
    `${env.NEXT_PUBLIC_API_URL}/sources/${sourceId}/nodes/${id}/prompt`
  );

  const data: EventPrompt["data"] = { timestamp: TIMESTAMP };

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

export const useEventPrompt = (sourceId: string) => {
  return useMutation({
    mutationFn: (id: string) => onEventPrompt({ sourceId, id }),
  });
};
