# Dump of tables for the uomi database!
# ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS uomi;

CREATE TABLE IF NOT EXISTS `users`(
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `email` varchar(256) NOT NULL,
 `name` varchar(128) DEFAULT NULL,
 `password` char(128) DEFAULT NULL,
 `salt` char(64) DEFAULT NULL,
 `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp DEFAULT '2001-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `settings`(
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `user_id` int(11) unsigned NOT NULL,
 `allow_notif` boolean NULL DEFAULT 1,
 `borrow_requests` boolean NULL DEFAULT 2,
 `payback_reminders` boolean NULL DEFAULT 1,
 `view_email` boolean NULL DEFAULT 1,
 `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp DEFAULT '2001-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  KEY `user_sett` (`user_id`),
  CONSTRAINT `user_sett` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `categories` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `name` varchar(64) NOT NULL,
 `use_count` int(11) DEFAULT 1,
 `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp DEFAULT '2001-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `loans` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `to_user` int(11) unsigned NOT NULL,
 `from_user` int(11) unsigned NOT NULL,
 `details` varchar(256) DEFAULT NULL,
 `amount_cents` int(16) unsigned NOT NULL,
 `category_id` int(11) unsigned DEFAULT NULL,
 `posted_date` timestamp DEFAULT CURRENT_TIMESTAMP,
 `accepted_date` timestamp DEFAULT '2001-01-01 00:00:00',
 `resolved_date` timestamp DEFAULT '2001-01-01 00:00:00',
 `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp DEFAULT '2001-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  KEY `borrower` (`to_user`),
  KEY `lender` (`from_user`),
  KEY `category` (`category_id`),
  CONSTRAINT `borrower` FOREIGN KEY (`to_user`) REFERENCES `users` (`id`),
  CONSTRAINT `lender` FOREIGN KEY (`from_user`) REFERENCES `users` (`id`),
  CONSTRAINT `category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `payments` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `loan_id` int(11) unsigned NOT NULL,
 `details` varchar(256) DEFAULT NULL,
 `amount_cents` int(16) unsigned NOT NULL,
 `posted_date` timestamp DEFAULT CURRENT_TIMESTAMP,
 `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp DEFAULT '2001-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  KEY `loan` (`loan_id`),
  CONSTRAINT `loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notifications` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `user_id` int(11) unsigned NOT NULL,
 `data` varchar(1024) DEFAULT NULL,
 `notification_date` timestamp DEFAULT CURRENT_TIMESTAMP,
 `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp DEFAULT '2001-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  KEY `user_notf` (`user_id`),
  CONSTRAINT `user_notf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
