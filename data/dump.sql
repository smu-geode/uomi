# Dump of tables for the uomi database!
# ------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS uomi;

CREATE TABLE IF NOT EXISTS `users` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `email` varchar(256) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `password` char(128) DEFAULT NULL,
    `salt` char(64) DEFAULT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `friends` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int(11) unsigned NOT NULL,
    `friend_id` int(11) unsigned NOT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY (`id`),

    KEY `user` (`user_id`),
    KEY `friend` (`friend_id`),

    CONSTRAINT `user_friends` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `friend` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `settings` (
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


CREATE TABLE IF NOT EXISTS `categories` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(254) NOT NULL,
    `icon` varchar(254) NOT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `loans` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,

    `borrower_id` int(11) unsigned NOT NULL,
    `lender_id` int(11) unsigned NOT NULL,

    `details` text DEFAULT NULL,
    `amount_cents` int(16) unsigned NOT NULL,
    `category_id` int(11) unsigned DEFAULT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `confirmed_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `completed_at` timestamp DEFAULT '2000-01-01 00:00:00',

    PRIMARY KEY(`id`),

    KEY `borrower` (`borrower_id`),
    KEY `lender` (`lender_id`),
    KEY `category` (`category_id`),

    CONSTRAINT `borrower` FOREIGN KEY (`borrower_id`) REFERENCES `users` (`id`),
    CONSTRAINT `lender` FOREIGN KEY (`lender_id`) REFERENCES `users` (`id`),
    CONSTRAINT `category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `payments` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `loan_id` int(11) unsigned NOT NULL,
    `details` text DEFAULT NULL,
    `amount_cents` int(16) unsigned NOT NULL,

    `created_at` timestamp DEFAULT '2000-01-01 00:00:00',
    `updated_at` timestamp DEFAULT '2000-01-01 00:00:00',

    `sender_id` int(11) unsigned NOT NULL,
    `receiver_id` int(11) unsigned NOT NULL,

    PRIMARY KEY(`id`),

    KEY `loan` (`loan_id`),
    KEY `sender` (`sender_id`),
    KEY `receiver` (`receiver_id`),
    CONSTRAINT `loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`),
    CONSTRAINT `sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
    CONSTRAINT `receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
