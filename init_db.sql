-- this is turned off for some stupid reason???
PRAGMA foreign_keys = TRUE;

DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS WorkTask;
DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS TaskComment;
DROP TABLE IF EXISTS ProjectComment;
DROP TABLE IF EXISTS Assignment;

CREATE TABLE Employee 
(
 idEmployee INTEGER PRIMARY KEY AUTOINCREMENT,
 favoriteTeam VARCHAR NOT NULL,
 age INTEGER NOT NULL,
 name VARCHAR NOT NULL,
 joinedOn INTEGER,
 idManager INTEGER,
 FOREIGN KEY(idManager) REFERENCES Employee (idEmployee)
);

CREATE TABLE WorkTask 
( 
 idWorkTask INTEGER PRIMARY KEY AUTOINCREMENT,
 name VARCHAR NOT NULL,
 content VARCHAR NOT NULL,
 done BOOLEAN NOT NULL,
 doneTimestamp DATETIME,
 createdAt DATETIME NOT NULL,
 idProject INTEGER,
 CHECK (done IN (TRUE, FALSE)),
 FOREIGN KEY(idProject) REFERENCES Project (idProject)
); 

CREATE TABLE Project 
( 
 idProject INTEGER PRIMARY KEY AUTOINCREMENT,
 name VARCHAR NOT NULL,
 idManager INTEGER NOT NULL,
 UNIQUE (name),
 FOREIGN KEY(idManager) REFERENCES Employee (idEmployee)
); 

CREATE TABLE Comment 
( 
 idComment INTEGER PRIMARY KEY AUTOINCREMENT,
 idEmployee INTEGER NOT NULL,
 content VARCHAR NOT NULL,
 FOREIGN KEY(idEmployee) REFERENCES Employee (idEmployee)
); 

CREATE TABLE TaskComment 
( 
 idComment INTEGER NOT NULL,
 idWorkTask INTEGER NOT NULL,
 UNIQUE (idComment),
 FOREIGN KEY(idComment) REFERENCES Comment (idComment),
 FOREIGN KEY(idWorkTask) REFERENCES WorkTask (idWorkTask)
); 

CREATE TABLE ProjectComment 
( 
 idComment INTEGER NOT NULL,
 idProject INTEGER NOT NULL,
 UNIQUE (idComment),
 FOREIGN KEY(idComment) REFERENCES Comment (idComment),
 FOREIGN KEY(idProject) REFERENCES Project (idProject)
); 

CREATE TABLE Assignment 
( 
 idEmployee INTEGER NOT NULL,
 idWorkTask INTEGER NOT NULL,
 idAssigned INTEGER PRIMARY KEY AUTOINCREMENT,
 FOREIGN KEY(idEmployee) REFERENCES Employee (idEmployee),
 FOREIGN KEY(idWorkTask) REFERENCES WorkTask (idWorkTask)
); 