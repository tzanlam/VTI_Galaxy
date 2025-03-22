-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema vti-movie-booking-ticket
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `vti-movie-booking-ticket` DEFAULT CHARACTER SET utf8mb4;
USE `vti-movie-booking-ticket`;

-- -----------------------------------------------------
-- Table `cinema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`cinema` (
  `cinema_id` INT NOT NULL AUTO_INCREMENT,
  `cinema_name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `phone_number` VARCHAR(15) NULL,
  PRIMARY KEY (`cinema_id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`account` (
  `account_id` INT NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(50) NOT NULL,
  `role` ENUM('ADMIN', 'USER') DEFAULT 'USER',
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `cinema_id` INT NULL,
  `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE') DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  INDEX `idx_email` (`email`),
  FOREIGN KEY (`cinema_id`) REFERENCES `vti-movie-booking-ticket`.`cinema` (`cinema_id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`room` (
  `room_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `type_screen` VARCHAR(45) NULL,
  `cinema_id` INT NULL,
  PRIMARY KEY (`room_id`),
  FOREIGN KEY (`cinema_id`) REFERENCES `vti-movie-booking-ticket`.`cinema` (`cinema_id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `seat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`seat` (
  `seat_id` INT NOT NULL AUTO_INCREMENT,
  `seat_name` VARCHAR(10) NOT NULL, -- Ví dụ: A1, B2
  `seat_price` DECIMAL(10,2) NULL,
  `seat_type` ENUM('STANDARD', 'VIP', 'COUPLE') NULL,
  `seat_num` INT NULL,
  PRIMARY KEY (`seat_id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `seat_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`seat_room` (
  `seat_room_id` INT NOT NULL AUTO_INCREMENT,
  `seat_id` INT NULL,
  `room_id` INT NULL,
  `status` ENUM('AVAILABLE', 'BOOKED', 'BROKEN') DEFAULT 'AVAILABLE',
  `price` DECIMAL(10,2) NULL,
  PRIMARY KEY (`seat_room_id`),
  FOREIGN KEY (`seat_id`) REFERENCES `vti-movie-booking-ticket`.`seat` (`seat_id`) ON DELETE SET NULL,
  FOREIGN KEY (`room_id`) REFERENCES `vti-movie-booking-ticket`.`room` (`room_id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `movie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`movie` (
  `movie_id` INT NOT NULL AUTO_INCREMENT,
  `movie_name` VARCHAR(100) NOT NULL,
  `genre` VARCHAR(45) NULL,
  `duration` INT NULL,
  `release_date` DATE NULL,
  `actor` VARCHAR(255) NULL,
  `director` VARCHAR(100) NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `showtime`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`showtime` (
  `showtime_id` INT NOT NULL AUTO_INCREMENT,
  `room_id` INT NULL,
  `movie_id` INT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `status` ENUM('UPCOMING', 'ONGOING', 'FINISHED') DEFAULT 'UPCOMING',
  PRIMARY KEY (`showtime_id`),
  FOREIGN KEY (`room_id`) REFERENCES `vti-movie-booking-ticket`.`room` (`room_id`) ON DELETE SET NULL,
  FOREIGN KEY (`movie_id`) REFERENCES `vti-movie-booking-ticket`.`movie` (`movie_id`) ON DELETE SET NULL,
  CONSTRAINT `chk_time` CHECK (`end_time` > `start_time`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`payment` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `method` ENUM('CASH', 'CARD', 'ONLINE') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`ticket` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `account_id` INT NULL,
  `showtime_id` INT NULL,
  `seat_room_id` INT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `payment_id` INT NULL,
  `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
  `booking_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`),
  FOREIGN KEY (`account_id`) REFERENCES `vti-movie-booking-ticket`.`account` (`account_id`) ON DELETE SET NULL,
  FOREIGN KEY (`showtime_id`) REFERENCES `vti-movie-booking-ticket`.`showtime` (`showtime_id`) ON DELETE SET NULL,
  FOREIGN KEY (`seat_room_id`) REFERENCES `vti-movie-booking-ticket`.`seat_room` (`seat_room_id`) ON DELETE SET NULL,
  FOREIGN KEY (`payment_id`) REFERENCES `vti-movie-booking-ticket`.`payment` (`payment_id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`employee` (
  `employee_id` INT NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(50) NOT NULL,
  `evaluate` VARCHAR(45) NULL,
  `cinema_id` INT NULL,
  PRIMARY KEY (`employee_id`),
  FOREIGN KEY (`cinema_id`) REFERENCES `vti-movie-booking-ticket`.`cinema` (`cinema_id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `statistical`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vti-movie-booking-ticket`.`statistical` (
  `statistical_id` INT NOT NULL AUTO_INCREMENT,
  `cinema_id` INT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_revenue` DECIMAL(15,2) DEFAULT 0.00,
  `total_tickets` INT DEFAULT 0,
  PRIMARY KEY (`statistical_id`),
  FOREIGN KEY (`cinema_id`) REFERENCES `vti-movie-booking-ticket`.`cinema` (`cinema_id`) ON DELETE SET NULL
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;