# Dump of tables for the uomi database!
# ------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS uomi;

USE uomi;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `email` varchar(256) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `password` char(128) DEFAULT NULL,
    `salt` char(64) DEFAULT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `settings`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `settings` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int(11) unsigned NOT NULL,

    `allow_notifications` boolean NULL DEFAULT 0,
    `borrow_requests` boolean NULL DEFAULT 0,
    `payback_reminders` boolean NULL DEFAULT 0,
    `view_email` boolean NULL DEFAULT 0,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`),

    KEY `user` (`user_id`),

    CONSTRAINT `user_settings` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `categories`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `categories` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(254) NOT NULL,
    `identifier` varchar(254) NOT NULL,
    `icon` varchar(254) NOT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `loans`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `loans` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,

    `to_user` int(11) unsigned NOT NULL,
    `from_user` int(11) unsigned NOT NULL,

    `confirmed` boolean DEFAULT 0,
    `details` text DEFAULT NULL,
    `amount_cents` int(16) unsigned NOT NULL,
    `category_id` int(11) unsigned DEFAULT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `confirmed_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `completed_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`),

    KEY `borrower` (`to_user`),
    KEY `lender` (`from_user`),
    KEY `category` (`category_id`),

    CONSTRAINT `borrower` FOREIGN KEY (`to_user`) REFERENCES `users` (`id`),
    CONSTRAINT `lender` FOREIGN KEY (`from_user`) REFERENCES `users` (`id`),
    CONSTRAINT `category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payments`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `payments` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `loan_id` int(11) unsigned NOT NULL,
    `details` text DEFAULT NULL,
    `amount_cents` int(16) unsigned NOT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`),

    KEY `loan` (`loan_id`),
    
    CONSTRAINT `loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `sessions`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `sessions` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int(11) unsigned NOT NULL,
    `token` char(128) NOT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`),

    KEY `user_sess` (`user_id`),

    CONSTRAINT `user_sess` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
