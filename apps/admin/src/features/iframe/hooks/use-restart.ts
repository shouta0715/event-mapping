import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

const onRestart = async ({
  sourceId,
  ms,
}: {
  sourceId: string;
  ms: number;
}) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/sources/${sourceId}/restart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ms }),
    }
  );

  if (!res.ok) {
    throwHttpErrorFromStatus(res.status);
  }

  return res.json<{ time: number }>();
};

export const useRestart = (sourceId: string) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const m = useMutation({
    mutationFn: (ms: number) => onRestart({ sourceId, ms }),
  });

  return { ...m, refreshKey, setRefreshKey };
};
