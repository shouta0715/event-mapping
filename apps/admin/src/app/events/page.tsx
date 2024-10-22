import Link from "next/link";
import React from "react";

import { Container } from "@/components/container";
import { getEvents } from "@/features/events/api";
import { EventFormDialog } from "@/features/events/components/dialog";
import { SearchEvents } from "@/features/events/components/search";
import { getQ } from "@/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ name: string | undefined | string[] }>;
}) {
  const s = await searchParams;
  const events = await getEvents(getQ(s));

  return (
    <div>
      <header className="bg-primary py-2.5 sm:px-3.5 sm:before:flex-1">
        <Container className="flex items-center gap-x-6 px-6">
          <p className="font-bold leading-6 text-white">イベント一覧</p>
          <div className="flex flex-1 justify-end">
            <EventFormDialog />
          </div>
        </Container>
      </header>
      <Container className="max-w-4xl">
        <div className="mt-12">
          <SearchEvents />
        </div>
        <ul className="mt-6">
          {events.length === 0 ? (
            <p className="mt-10 text-center">
              イベントは見つかりませんでした。
            </p>
          ) : (
            events.map((event) => (
              <li key={event.id}>
                <Link
                  className="block w-full border-b py-4 font-bold transition-colors hover:border-b-primary hover:text-primary"
                  href={`/events/${event.slug}`}
                >
                  <p className="mb-2">{event.name}</p>
                  <p className="text-sm tracking-widest text-muted-foreground">
                    {event.slug}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </div>
  );
}
