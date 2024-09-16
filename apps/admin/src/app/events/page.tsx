import Link from "next/link";
import React from "react";

import { Container } from "@/components/container";
import { getEvents } from "@/features/events/api";
import { EventFormDialog } from "@/features/events/components/dialog";

export default async function Page() {
  const events = await getEvents();

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
        <ul className="mt-12">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                className="block w-full border-b py-4 font-bold transition-colors hover:border-b-primary hover:text-primary"
                href={`/events/${event.id}`}
              >
                {event.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
