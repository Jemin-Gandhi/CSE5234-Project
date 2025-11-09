-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema vacationsalesdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `vacationsalesdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `vacationsalesdb` ;

-- -----------------------------------------------------
-- Table `vacationsalesdb`.`ADDRESS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`ADDRESS` (
  `ADDRESS_ID` INT NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(255) NULL DEFAULT NULL,
  `ADDRESS1` VARCHAR(255) NULL DEFAULT NULL,
  `ADDRESS2` VARCHAR(255) NULL DEFAULT NULL,
  `CITY` VARCHAR(255) NULL DEFAULT NULL,
  `STATE` VARCHAR(255) NULL DEFAULT NULL,
  `POSTAL_CODE` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ADDRESS_ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`Vacation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`Vacation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `price` DOUBLE NOT NULL,
  `duration` VARCHAR(100) NULL DEFAULT NULL,
  `departureDate` DATE NULL DEFAULT NULL,
  `shortDescription` VARCHAR(255) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `availableTickets` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`Highlight`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`Highlight` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `highlightDescription` VARCHAR(255) NOT NULL,
  `vacationId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `vacationId` (`vacationId` ASC) VISIBLE,
  CONSTRAINT `Highlight_ibfk_1`
    FOREIGN KEY (`vacationId`)
    REFERENCES `vacationsalesdb`.`Vacation` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`Image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `imageURL` VARCHAR(500) NOT NULL,
  `vacationId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `vacationId` (`vacationId` ASC) VISIBLE,
  CONSTRAINT `Image_ibfk_1`
    FOREIGN KEY (`vacationId`)
    REFERENCES `vacationsalesdb`.`Vacation` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`Include`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`Include` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `amenityDescription` VARCHAR(255) NOT NULL,
  `vacationId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `vacationId` (`vacationId` ASC) VISIBLE,
  CONSTRAINT `Include_ibfk_1`
    FOREIGN KEY (`vacationId`)
    REFERENCES `vacationsalesdb`.`Vacation` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 36
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`ORDERS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`ORDERS` (
  `ORDER_ID` INT NOT NULL AUTO_INCREMENT,
  `CUSTOMER_NAME` VARCHAR(255) NULL DEFAULT NULL,
  `ORDER_CONFIRMATION_NUMBER` VARCHAR(255) NULL DEFAULT NULL,
  `SHIPPING_INFO_CONFIRMATION_NUMBER` VARCHAR(255) NULL DEFAULT NULL,
  `PAYMENT_INFO_CONFIRMATION_NUMBER` VARCHAR(255) NULL DEFAULT NULL,
  `STATUS` VARCHAR(255) NULL DEFAULT 'New',
  PRIMARY KEY (`ORDER_ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`ORDER_LINE_ITEM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`ORDER_LINE_ITEM` (
  `ORDER_LINE_ITEM_ID` INT NOT NULL AUTO_INCREMENT,
  `ORDER_ID` INT NULL DEFAULT NULL,
  `NAME` VARCHAR(255) NULL DEFAULT NULL,
  `QUANTITY` INT NULL DEFAULT NULL,
  `PRICE` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`ORDER_LINE_ITEM_ID`),
  INDEX `ORDER_ID` (`ORDER_ID` ASC) VISIBLE,
  CONSTRAINT `ORDER_LINE_ITEM_ibfk_1`
    FOREIGN KEY (`ORDER_ID`)
    REFERENCES `vacationsalesdb`.`ORDERS` (`ORDER_ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`PAYMENT_INFO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`PAYMENT_INFO` (
  `PAYMENT_INFO_ID` INT NOT NULL AUTO_INCREMENT,
  `PAYMENT_INFO_CONFIRMATION_NUMBER` VARCHAR(255) NULL DEFAULT NULL,
  `HOLDER_NAME` VARCHAR(255) NULL DEFAULT NULL,
  `CARD_NUM` VARCHAR(255) NULL DEFAULT NULL,
  `EXP_DATE` VARCHAR(255) NULL DEFAULT NULL,
  `CVV` CHAR(3) NULL DEFAULT NULL,
  PRIMARY KEY (`PAYMENT_INFO_ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `vacationsalesdb`.`SHIPPING_INFO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacationsalesdb`.`SHIPPING_INFO` (
  `SHIPPING_ID` INT NOT NULL AUTO_INCREMENT,
  `SHIPPING_INFO_CONFIRMATION_NUMBER` INT NULL DEFAULT NULL,
  `BUSINESS_ID` INT NULL DEFAULT NULL,
  `ADDRESS_ID` INT NULL DEFAULT NULL,
  `NUM_PACKETS` INT NULL DEFAULT NULL,
  `WEIGHT` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`SHIPPING_ID`),
  INDEX `ADDRESS_ID` (`ADDRESS_ID` ASC) VISIBLE,
  CONSTRAINT `SHIPPING_INFO_ibfk_1`
    FOREIGN KEY (`ADDRESS_ID`)
    REFERENCES `vacationsalesdb`.`ADDRESS` (`ADDRESS_ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
