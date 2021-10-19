const initDbQuery = {
    user: `CREATE TABLE IF NOT EXISTS \`users\`(
        ID INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        accountName VARCHAR(255) NOT NULL UNIQUE,
        fName VARCHAR(63) NOT NULL,
        lName VARCHAR(63),
        \`password\` TEXT NOT NULL,
        phone VARCHAR(15),
        email varchar(255) UNIQUE
    )`,
    event: `CREATE TABLE IF NOT EXISTS \`events\` (
        ID INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        location VARCHAR(511) NOT NULL UNIQUE,
        \`name\` VARCHAR(255) NOT NULL,
        \`description\` TEXT,
        startTime TIME,
        endTime TIME,
        creatorID INTEGER UNSIGNED,
        FOREIGN KEY (creatorID) REFERENCES \`users\` (ID) ON DELETE SET NULL
    )`,
    invite: `CREATE TABLE IF NOT EXISTS invite (
        hostID INTEGER UNSIGNED,
        guestID INTEGER UNSIGNED,
        \`status\` ENUM('not responsed', 'declined', 'accepted') NOT NULL,
        PRIMARY KEY (hostID, guestID),
        FOREIGN KEY (hostID) REFERENCES \`users\`(ID) ON DELETE CASCADE,
        FOREIGN KEY (guestID) REFERENCES \`users\`(ID) ON DELETE CASCADE
    )`,
    join: `CREATE TABLE IF NOT EXISTS \`join\` (
        eventID INTEGER UNSIGNED,
        participantID INTEGER UNSIGNED,
        PRIMARY KEY (eventID, participantID),
        FOREIGN KEY (eventID) REFERENCES \`users\`(ID) ON DELETE CASCADE,
        FOREIGN KEY (participantID) REFERENCES \`events\`(ID) ON DELETE CASCADE
    )`
};

module.exports = async function(callback) {
    await callback(initDbQuery.user);
    await callback(initDbQuery.event);
    await callback(initDbQuery.invite);
    await callback(initDbQuery.join);
}