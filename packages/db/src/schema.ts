import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: text("id").primaryKey().$defaultFn(createId),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull().default("Untitled Event"),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const sources = sqliteTable("sources", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  event_id: text("event_id")
    .references(() => events.id)
    .notNull(),
  url: text("url").notNull(),
  dev_url: text("dev_url").notNull(),
  width: integer("width").notNull().default(1920),
  height: integer("height").notNull().default(1080),
});

export const eventsToSources = relations(events, ({ many }) => ({
  sources: many(sources),
}));

export const sourcesToEvents = relations(sources, ({ one }) => ({
  event: one(events, {
    fields: [sources.event_id],
    references: [events.id],
  }),
}));
