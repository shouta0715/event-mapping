ALTER TABLE `sources` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `sources_slug_unique` ON `sources` (`slug`);