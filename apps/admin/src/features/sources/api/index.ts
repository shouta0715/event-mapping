import { Source, SourceInsert } from "@event-mapping/db";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

export const createSource = async ({
  data,
  eventId,
}: {
  data: SourceInsert;
  eventId: string;
}) => {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/sources/${eventId}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throwHttpErrorFromStatus(res.status);

  const json = await res.json<Source>();

  return json;
};
