import { Event, EventInsert, EventWithSources } from "@event-mapping/db";
import { throwHttpErrorFromStatus } from "@/app/errors";
import { env } from "@/env";

export const getEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
    cache: "no-store",
  });
  const events = await res.json<Event[]>();

  return events;
};

export const getEvent = async (
  slug: string
): Promise<EventWithSources | null> => {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/events/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const event = await res.json<EventWithSources>();

  return event;
};

export const createEvent = async (data: EventInsert): Promise<Event> => {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throwHttpErrorFromStatus(res.status);

  const event = await res.json<Event>();

  return event;
};
