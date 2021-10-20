CREATE SCHEMA IF NOT EXISTS event_management;
USE event_management;

CREATE TABLE IF NOT EXISTS `users`(
	ID INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    accountName VARCHAR(255) NOT NULL UNIQUE,
    fName VARCHAR(63) NOT NULL,
    lName VARCHAR(63),
    `password` TEXT NOT NULL,
    phone VARCHAR(15),
    email varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `events` (
	ID INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(511) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
	`description` TEXT,
    startTime TIME,
    endTime TIME,
    creatorID INTEGER UNSIGNED,
    FOREIGN KEY (creatorID) REFERENCES `users`(ID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invite (
	hostID INTEGER UNSIGNED,
    guestID INTEGER UNSIGNED,
    eventID INTEGER UNSIGNED,
    `status` ENUM('not responsed', 'declined', 'accepted') NOT NULL,
    `role` ENUM('restricted', 'edit') NOT NULL,
    PRIMARY KEY (hostID, guestID, eventID),
    FOREIGN KEY (hostID) REFERENCES `users`(ID) ON DELETE CASCADE,
    FOREIGN KEY (guestID) REFERENCES `users`(ID) ON DELETE CASCADE,
    FOREIGN KEY (eventID) REFERENCES `events`(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `join` (
	eventID INTEGER UNSIGNED,
    participantID INTEGER UNSIGNED,
    PRIMARY KEY (eventID, participantID),
    FOREIGN KEY (eventID) REFERENCES `users`(ID) ON DELETE CASCADE,
    FOREIGN KEY (participantID) REFERENCES `events`(ID) ON DELETE CASCADE
)

