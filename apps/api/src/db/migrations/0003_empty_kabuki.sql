DROP INDEX IF EXISTS `sources_slug_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `sources_slug_event_id_unique` ON `sources` (`slug`,`event_id`);