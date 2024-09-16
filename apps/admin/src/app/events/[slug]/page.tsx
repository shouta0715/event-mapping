import { notFound } from "next/navigation";
import React from "react";
import { getEvent } from "@/features/events/api";

export default async function Page({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);

  if (!event) return notFound();

  return <div className="container mx-auto">a</div>;
}
