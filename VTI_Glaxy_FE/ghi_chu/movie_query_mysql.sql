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

INSERT INTO `vti-movie-booking-ticket`.`cinema` (`cinema_name`, `address`, `status`, `phone_number`) VALUES
('VTI Cinema Hà Nội', '123 Đường Láng, Hà Nội', 'ACTIVE', '0901234567'),
('VTI Cinema TP.HCM', '456 Lê Lợi, TP.HCM', 'ACTIVE', '0902345678'),
('VTI Cinema Đà Nẵng', '789 Hùng Vương, Đà Nẵng', 'ACTIVE', '0903456789'),
('VTI Cinema Hải Phòng', '101 Trần Phú, Hải Phòng', 'ACTIVE', '0904567890'),
('VTI Cinema Cần Thơ', '202 Nguyễn Văn Cừ, Cần Thơ', 'ACTIVE', '0905678901'),
('VTI Cinema Nha Trang', '303 Trần Hưng Đạo, Nha Trang', 'ACTIVE', '0906789012'),
('VTI Cinema Huế', '404 Lê Duẩn, Huế', 'ACTIVE', '0907890123'),
('VTI Cinema Vinh', '505 Nguyễn Huệ, Vinh', 'ACTIVE', '0908901234'),
('VTI Cinema Quy Nhơn', '606 Nguyễn Tất Thành, Quy Nhơn', 'ACTIVE', '0909012345'),
('VTI Cinema Buôn Ma Thuột', '707 Lê Thánh Tông, Buôn Ma Thuột', 'ACTIVE', '0900123456');

INSERT INTO `vti-movie-booking-ticket`.`account` (`fullname`, `role`, `email`, `cinema_id`, `status`, `created_at`) VALUES
('Nguyễn Văn A', 'ADMIN', 'admin1@vti.com', 1, 'ACTIVE', '2025-03-22 08:00:00'),
('Trần Thị B', 'USER', 'user1@vti.com', 2, 'ACTIVE', '2025-03-22 08:05:00'),
('Lê Văn C', 'USER', 'user2@vti.com', 3, 'PENDING', '2025-03-22 08:10:00'),
('Phạm Thị D', 'ADMIN', 'admin2@vti.com', 4, 'ACTIVE', '2025-03-22 08:15:00'),
('Hoàng Văn E', 'USER', 'user3@vti.com', 5, 'ACTIVE', '2025-03-22 08:20:00'),
('Ngô Thị F', 'USER', 'user4@vti.com', 6, 'INACTIVE', '2025-03-22 08:25:00'),
('Đỗ Văn G', 'USER', 'user5@vti.com', 7, 'ACTIVE', '2025-03-22 08:30:00'),
('Bùi Thị H', 'ADMIN', 'admin3@vti.com', 8, 'ACTIVE', '2025-03-22 08:35:00'),
('Vũ Văn I', 'USER', 'user6@vti.com', 9, 'PENDING', '2025-03-22 08:40:00'),
('Trương Thị K', 'USER', 'user7@vti.com', 10, 'ACTIVE', '2025-03-22 08:45:00');

INSERT INTO `vti-movie-booking-ticket`.`room` (`name`, `type_screen`, `cinema_id`) VALUES
('Room 1', '2D', 1),
('Room 2', '3D', 1),
('Room 1', '2D', 2),
('Room 2', 'IMAX', 2),
('Room 1', '3D', 3),
('Room 1', '2D', 4),
('Room 1', '3D', 5),
('Room 2', '2D', 6),
('Room 1', 'IMAX', 7),
('Room 1', '2D', 8);

INSERT INTO `vti-movie-booking-ticket`.`seat` (`seat_name`, `seat_price`, `seat_type`, `seat_num`) VALUES
('A1', 80000.00, 'STANDARD', 1),
('A2', 80000.00, 'STANDARD', 2),
('B1', 100000.00, 'VIP', 3),
('B2', 100000.00, 'VIP', 4),
('C1', 120000.00, 'COUPLE', 5),
('C2', 120000.00, 'COUPLE', 6),
('D1', 80000.00, 'STANDARD', 7),
('D2', 80000.00, 'STANDARD', 8),
('E1', 100000.00, 'VIP', 9),
('E2', 100000.00, 'VIP', 10);

INSERT INTO `vti-movie-booking-ticket`.`movie` (`movie_name`, `genre`, `duration`, `release_date`, `actor`, `director`, `description`) VALUES
('Avengers: Endgame', 'Action', 180, '2019-04-26', 'Robert Downey Jr.', 'Russo Brothers', 'Epic superhero finale'),
('Inception', 'Sci-Fi', 148, '2010-07-16', 'Leonardo DiCaprio', 'Christopher Nolan', 'Dream heist thriller'),
('Titanic', 'Romance', 195, '1997-12-19', 'Kate Winslet', 'James Cameron', 'Tragic love story'),
('The Matrix', 'Sci-Fi', 136, '1999-03-31', 'Keanu Reeves', 'Wachowski', 'Virtual reality action'),
('Frozen', 'Animation', 102, '2013-11-27', 'Kristen Bell', 'Chris Buck', 'Magical sister tale'),
('Parasite', 'Thriller', 132, '2019-05-30', 'Choi Woo-shik', 'Bong Joon-ho', 'Class struggle drama'),
('The Lion King', 'Animation', 118, '1994-06-24', 'Matthew Broderick', 'Roger Allers', 'African savanna adventure'),
('Joker', 'Drama', 122, '2019-10-04', 'Joaquin Phoenix', 'Todd Phillips', 'Dark character study'),
('Interstellar', 'Sci-Fi', 169, '2014-11-07', 'Matthew McConaughey', 'Christopher Nolan', 'Space exploration epic'),
('Avatar', 'Sci-Fi', 162, '2009-12-18', 'Sam Worthington', 'James Cameron', 'Pandora adventure');


DELETE FROM `vti-movie-booking-ticket`.`showtime`;
TRUNCATE TABLE `vti-movie-booking-ticket`.`showtime`;
INSERT INTO `vti-movie-booking-ticket`.`showtime` (`room_id`, `movie_id`, `start_time`, `end_time`, `status`) VALUES
-- Ngày 2025-03-22 (dữ liệu cũ đã sửa)
(1, 1, '2025-03-22 10:00:00', '2025-03-22 13:00:00', 'UPCOMING'),  -- Avengers: Endgame (180 phút)
(1, 10, '2025-03-22 13:30:00', '2025-03-22 16:12:00', 'UPCOMING'), -- Avatar (162 phút)
(2, 1, '2025-03-22 14:00:00', '2025-03-22 17:00:00', 'UPCOMING'),  -- Avengers: Endgame (180 phút)
(3, 2, '2025-03-22 15:00:00', '2025-03-22 17:28:00', 'UPCOMING'),  -- Inception (148 phút)
(4, 3, '2025-03-22 18:00:00', '2025-03-22 21:15:00', 'UPCOMING'),  -- Titanic (195 phút)
(5, 4, '2025-03-22 13:00:00', '2025-03-22 14:56:00', 'UPCOMING'),  -- The Matrix (136 phút)
(6, 5, '2025-03-22 16:00:00', '2025-03-22 17:42:00', 'UPCOMING'),  -- Frozen (102 phút)
(7, 6, '2025-03-22 19:00:00', '2025-03-22 21:12:00', 'UPCOMING'),  -- Parasite (132 phút)
(8, 7, '2025-03-22 11:00:00', '2025-03-22 12:58:00', 'UPCOMING'),  -- The Lion King (118 phút)
(9, 8, '2025-03-22 20:00:00', '2025-03-22 22:02:00', 'UPCOMING'),  -- Joker (122 phút)
(10, 9, '2025-03-22 17:00:00', '2025-03-22 19:49:00', 'UPCOMING'), -- Interstellar (169 phút)
-- Ngày 2025-03-23 (dữ liệu mới)
(1, 2, '2025-03-23 10:00:00', '2025-03-23 12:28:00', 'UPCOMING'),  -- Inception (148 phút)
(2, 3, '2025-03-23 13:00:00', '2025-03-23 16:15:00', 'UPCOMING'),  -- Titanic (195 phút)
(3, 4, '2025-03-23 15:00:00', '2025-03-23 17:16:00', 'UPCOMING'),  -- The Matrix (136 phút)
(4, 5, '2025-03-23 18:00:00', '2025-03-23 19:42:00', 'UPCOMING'),  -- Frozen (102 phút)
(5, 6, '2025-03-23 11:00:00', '2025-03-23 13:12:00', 'UPCOMING'),  -- Parasite (132 phút)
(6, 7, '2025-03-23 14:00:00', '2025-03-23 15:58:00', 'UPCOMING'),  -- The Lion King (118 phút)
(7, 8, '2025-03-23 19:00:00', '2025-03-23 21:02:00', 'UPCOMING'),  -- Joker (122 phút)
(8, 9, '2025-03-23 16:00:00', '2025-03-23 18:49:00', 'UPCOMING'),  -- Interstellar (169 phút)
(9, 10, '2025-03-23 20:00:00', '2025-03-23 22:42:00', 'UPCOMING'), -- Avatar (162 phút)
(10, 1, '2025-03-23 12:00:00', '2025-03-23 15:00:00', 'UPCOMING'); -- Avengers: Endgame (180 phút)

INSERT INTO `vti-movie-booking-ticket`.`seat_room` (`seat_id`, `room_id`, `status`, `price`) VALUES
(1, 1, 'AVAILABLE', 80000.00),
(2, 1, 'AVAILABLE', 80000.00),
(3, 2, 'AVAILABLE', 100000.00),
(4, 2, 'BOOKED', 100000.00),
(5, 3, 'AVAILABLE', 120000.00),
(6, 4, 'AVAILABLE', 120000.00),
(7, 5, 'AVAILABLE', 80000.00),
(8, 6, 'BOOKED', 80000.00),
(9, 7, 'AVAILABLE', 100000.00),
(10, 8, 'AVAILABLE', 100000.00);

INSERT INTO `vti-movie-booking-ticket`.`payment` (`method`, `amount`, `status`, `created_at`) VALUES
('CASH', 80000.00, 'COMPLETED', '2025-03-22 09:00:00'),
('CARD', 100000.00, 'COMPLETED', '2025-03-22 09:05:00'),
('ONLINE', 120000.00, 'PENDING', '2025-03-22 09:10:00'),
('CASH', 80000.00, 'COMPLETED', '2025-03-22 09:15:00'),
('CARD', 100000.00, 'FAILED', '2025-03-22 09:20:00'),
('ONLINE', 120000.00, 'COMPLETED', '2025-03-22 09:25:00'),
('CASH', 80000.00, 'COMPLETED', '2025-03-22 09:30:00'),
('CARD', 100000.00, 'PENDING', '2025-03-22 09:35:00'),
('ONLINE', 120000.00, 'COMPLETED', '2025-03-22 09:40:00'),
('CASH', 80000.00, 'COMPLETED', '2025-03-22 09:45:00');

INSERT INTO `vti-movie-booking-ticket`.`ticket` (`account_id`, `showtime_id`, `seat_room_id`, `total_price`, `payment_id`, `status`, `booking_date`) VALUES
(1, 1, 1, 80000.00, 1, 'CONFIRMED', '2025-03-22 09:00:00'),
(2, 2, 3, 100000.00, 2, 'CONFIRMED', '2025-03-22 09:05:00'),
(3, 3, 5, 120000.00, 3, 'PENDING', '2025-03-22 09:10:00'),
(4, 4, 6, 120000.00, 4, 'CONFIRMED', '2025-03-22 09:15:00'),
(5, 5, 7, 80000.00, 5, 'CANCELLED', '2025-03-22 09:20:00'),
(6, 6, 9, 100000.00, 6, 'CONFIRMED', '2025-03-22 09:25:00'),
(7, 7, 10, 100000.00, 7, 'CONFIRMED', '2025-03-22 09:30:00'),
(8, 8, 2, 80000.00, 8, 'PENDING', '2025-03-22 09:35:00'),
(9, 9, 4, 100000.00, 9, 'CONFIRMED', '2025-03-22 09:40:00'),
(10, 10, 8, 80000.00, 10, 'CONFIRMED', '2025-03-22 09:45:00');

SELECT * FROM account;
SELECT * FROM cinema;
SELECT * FROM room;
SELECT * FROM seat;
SELECT * FROM movie;
SELECT * FROM showtime;
SELECT * FROM seat_room;



--  Truy vấn lấy danh sách giờ chiếu của một phim
-- Để lấy danh sách giờ chiếu cho một phim cụ thể, bạn có thể sử dụng truy vấn SQL như sau:
SELECT 
    s.showtime_id,
    s.start_time,
    s.end_time,
    s.status,
    m.movie_name,
    r.name AS room_name
FROM 
    `vti-movie-booking-ticket`.`showtime` s
JOIN 
    `vti-movie-booking-ticket`.`movie` m ON s.movie_id = m.movie_id
JOIN 
    `vti-movie-booking-ticket`.`room` r ON s.room_id = r.room_id
ORDER BY 
    s.start_time ASC;


-- 1. Kiểm tra và đặt lịch chiếu cho một giờ cụ thể
-- Giả sử bạn muốn đặt phim với movie_id = 1 vào ngày 2025-03-23 14:00 trong room_id = 1, bạn cần:
-- Kiểm tra phòng trống:
SELECT COUNT(*) 
FROM `vti-movie-booking-ticket`.`showtime`
WHERE `room_id` = 1
AND (
    (`start_time` <= '2025-03-23 14:00:00' AND `end_time` > '2025-03-23 14:00:00')
    OR (`start_time` < '2025-03-23 15:30:00' AND `end_time` >= '2025-03-23 15:30:00')
    OR (`start_time` >= '2025-03-23 14:00:00' AND `end_time` <= '2025-03-23 15:30:00')
);

-- Giả sử thời lượng phim là 1.5 giờ (end_time = start_time + 1.5 giờ).
-- Nếu kết quả trả về 0, phòng trống và có thể đặt lịch.
-- Thêm lịch chiếu:
INSERT INTO `vti-movie-booking-ticket`.`showtime` 
(`room_id`, `movie_id`, `start_time`, `end_time`, `status`)
VALUES 
(1, 1, '2025-03-23 14:00:00', '2025-03-23 15:30:00', 'UPCOMING');

-- 2. Lấy danh sách giờ chiếu
-- Trường hợp 1: Một phim, một giờ chiếu
SELECT `start_time`, `end_time`, `room_id`, `status`
FROM `vti-movie-booking-ticket`.`showtime`
WHERE `movie_id` = 1
AND `start_time` >= CURDATE()
ORDER BY `start_time` ASC
LIMIT 1;
-- Nếu không có dữ liệu, trả về thông báo: "Hiện tại chưa có lịch chiếu cho phim này."

-- Trường hợp 2: Một phim, nhiều giờ chiếu
SELECT `start_time`, `end_time`, `room_id`, `status`
FROM `vti-movie-booking-ticket`.`showtime`
WHERE `movie_id` = 1
AND `start_time` >= CURDATE()
ORDER BY `start_time` ASC;
-- Nếu danh sách rỗng, trả về: "Chưa có lịch chiếu. Bạn có muốn đặt lịch mới không?"

-- Trường hợp 3: Nhiều phim, nhiều giờ chiếu
SELECT s.`movie_id`, m.`movie_name`, s.`start_time`, s.`end_time`, s.`room_id`, s.`status`
FROM `vti-movie-booking-ticket`.`showtime` s
JOIN `vti-movie-booking-ticket`.`movie` m ON s.`movie_id` = m.`movie_id`
WHERE s.`start_time` >= CURDATE()
ORDER BY s.`start_time` ASC;
-- Lọc thêm theo movie_id hoặc room_id nếu cần.

-- 3. Xử lý khi không có dữ liệu
-- Nếu truy vấn trả về rỗng:
-- Gợi ý các giờ trống trong ngày:
SELECT r.`room_id`
FROM `vti-movie-booking-ticket`.`room` r
WHERE r.`room_id` NOT IN (
    SELECT `room_id`
    FROM `vti-movie-booking-ticket`.`showtime`
    WHERE `start_time` <= '2025-03-23 14:00:00'
    AND `end_time` > '2025-03-23 14:00:00'
)
LIMIT 1;
-- Trả về thông báo: "Không có lịch chiếu lúc 14:00. Phòng X trống, bạn có muốn đặt không?"

-- 4. Best Practice
-- Transaction: Sử dụng transaction khi thêm lịch chiếu để đảm bảo tính toàn vẹn dữ liệu:
START TRANSACTION;
-- Kiểm tra phòng trống (truy vấn ở trên)
-- Nếu trống, thực hiện INSERT
INSERT INTO `vti-movie-booking-ticket`.`showtime` 
(`room_id`, `movie_id`, `start_time`, `end_time`, `status`)
VALUES 
(1, 1, '2025-03-23 14:00:00', '2025-03-23 15:30:00', 'UPCOMING');
COMMIT;


