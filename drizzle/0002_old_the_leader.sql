CREATE TABLE `refreshTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refreshTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `refreshTokens_tokenHash_unique` UNIQUE(`tokenHash`)
);
