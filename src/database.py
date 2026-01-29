import sqlite3 as sql
import hashlib
import redis
from datetime import datetime
from time import sleep, time

def stable_hash(data: any):
    return hashlib.sha256(data.encode()).hexdigest()

CURSOR_DELAY = 0.25

# redis things
# employee:<id> name age information favoriteTeam joinedOn password idManager
# task:<id> name content done doneTimestamp createdAt idProject
# project:id name idManager text

class SlowCursor(sql.Cursor):
    def _delay(self):
        sleep(CURSOR_DELAY)

    def execute(self, *args, **kwargs):
        self._delay()
        return super().execute(*args, **kwargs)
    
    def executemany(self, *args, **kwargs):
        self._delay()
        return super().executemany(*args, **kwargs)
    
    def fetchone(self, *args, **kwargs):
        self._delay()
        return super().fetchone(*args, **kwargs)
    
    def fetchall(self, *args, **kwargs):
        self._delay()
        return super().fetchall(*args, **kwargs)

class SlowDatabase(sql.Connection):
    def cursor(self, factory: None = None):
        return super().cursor(factory=SlowCursor) if factory else super().cursor()

# Wrapper class for a db connection that implements a bunch of helper methods
class DatabaseConnection:
    #TODO: use redis as a cache and introduce some delay
    def __init__(self, database_path: str, redis_url: str):
        if redis_url:
            try:
                self.redis_db = redis.Redis(host=redis_url, db=0, decode_responses=True)
                self.cache_enabled = True
            except:
                self.cache_enabled = False
            
            if not self.redis_db:
                self.cache_enabled = False
        else:
            self.cache_enabled = False

        # Toggle database delay when cache is enabled
        # Used to prevent unnecessary delay when developing
        if self.cache_enabled:
            db_factory = SlowDatabase
        else:
            db_factory = None

        self.db: sql.Connection = sql.connect(database_path, factory=db_factory) if db_factory else sql.connect(database_path)
        self.db.row_factory = sql.Row
        self.cursor: sql.Cursor = self.db.cursor()

        # set foreign keys to actually be enforced
        self.cursor.execute("PRAGMA foreign_keys = ON;")

    def get_employee(self, employee_id: int):
        employee = None
        if self.cache_enabled:
            employee = self.redis_db.hgetall(f"employee:{employee_id}")
            if employee:
                self.redis_db.expire(f"employee:{employee_id}", 10)
        if not employee:
            query = "SELECT * FROM employee WHERE idEmployee = (?) LIMIT 1;"

            employee = self.cursor.execute(query, (employee_id, )).fetchone()

        if employee and self.cache_enabled:
            self.redis_db.hset(f"employee:{employee_id}", mapping = {
                "name": employee["name"],
                "age": employee["age"],
                "information": employee["information"] if employee["information"] else "",
                "favoriteTeam": employee["favoriteTeam"],
                "joinedOn": employee["joinedOn"],
                "password": employee["password"],
                "idManager": employee["idManager"] if employee["idManager"] else -1
            })

            self.redis_db.expire(f"employee:{employee_id}", 10)

        return employee

    def get_employees(self):
        return self.cursor.execute("SELECT * FROM employee;").fetchall()

    def employee_exists(self, employee_id: int) -> bool:
        if self.cache_enabled:
            employee = self.redis_db.hget(f"employee:{employee_id}", "name")
            if employee:
                return True
        query = "SELECT 1 FROM employee WHERE idEmployee = ?;"
        row = self.cursor.execute(query, (employee_id, )).fetchone()
        if row:
            return True
        return False

    def add_employee(self, name: str, age: int, information: str, password: str, id_manager: int = None, favorite_team: str = "América Natal - RN", joinedOn: datetime = None):
        if self.cache_enabled:
            exists = self.redis_db.get(f"employee_exists:{name}")
            if exists:
                return 501
        else:
            exists = "SELECT 1 FROM employee WHERE name = ?;"
            row = self.cursor.execute(exists, (name, )).fetchone()
            if row:
                return 501 # Employee with this name already exists

        query = "INSERT INTO employee (name, age, information, password, idManager, favoriteTeam, joinedOn) VALUES (?, ?, ?, ?, ?, ?, ?);"

        # we know better
        favorite_team = "América Natal - RN"

        salt = name + joinedOn # none yet

        hashed_password = stable_hash(password + salt)

        self.cursor.execute(query, (name, age, information, hashed_password, id_manager, favorite_team, joinedOn))

        self.db.commit()

        # Add employee exists to cache
        if self.cache_enabled:
            self.redis_db.set(f"employee_exists:{name}", 1)

        return 200
    
    def verify_password(self, employee_id: str, password: str):
        employee = self.get_employee(employee_id=employee_id)

        if employee:
            return employee["password"] == stable_hash(password + employee["name"] + employee["joinedOn"])

    def get_task(self, task_id: int):
        task = None
        if self.cache_enabled:
            task = self.redis_db.hgetall(f"task:{task_id}")
            if task:
                self.redis_db.expire(f"task:{task_id}", 10)
        if not task:
            query = "SELECT * FROM workTask WHERE idWorkTask = ?;"
            
            task = self.cursor.execute(query, (task_id, )).fetchone()

        if task and self.cache_enabled:
            self.redis_db.hset(f"task:{task_id}", mapping = {
                "name": task["name"],
                "content": task["content"],
                "done": task["done"],
                "doneTimestamp": task["doneTimestamp"] if task["doneTimestamp"] else "",
                "createdAt": task["createdAt"],
                "idProject": task["idProject"] if task["idProject"] else -1,
            })

            self.redis_db.expire(f"task:{task_id}", 10)

        self.db.commit()

        return task
    
    def task_exists(self, task_id: int) -> bool:
        if self.cache_enabled:
            task = self.redis_db.hget(f"task:{task_id}", "name")
            if task:
                return True
            
        query = "SELECT 1 FROM workTask WHERE idWorkTask = ?;"
        row = self.cursor.execute(query, (task_id, )).fetchone()
        if row:
            return True
        return False

    def add_task(self, name: str, content: str, done: bool = False, done_time: str = None, project_id: int = None):
        query = "INSERT INTO workTask (name, content, done, doneTimeDate, createdAt, idProject) VALUES (?, ?, ?, ?, ?, ?);"
        self.cursor.execute(query, (name, content, done, done_time, str(datetime.now()), project_id))

        self.db.commit()

    def edit_task(self, task_id: int, name: str, content: str, done: bool = False, done_time: str = None, project_id: int = None):
        if self.task_exists(project_id):
            query = "UPDATE project SET name = ?, content = ?, done = ?, done_time = ?, idProject = ? WHERE idWorkTask = ?;"
            
            try:
                self.cursor.execute(query, (name, content, done, done_time, project_id, task_id))
                
                self.db.commit()

                if self.cache_enabled:
                    # remove task from cache
                    self.redis_db.delete(f"task:{task_id}")

                return 201
            except sql.IntegrityError:
                return 501

    def get_tasks(self):
        return self.cursor.execute("SELECT * FROM workTask;").fetchall()

    def delete_task(self, task_id: int):
        #TODO: do some auth
        try:
            # try to just delete the project
            query = "DELETE FROM workTask WHERE idWorkTask = ?;"
            self.cursor.execute(query, (task_id, ))
        except sql.IntegrityError:
            #WARN: code doesn't work
            # delete all comments referenced by the task comments
            #query = "DELETE FROM comment AS c WHERE c.idComment IN (SELECT tc.idComment FROM taskComment AS tc WHERE tc.idWorkTask = ?);"
            #self.cursor.execute(query, (task_id, ))

            # delete all task comments referencing this
            query = "DELETE FROM taskComment AS tc WHERE tc.idWorkTask = ?;"
            self.cursor.execute(query, (task_id, ))

            # delete all assignments referencing this
            query = "DELETE FROM assignment AS a WHERE a.idWorkTask = ?;"
            self.cursor.execute(query, (task_id, ))

            # now delete the project
            query = "DELETE FROM workTask WHERE idWorkTask = ?;"
            self.cursor.execute(query, (task_id, ))

        if self.cache_enabled:
            # remove task from cache
            self.redis_db.delete(f"task:{task_id}")

        self.db.commit()

        return 201
        

    def mark_task_completed(self, task_id: int, status: bool):
        if not self.task_exists(task_id):
            return False

        print(status)

        query = "UPDATE workTask SET done = ? WHERE idWorkTask = ?;"

        self.cursor.execute(query, (1 if status else 0, task_id))

        query = "UPDATE workTask SET doneTimestamp = ? WHERE idWorkTask = ?;"

        if status == True:
            self.cursor.execute(query, (datetime.now(), task_id))
        else:
            self.cursor.execute(query, ("", task_id))


        task = self.get_task(task_id)

        # update cache
        if self.cache_enabled:
            self.redis_db.hset(f"task:{task_id}", "done", int(task["done"]))
            self.redis_db.hset(f"task:{task_id}", "doneTimestamp", task["doneTimestamp"])


        self.db.commit()

        if task is not None and bool(int(task["done"])) == status:
            return True
        return False

    def assign_employee(self, task_id: int, employee_id: int):
        if self.task_exists(task_id) and self.employee_exists(employee_id):
            query = "INSERT INTO assignment (idWorkTask, idEmployee) VALUES (?, ?);"

            self.cursor.execute(query, (task_id, employee_id))

            self.db.commit()

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

            self.db.commit()
    
    def get_project(self, project_id: int):
        project = None
        if self.cache_enabled:
            project = self.redis_db.hgetall(f"project:{project_id}")
            if project:
                self.redis_db.expire(f"project:{project_id}", 10)
        if not project:
            query = "SELECT * FROM project WHERE idProject = ?;"

            project = self.cursor.execute(query, (project_id, )).fetchone()

        # project:id name idManager text
        
        if project and self.cache_enabled:
            self.redis_db.hset(f"project:{project_id}", mapping = {
                "name": project["name"],
                "text": project["text"] if project["text"] else "",
                "idManager": project["idManager"],
                "createdAt": project["createdAt"]
            })

            self.redis_db.expire(f"project:{project_id}", 10)

        return project
    
    def search_projects_by_names(self, names):
        conditions = " OR ".join(["name LIKE ?"] * len(names))

        query = f"SELECT * FROM project WHERE {conditions}"

        params = [f"%{name}%" for name in names]

        return self.cursor.execute(query, params).fetchall()

    def get_project_by_name(self, name: str):
        if self.cache_enabled:
            if project_id := self.redis.get(f"project_name:{name}"):
                return self.get_project(project_id)

        query = "SELECT * FROM project WHERE name LIKE ? LIMIT 1;"

        project = self.cursor.execute(query, (f"%{name}%", )).fetchone()

        if self.cache_enabled and project:
            self.redis.set(f"project_name:{name}", project["idProject"])

        return project
    
    def get_projects(self):
        query = "SELECT * FROM project;"

        return self.cursor.execute(query).fetchall()

    def get_project_tasks(self, project_id: int):
        query = "SELECT * FROM workTask WHERE idProject = ?;"

        return self.cursor.execute(query, (project_id, )).fetchall()

    def add_project(self, name: str, text: str, manager_id: int, createdAt: datetime):
        if self.employee_exists(manager_id):
            query = "INSERT INTO project (name, text, idManager, createdAt) VALUES (?, ?, ?, ?);"
            
            try:
                self.cursor.execute(query, (name, text, manager_id, createdAt))
                
                self.db.commit()

                return 201
            except sql.IntegrityError:
                return 501
    
    def edit_project(self, project_id: int, name: str, text: str):
        if self.project_exists(project_id):
            query = "UPDATE project SET name = ?, text = ? WHERE idProject = ?;"
            
            try:
                self.cursor.execute(query, (name, text, project_id))
                
                self.db.commit()

                if self.cache_enabled:
                    # remove non-project from cache
                    self.redis_db.delete(f"project:{project_id}")

                return 201
            except sql.IntegrityError:
                return 501
    
    def delete_project(self, project_id: int):
        #TODO: do some auth
        try:
            # try to just delete the project
            query = "DELETE FROM project WHERE idProject = ?;"
            self.cursor.execute(query, (project_id, ))
        except sql.IntegrityError:
            #WARN: code doesn't work
            # delete all comments referenced by the project comments
            #query = "DELETE FROM comment c WHERE c.idComment IN (SELECT pc.idComment FROM projectComment AS pc WHERE pc.idProject = ?);"
            #self.cursor.execute(query, (project_id, ))

            # delete all tasks referencing this
            query = "UPDATE workTask AS wt SET wt.idProject = NULL WHERE wt.idProject = ?;"
            self.cursor.execute(query, (project_id, ))

            # delete all task comments referencing this
            query = "DELETE FROM projectComment AS pc WHERE pc.idProject = ?;"
            self.cursor.execute(query, (project_id, ))

            # now delete the project
            query = "DELETE FROM project WHERE idProject = ?;"
            self.cursor.execute(query, (project_id, ))

        if self.cache_enabled:
            # remove project from cache
            self.redis_db.delete(f"project:{project_id}")

        self.db.commit()

        return 201
        

    def project_exists(self, project_id: int) -> bool:
        if self.cache_enabled:
            task = self.redis_db.hget(f"project:{project_id}", "name")
            # Unable to return false as data may not be in cache but be in db
            if task:
                return True
            
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

            self.db.commit()


    def close(self):
        if self.db is not None:
            self.db.close()
            self.db = None