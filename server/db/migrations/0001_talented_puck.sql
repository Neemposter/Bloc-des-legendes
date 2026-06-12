CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`location` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
