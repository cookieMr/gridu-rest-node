CREATE TABLE IF NOT EXISTS users (
    ID              INT             NOT NULL AUTO_INCREMENT,
    USER_NAME       VARCHAR(50)     NOT NULL UNIQUE,

    PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS exercises (
    ID              INT             NOT NULL AUTO_INCREMENT,
    USER_ID         INT             NOT NULL,
    _DESCRIPTION    VARCHAR(255)    NOT NULL,
    DURATION        VARCHAR(50)     NOT NULL,
    _DATE           VARCHAR(10)     NOT NULL,

    PRIMARY KEY (ID),
    FOREIGN KEY (USER_ID) REFERENCES users(ID)
);
