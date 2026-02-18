-- this is turned off for some stupid reason???
PRAGMA foreign_keys = TRUE;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS workTask;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS taskComment;
DROP TABLE IF EXISTS projectComment;
DROP TABLE IF EXISTS assignment;

CREATE TABLE employee 
(
 idEmployee INTEGER PRIMARY KEY AUTOINCREMENT,
 favoriteTeam VARCHAR NOT NULL,
 age INTEGER NOT NULL,
 name VARCHAR NOT NULL,
 information VARCHAR,
 joinedOn INTEGER,
 password BLOB,
 idManager INTEGER,
 FOREIGN KEY(idManager) REFERENCES employee (idEmployee)
);

CREATE TABLE workTask 
( 
 idWorkTask INTEGER PRIMARY KEY AUTOINCREMENT,
 name VARCHAR NOT NULL,
 content VARCHAR NOT NULL,
 done BOOLEAN NOT NULL,
 doneTimestamp DATETIME,
 createdAt DATETIME NOT NULL,
 idProject INTEGER,
 CHECK (done IN (TRUE, FALSE)),
 FOREIGN KEY(idProject) REFERENCES project (idProject)
); 

CREATE TABLE project 
( 
 idProject INTEGER PRIMARY KEY AUTOINCREMENT,
 name VARCHAR NOT NULL,
 idManager INTEGER NOT NULL,
 UNIQUE (name),
 FOREIGN KEY(idManager) REFERENCES employee (idEmployee)
); 

CREATE TABLE comment 
( 
 idComment INTEGER PRIMARY KEY AUTOINCREMENT,
 idEmployee INTEGER NOT NULL,
 content VARCHAR NOT NULL,
 createdAt NOT NULL,
 FOREIGN KEY(idEmployee) REFERENCES employee (idEmployee)
); 

CREATE TABLE taskComment 
( 
 idComment INTEGER NOT NULL,
 idWorkTask INTEGER NOT NULL,
 UNIQUE (idComment),
 FOREIGN KEY(idComment) REFERENCES comment (idComment),
 FOREIGN KEY(idWorkTask) REFERENCES workTask (idWorkTask)
); 

CREATE TABLE projectComment 
( 
 idComment INTEGER NOT NULL,
 idProject INTEGER NOT NULL,
 UNIQUE (idComment),
 FOREIGN KEY(idComment) REFERENCES comment (idComment),
 FOREIGN KEY(idProject) REFERENCES project (idProject)
); 

CREATE TABLE assignment 
( 
 idEmployee INTEGER NOT NULL,
 idWorkTask INTEGER NOT NULL,
 idAssigned INTEGER PRIMARY KEY AUTOINCREMENT,
 FOREIGN KEY(idEmployee) REFERENCES employee (idEmployee),
 FOREIGN KEY(idWorkTask) REFERENCES workTask (idWorkTask)
); 