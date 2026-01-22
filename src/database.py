import sqlite3 as sql
import hashlib
from datetime import datetime


def stable_hash(data: any):
    return hashlib.sha256(data.encode()).hexdigest()


# Wrapper class for a db connection that implements a bunch of helper methods
class DatabaseConnection:
    #TODO: use redis as a cache and introduce some delay
    def __init__(self, database_path: str):
        self.db: sql.Connection = sql.connect(database_path)
        self.db.row_factory = sql.Row
        self.cursor: sql.Cursor = self.db.cursor()

    def get_employee(self, employee_id: int):
        query = "SELECT * FROM employee WHERE idEmployee = (?) LIMIT 1"

        return self.cursor.execute(query, (employee_id, )).fetchone()

    def get_employees(self):
        return self.cursor.execute("SELECT * FROM employee").fetchall()

    def employee_exists(self, employee_id) -> bool:
        query = "SELECT 1 FROM employee WHERE idEmployee = ?;"
        row = self.cursor.execute(query, (employee_id, )).fetchone()
        if row:
            return True
        return False

    def add_employee(self, name, age: int, information, password: str, id_manager: int = None, favorite_team = "América Natal - RN"):
        exists = "SELECT 1 FROM employee WHERE name = ?;"
        row = self.cursor.execute(exists, (name, )).fetchone()
        if row:
            return 501 # Employee with this name already exists

        query = "INSERT INTO employee (name, age, information, password, idManager, favoriteTeam, joinedOn) VALUES (?, ?, ?, ?, ?, ?, ?);"

        # we know better
        favorite_team = "América Natal - RN"

        joined_on = str(datetime.now())

        salt = name + joined_on # none yet

        hashed_password = stable_hash(password + salt)

        self.cursor.execute(query, (name, age, information, hashed_password, id_manager, favorite_team, joined_on))

        self.db.commit()

        return 200
    
    def verify_password(self, employee_id, password):
        employee = self.cursor.execute("SELECT * FROM employee WHERE idEmployee = ?;", (employee_id, )).fetchone()

        if employee:
            return employee["password"] == stable_hash(password + employee["name"] + employee["joinedOn"])

    def get_task(self, task_id: int):
        query = "SELECT * FROM workTask WHERE idWorkTask = ?;"

        return self.cursor.execute(query, (task_id, )).fetchone()
    
    def task_exists(self, task_id) -> bool:
        query = "SELECT 1 FROM workTask WHERE idWorkTask = ?;"
        row = self.cursor.execute(query, (task_id, )).fetchone()
        if row:
            return True
        return False

    def add_task(self, name, content, done = False, done_time = None, project_id = None):
        query = "INSERT INTO workTask (name, content, done, doneTimeDate, createdAt, idProject) VALUES (?, ?, ?, ?, ?, ?);"
        self.cursor.execute(query, (name, content, done, done_time, str(datetime.now()), project_id))

    def get_tasks(self):
        return self.cursor.execute("SELECT * FROM workTask").fetchall()

    def mark_task_completed(self, task_id):
        query = "UPDATE workTask SET done = TRUE WHERE idWorkTask = ?;"

        self.cursor.execute(query, (task_id, ))

        task = self.get_task(task_id)
        if task is not None and task.get("done") == True:
            return True
        return False

    def assign_employee(self, task_id: int, employee_id: int):
        if self.task_exists(task_id) and self.employee_exists(employee_id):
            query = "INSERT INTO assignment (idWorkTask, idEmployee) VALUES (?, ?);"

            self.cursor.execute(query, (task_id, employee_id))

    def get_assigned(self, task_id: int):
        query = "SELECT e.* FROM employee e INNER JOIN assignment a ON e.idEmployee = a.idEmployee WHERE a.idWorkTask = ?;"

        return self.cursor.execute(query, (task_id, )).fetchall()

    def get_task_comments(self, task_id: int):
        query = "SELECT c.* FROM comment c INNER JOIN taskComment tc ON c.idComment = tc.idComment WHERE tc.idWorkTask = ?;"

        return self.cursor.execute(query, (task_id, )).fetchall()

    def post_task_comment(self, task_id: int, employee_id: int, comment: str):
        if self.task_exists(task_id) and self.employee_exists(employee_id):
            add_comment = "INSERT INTO comment (idEmployee, content) VALUES (?, ?);"

            self.cursor.execute(add_comment, (employee_id, comment))

            comment_id = self.cursor.lastrowid

            assign_comment = "INSERT INTO taskComment (idComment, idWorkTask) VALUES (?, ?);"

            self.cursor.execute(assign_comment, (comment_id, task_id))
    
    def get_project(self, project_id: int):
        query = "SELECT * FROM project WHERE idProject = ?;"

        return self.cursor.execute(query, (project_id, )).fetchone()
    
    def get_projects(self):
        query = "SELECT * FROM project;"

        return self.cursor.execute(query).fetchall()

    def get_project_tasks(self, project_id: int):
        query = "SELECT * FROM workTask WHERE idProject = ?;"

        return self.cursor.execute(query, (project_id, )).fetchall()

    def add_project(self, name, text, manager_id):
        if self.employee_exists(manager_id):
            query = "INSERT INTO project (name, text, idManager) VALUES (?, ?, ?);"

            self.cursor.execute(query, (name, text, manager_id))

            self.db.commit()

    def project_exists(self, project_id) -> bool:
        query = "SELECT 1 FROM project WHERE idProject = ?;"
        row = self.cursor.execute(query, (project_id, )).fetchone()
        if row:
            return True
        return False

    def get_project_comments(self, project_id: int):
        query = "SELECT c.* FROM comment c INNER JOIN taskComment tc ON c.idComment = tc.idComment WHERE tc.idWorkTask = ?;"

        return self.cursor.execute(query, (project_id, )).fetchall()

    def post_project_comment(self, project_id: int, employee_id: int, comment: str):
        if self.project_exists(project_id) and self.employee_exists(employee_id):
            add_comment = "INSERT INTO comment (idEmployee, content) VALUES (?, ?);"

            self.cursor.execute(add_comment, (employee_id, comment))

            comment_id = self.cursor.lastrowid

            assign_comment = "INSERT INTO projectComment (idComment, idProject) VALUES (?, ?);"

            self.cursor.execute(assign_comment, (comment_id, project_id))


    def close(self):
        if self.db is not None:
            self.db.close()
            self.db = None