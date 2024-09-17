"use client";

import { Input } from "@event-mapping/ui/components/input";
import { Label } from "@event-mapping/ui/components/label";
import { Loader, XIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { useTransition } from "react";

export function SearchSources() {
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    throttleMs: 1000,
    shallow: false,
    clearOnDefault: true,
    startTransition,
    history: "replace",
  });

  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="event-name">コンテンツ名で検索</Label>
        <div className="relative flex max-w-md gap-x-2">
          <Input
            className="w-full"
            id="event-name"
            onChange={(e) => setName(e.target.value)}
            placeholder="コンテンツ名"
            type="text"
            value={name || ""}
          />
          {isPending ? (
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
              <Loader className="size-4 animate-spin" />
            </span>
          ) : (
            <button
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center"
              onClick={() => setName("")}
              type="button"
            >
              <XIcon className="size-4 cursor-pointer" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
