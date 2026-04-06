CREATE TABLE `adminLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`targetType` varchar(100),
	`targetId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliateConversions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`commission` varchar(20) NOT NULL DEFAULT '0',
	`conversionDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliateConversions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailySummaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL,
	`totalRevenue` varchar(20) NOT NULL DEFAULT '0',
	`totalTips` varchar(20) NOT NULL DEFAULT '0',
	`totalExpenses` varchar(20) NOT NULL DEFAULT '0',
	`netProfit` varchar(20) NOT NULL DEFAULT '0',
	`totalRides` int NOT NULL DEFAULT 0,
	`totalDistance` varchar(20) NOT NULL DEFAULT '0',
	`totalDuration` int NOT NULL DEFAULT 0,
	`isClosed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailySummaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demandAreas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`latitude` varchar(20) NOT NULL,
	`longitude` varchar(20) NOT NULL,
	`demandLevel` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`eventType` varchar(100),
	`description` text,
	`isActive` int NOT NULL DEFAULT 1,
	`startTime` timestamp,
	`endTime` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `demandAreas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fuelStations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`latitude` varchar(20) NOT NULL,
	`longitude` varchar(20) NOT NULL,
	`address` text,
	`fuelPrice` varchar(20),
	`hasElectricCharging` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fuelStations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthlyGoals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`targetNetProfit` varchar(20) NOT NULL,
	`monthlyExpenses` varchar(20) NOT NULL DEFAULT '0',
	`daysWorked` int NOT NULL DEFAULT 0,
	`currentProgress` varchar(20) NOT NULL DEFAULT '0',
	`dailyTarget` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monthlyGoals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`price` varchar(20) NOT NULL,
	`originalPrice` varchar(20),
	`storeName` varchar(255) NOT NULL,
	`storeUrl` text NOT NULL,
	`affiliateUrl` text NOT NULL,
	`imageUrl` text,
	`couponCode` varchar(100),
	`category` varchar(100),
	`trustScore` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`isApproved` int NOT NULL DEFAULT 0,
	`source` enum('manual','ai') NOT NULL DEFAULT 'manual',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`offerId` int NOT NULL,
	`price` varchar(20) NOT NULL,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `priceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vehicleId` int NOT NULL,
	`origin` text,
	`destination` text,
	`distance` varchar(20) NOT NULL,
	`duration` int NOT NULL,
	`grossRevenue` varchar(20) NOT NULL,
	`tips` varchar(20) NOT NULL DEFAULT '0',
	`fuelCost` varchar(20) NOT NULL DEFAULT '0',
	`tollCost` varchar(20) NOT NULL DEFAULT '0',
	`maintenanceCost` varchar(20) NOT NULL DEFAULT '0',
	`netProfit` varchar(20) NOT NULL,
	`pricePerKm` varchar(20),
	`pricePerMinute` varchar(20),
	`multiplier` varchar(20) NOT NULL DEFAULT '1',
	`rideType` enum('app','particular') NOT NULL DEFAULT 'app',
	`status` enum('ongoing','completed','cancelled') NOT NULL DEFAULT 'ongoing',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('monthly','semestral','annual') NOT NULL,
	`status` enum('active','cancelled','expired') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`autoRenew` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`brand` varchar(100) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` int NOT NULL,
	`mileage` varchar(20) NOT NULL DEFAULT '0',
	`fuelConsumption` varchar(20) NOT NULL,
	`wearCoefficient` varchar(20) NOT NULL DEFAULT '0.15',
	`averageMaintenanceCost` varchar(20) NOT NULL DEFAULT '0',
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`alertOnPriceDrop` int NOT NULL DEFAULT 1,
	`alertOnCoupon` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
