import { Source, SourceInsert } from "@event-mapping/db";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

const getUrl = (sourceId: string) => {
  return `${env.NEXT_PUBLIC_API_URL}/sources/${sourceId}`;
};

export const updateIframeData = async ({
  sourceId,
  data,
}: {
  sourceId: string;
  data: SourceInsert;
}) => {
  const res = await fetch(getUrl(sourceId), {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throwHttpErrorFromStatus(res.status);

  const json = await res.json<{ data: Source }>();

  return json;
};
