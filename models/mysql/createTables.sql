
/* must be created in this order due to foreign key constraint */

USE drugrx_db;

CREATE TABLE user (
  email VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  sex CHAR(1) NOT NULL,

  PRIMARY KEY ( email ) 
);

CREATE TABLE drug (
  ID int NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  drugname1 VARCHAR(255) NOT NULL,
  drugname2 VARCHAR(255) NOT NULL,
  
  PRIMARY KEY ( ID ),
  FOREIGN KEY (email) REFERENCES user(email)
);


