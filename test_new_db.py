import sqlite3 as sql

db = sql.connect("worker_database.db")

cursor = db.cursor()

with open("init_db.sql") as file:
    script = file.read()
    cursor.executescript(script)
    db.commit()

db.commit()