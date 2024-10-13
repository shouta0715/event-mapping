import { TerminalData } from "@event-mapping/schema";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

const getUrl = (sourceId: string, nodeId: string) => {
  return `${env.NEXT_PUBLIC_API_URL}/sources/${sourceId}/nodes/${nodeId}`;
};

export const updateTerminalData = async ({
  sourceId,
  nodeId,
  data,
}: {
  sourceId: string;
  nodeId: string;
  data: TerminalData;
}) => {
  const parseData: TerminalData = {
    ...data,
    endX: data.startX + data.width,
    endY: data.startY + data.height,
  };

  const res = await fetch(getUrl(sourceId, nodeId), {
    method: "PATCH",
    body: JSON.stringify(parseData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throwHttpErrorFromStatus(res.status);

  const json = await res.json<{ data: TerminalData }>();

  return json;
};
