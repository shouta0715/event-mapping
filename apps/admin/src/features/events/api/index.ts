import { Event, EventInsert, EventWithSources } from "@event-mapping/db";
import { env } from "@/env";
import { throwHttpErrorFromStatus } from "@/errors";

export const getEvents = async (name?: string): Promise<Event[]> => {
  const url = new URL(`${env.NEXT_PUBLIC_API_URL}/events`);
  if (name) url.searchParams.set("q", name);

  const res = await fetch(url, {
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
