CREATE TABLE `csrfStates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `csrfStates_id` PRIMARY KEY(`id`),
	CONSTRAINT `csrfStates_state_unique` UNIQUE(`state`)
);
