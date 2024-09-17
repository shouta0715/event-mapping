import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { Container } from "@/components/container";
import { getEvent } from "@/features/events/api";
import { SourceFormDialog } from "@/features/sources/components/dialog";
import { SearchSources } from "@/features/sources/components/search";
import { getQ } from "@/utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { name: string | undefined | string[] };
}) {
  const event = await getEvent(params.slug, getQ(searchParams));

  if (!event) return notFound();

  return (
    <div>
      <header className="bg-primary py-2.5 sm:px-3.5 sm:before:flex-1">
        <Container className="flex items-center gap-x-6 px-6">
          <p className="font-bold leading-6 text-white ">
            {event.name}のコンテンツ一覧
          </p>
          <div className="flex flex-1 justify-end">
            <SourceFormDialog eventId={event.id} />
          </div>
        </Container>
      </header>
      <Container className="max-w-4xl">
        <div className="mt-12">
          <SearchSources />
        </div>
        <ul className="mt-6">
          {event.sources.length === 0 ? (
            <p className="mt-10 text-center">
              コンテンツは見つかりませんでした。
            </p>
          ) : (
            event.sources.map((source) => (
              <li key={source.id}>
                <Link
                  className="block w-full border-b py-4 font-bold transition-colors hover:border-b-primary hover:text-primary"
                  href={`/events/${event.slug}/${source.slug}`}
                >
                  <p className="mb-2">{source.name}</p>
                  <p className="text-sm tracking-widest text-muted-foreground">
                    {source.url}
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
