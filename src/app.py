from flask import Flask, request, make_response, jsonify, g, session, redirect, url_for # pyright: ignore[reportMissingImports]
from flask_cors import CORS # pyright: ignore[reportMissingModuleSource]
from markupsafe import escape
from functools import wraps

from sqlite3 import Row
import src.database as database
import hashlib

from os import getenv

REDIS = getenv("REDIS_URL") # setup manually

print(f"REDIS_URL env value was {REDIS}")

if not REDIS:
    print("REDIS_URL value not found in env, cache is disabled")

DATABASE = "worker_database.db"

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://g-aleixo.github.io", "https://redis-employee-site.onrender.com"], supports_credentials=True)

app.secret_key = "Charley Harvard Alpha Donald"

def stable_hash(data: any):
    return hashlib.sha256(data.encode()).hexdigest()

def get_db() -> database.DatabaseConnection:
    if "db" not in g:
        g.db = database.DatabaseConnection(DATABASE, REDIS)
        g.db.row_factory = Row
    
    try:
        data = dict(request.headers)

        if data.get("usedDB") == None:
            data = dict(request.args)

        used_db = data.get("usedDB")

        print(used_db)

        match used_db:
            case "sqlite":
                print("disableing cache for this db")
                g.db.cache_enabled = False
            case "redis":
                if g.db.cache_avaliable:
                    print("enableing cache for this db")
                    g.db.cache_enabled = True
            case _:
                if g.db.cache_avaliable:
                    print("enableing cache for this db")
                    g.db.cache_enabled
    except RuntimeError:
        print("get_db used outside of a request")

    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()

@app.get("/api/tasks/<int:task_id>")
def get_task(task_id: int):
    if task_id == None:
        return {}, 501

    db = get_db()

    task = db.get_task(task_id)

    if task:
        task = dict(task)
        return jsonify(task), 200
    else:
        return {}, 404

@app.get("/api/tasks/")
def get_tasks():
    db = get_db()

    tasks = db.get_tasks()

    tasks = [dict(task) for task in tasks]

    return tasks, 200

@app.post("/api/tasks")
def add_task():
    data = request.get_json()
    
    # Validate correct JSON format
    if not data or "tasks" not in data:
        return jsonify({"error": "Missing required field: tasks"}), 400
    if not data or "project_id" not in data:
        return jsonify({"error": "Missing required field: project_id"}), 400

    tasks = data.get("tasks")
    project_id = data.get("project_id")

    db = get_db()

    db.add_tasks(tasks, project_id)

    return {}, 201

@app.put("/api/tasks/<int:task_id>")
def edit_task(task_id: int):
    data = request.get_json()
    
    # Validate correct JSON format
    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400
    if not data or "content" not in data:
        return jsonify({"error": "Missing required field: content"}), 400
    # if not data or "done" not in data:
    #     return jsonify({"error": "Missing required field: done"}), 400
    # if not data or "done_time" not in data:
    #     return jsonify({"error": "Missing required field: done_time"}), 400
    # if not data or "project_id" not in data:
    #     return jsonify({"error": "Missing required field: project_id"}), 400

    name = data.get("name")
    content = data.get("content")
    # done = data.get("done")
    # done_time = data.get("")
    project_id = data.get("project_id")

    db = get_db()

    return {}, db.edit_task(task_id, name, content, project_id=project_id)

@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id: int):
    #TODO: add auth
    db = get_db()

    return {}, db.delete_task(task_id)

@app.get("/api/tasks/<int:task_id>/set-status/<int:status>")
def mark_task_completed(task_id, status):
    if status != 0 and status != 1:
        return {"error": f"Invalid status value {escape(status)} not 0 or 1"}, 400
    
    status = False if status == 0 else True

    db = get_db()

    if db.mark_task_completed(task_id, status):
        return {}, 201
    return {}, 400

@app.get("/api/projects/<int:project_id>")
def get_project(project_id: int):
    if project_id == None:
        return {}, 501

    db = get_db()

    project = db.get_project(project_id)

    if project:
        project = dict(project)
        return jsonify(project), 200
    else:
        return {}, 404

@app.get("/api/projects/search/<string:project_name>")
def get_project_by_name(project_name: str):
    if project_name == None:
        return {}, 501

    db = get_db()

    names_array = project_name.split()
    projects = db.search_projects_by_names(names_array)
    
    if projects:
        return jsonify([dict(row) for row in projects]), 200
    else:
        return jsonify([]), 404

@app.get("/api/projects/")
def get_projects():
    db = get_db()

    projects = db.get_projects()

    projects = [dict(project) for project in projects]
    return jsonify(projects), 200

@app.post("/api/projects")
def add_project():
    data = request.get_json()
    
    # Validate correct JSON format
    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400
    if not data or "manager_id" not in data:
        return jsonify({"error": "Missing required field: manager_id"}), 400
    if not data or "text" not in data:
        return jsonify({"error": "Missing required field: text"}), 400
    if not data or "createdAt" not in data:
        return jsonify({"error": "Missing required field: createdAt"}), 400

    name = data.get("name")
    manager_id = data.get("manager_id")
    text = data.get("text")
    createdAt = data.get("createdAt")

    db = get_db()

    id, code = db.add_project(name, text, manager_id, createdAt)

    return {"project_id": id}, code

@app.put("/api/projects/<int:project_id>")
def edit_project(project_id: int):
    data = request.get_json()
    
    # Validate correct JSON format
    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400
    if not data or "text" not in data:
        return jsonify({"error": "Missing required field: text"}), 400
    
    name = data.get("name")
    text = data.get("text")

    db = get_db()

    return {}, db.edit_project(project_id, name, text)

@app.delete("/api/projects/<int:project_id>")
def delete_project(project_id: int):
    #TODO: add auth
    db = get_db()

    return {}, db.delete_project(project_id)

@app.delete("/api/projects/<int:project_id>/comments/<int:comment_id>")
def delete_project_comment(project_id: int, comment_id: int):
    db = get_db()

    return {}, db.delete_project_comment(comment_id)

@app.post("/api/projects/<int:project_id>/comments")
def add_comment(project_id):
    data = request.get_json()

    if not data or "content" not in data:
        return jsonify({"error": "Missing required field: content"}), 400
    if not data or "employee_id" not in data:
        return jsonify({"error": "Missing required field: employee_id"}), 400
    if not data or "createdAt" not in data:
        return jsonify({"error": "Missing required field: createdAt"}), 400

    content = data["content"]
    employee_id = data["employee_id"]
    createdAt = data["createdAt"]

    db = get_db()

    db.post_project_comment(project_id, employee_id, content, createdAt)

    return {}, 201

@app.get("/api/projects/<int:project_id>/comments")
def get_project_comments(project_id: int):
    if project_id == None:
        return {}, 501

    db = get_db()

    project = db.get_project(project_id)

    if project:
        return jsonify([dict(row) for row in db.get_project_comments(project_id)]), 200
    else:
        return {}, 404

@app.get("/api/projects/<int:project_id>/tasks")
def get_project_tasks(project_id: int):
    if project_id == None:
        return jsonify({"error": "Don't has an id"}), 501

    db = get_db()

    project = db.get_project(project_id)

    if project:
        return jsonify([dict(row) for row in db.get_project_tasks(project_id)]), 200
    else:
        return jsonify({"error": "Project not found"}), 404

@app.get("/api/employees/<int:employee_id>")
def get_employee_api(employee_id: int | None = None):
    if employee_id == None:
        return {}, 501

    db = get_db()

    employee = dict(db.get_employee(employee_id))

    if employee:
        employee.pop("password")
        return jsonify(employee), 200
    else:
        return {}, 404

@app.post("/signup")
def signup():
    data = request.get_json()
    
    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400
    if not data or "age" not in data:
        return jsonify({"error": "Missing required field: age"}), 400
    if not data or "information" not in data:
        return jsonify({"error": "Missing required field: information"}), 400
    if not data or "password" not in data:
        return jsonify({"error": "Missing required field: password"}), 400
    if not data or "favorite_team" not in data:
        return jsonify({"error": "Missing required field: favorite_team"}), 400
    if not data or "joinedOn" not in data:
        return jsonify({"error": "Missing required field: joinedOn"}), 400

    username = data["name"]
    age = data["age"]
    info = data["information"]
    password = data["password"]
    favorite_team = data["favorite_team"]
    joinedOn = data["joinedOn"]
    
    db = get_db()
    sucess = db.add_employee(username, age, info, password, 1, favorite_team, joinedOn)
    db.close()
    if sucess == 501:
        return {"error": "User with this name already exists"}, 501
    return {"message": "User created successfully"}, 200

@app.post("/login")
def login():
    data = request.get_json()
    
    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400
    if not data or "password" not in data:
        return jsonify({"error": "Missing required field: password"}), 400
    
    username = data["name"]
    password = data["password"]

    db = get_db()
    user = db.cursor.execute("SELECT * FROM employee WHERE name = ?", (username,), no_delay=True).fetchone()
    db.close()

    if user is None:
        return {"error": "User not found", "status": 404}, 404

    if user["password"] != stable_hash(password + (user["name"] + user["joinedOn"])):
        return {"error": "Invalid credentials", "status": 401}, 401

    session["user_id"] = user["idemployee"]
    session["username"] = user["name"]
    return {
        "id": user["idemployee"],
        "name": user["name"],
        "age": user["age"],
        "favTeam": user["favoriteTeam"],
        "information": user["information"],
        "joinedOn": user["joinedOn"]
    }, 200
