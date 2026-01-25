from flask import Flask, request, make_response, jsonify, g, session, redirect, url_for # pyright: ignore[reportMissingImports]
from flask_cors import CORS # pyright: ignore[reportMissingModuleSource]
from markupsafe import escape
from functools import wraps

from sqlite3 import Row
import src.database as database
import hashlib

from os import getenv

REDIS = getenv("REDIS_URL") # setup manually

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
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
def hello_world():
    name = request.args.get("name", "Flask")
    return f"<p>Hello {escape(name)}!</p>"

@app.get("/api/tasks/<int:task_id>")
def get_task(task_id: int):
    if task_id == None:
        return {}, 501

    db = get_db()

    task = db.get_task(task_id)

    if task:
        task = dict(task)
        return jsonify(dict(db.get_task(task_id))), 200
    else:
        return {}, 404

@app.post("/api/tasks")
def add_task():
    data = request.get_json()
    
    # Validate correct JSON format
    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400
    if not data or "content" not in data:
        return jsonify({"error": "Missing required field: content"}), 400
    # if not data or "project_id" not in data:
    #     return jsonify({"error": "Missing required field: project_id"}), 400

    name = data.get("name")
    content = data.get("content")
    project_id = data.get("project_id")

    db = get_db()

    db.add_task(name, content, project_id=project_id)

    return {}, 201

@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id: int):
    #TODO: add auth
    db = get_db()

    db.delete_task(task_id)

    return {}, 201

@app.get("/api/tasks/<int:task_id>/set-status/<int:status>")
def mark_task_completed(task_id, status):
    if status != 0 and status != 1:
        return {"error": f"Invalid status value {escape(status)} not 0 or 1"}, 400
    
    status = False if status == 0 else True

    db = get_db()

    if db.mark_task_completed(task_id, status):
        return {}, 201
    return {}, 400


@app.get("/api/tasks/<int:task_id>/assigned")
def get_task_assignees(task_id: int):
    if task_id == None:
        return {}, 501

    db = get_db()

    task = db.get_task(task_id)

    if task:
        task = dict(task)
        return jsonify([dict(row) for row in db.get_assigned(task_id)]), 200
    else:
        return {}, 404

@app.get("/api/tasks/<int:task_id>/comments")
def get_task_comments(task_id: int):
    if task_id == None:
        return {}, 501

    db = get_db()

    task = db.get_task(task_id)

    if task:
        task = dict(task)
        return jsonify([dict(row) for row in db.get_task_comments(task_id)]), 200
    else:
        return {}, 404

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
def get_project_by_name(project_name: int):
    if project_name == None:
        return {}, 501

    db = get_db()

    project = db.get_project_by_name(project_name)

    if project:
        project = dict(project)
        return jsonify(project), 200
    else:
        return {}, 404

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

    name = data.get("name")
    manager_id = data.get("manager_id")
    text = data.get("text")

    db = get_db()

    code = db.add_project(name, text, manager_id=manager_id)

    return {}, code

@app.delete("/api/projects/<int:project_id>")
def delete_project(project_id: int):
    #TODO: add auth
    db = get_db()

    db.delete_project(project_id)

    return 201

@app.get("/api/project/<int:project_id>/comments")
def get_project_comments(project_id: int):
    if project_id == None:
        return {}, 501

    db = get_db()

    project = db.get_project(project_id)

    if project:
        return jsonify([dict(row) for row in db.get_project_comments(project_id)]), 200
    else:
        return {}, 404

@app.get("/api/project/<int:project_id>/tasks")
def get_project_tasks(project_id: int):
    if project_id == None:
        return {}, 501

    db = get_db()

    project = db.get_project(project_id)

    if project:
        return jsonify([dict(row) for row in db.get_project_tasks(project_id)]), 200
    else:
        return {}, 404

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

@app.get("/employees/<int:employee_id>")
def get_employee_page(employee_id: int | None = None):
    if employee_id == None:
        return "<p>NOT IMPLEMENTED</p>", 501

    db = get_db()
    
    employee = db.get_employee(employee_id)
    if employee:
        response = f"""\
<p>ID: {escape(employee["idEmployee"])}</p>
<p>Favorite soccer team: {escape(employee["favoriteTeam"])}</p>
<p>Age: {escape(employee["age"])}</p>
<p>Name: {escape(employee["name"])}</p>
<p>Info: {escape(employee["information"])}</p>
<p>Joined on: {escape(employee["joinedOn"])}</p>"""

        if employee["idManager"] != None:
            manager_name = db.get_employee(employee["idManager"])["name"]
            response += f"\n<p>Manager: <a href=\"/employees/{escape(employee[6])}\">{escape(manager_name)}</a></p>"
        
        return make_response(response)
    
    return "<p>ERROR 404, employee not found!</p>", 404

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        username = data["name"]
        age = data["age"]
        info = data["information"]
        password = data["password"]
        favorite_team = data["favorite_team"]

        db = get_db()
        sucess = db.add_employee(username, age, info, password, 1, favorite_team)
        db.close()
        if sucess == 501:
            return {"error": "User with this name already exists"}, 501
        return {"message": "User created successfully"}, 200

    # GET request → show signup form
    return r"""<!DOCTYPE html>
<html>
<head>
    <title>Signup</title>
</head>
<body>
    <h2>Create an Account</h2>
    <form method="POST" action="/signup">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="age">Age:</label><br>
        <input type="number" id="age" name="age" required><br><br>

        <label for="information">About yourself:</label><br>
        <textarea id="information" name="information"></textarea><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <button type="submit">Sign Up</button>
    </form>
</body>
</html>
"""

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data["name"]
        password = data["password"]

        db = get_db()
        user = db.cursor.execute("SELECT * FROM employee WHERE name = ?", (username,)).fetchone()
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

    # If GET request → show login page
    return r"""<!DOCTYPE html> <html> <head> <title>Login</title> </head> <body> <h2>Login</h2> <form method="POST" action="/login"> <label>Username:</label> <input type="text" name="username" required><br><br> <label>Password:</label> <input type="password" name="password" required><br><br> <button type="submit">Login</button> </form> </body> </html>"""

@app.route('/profile')
def profile():
    if "user_id" not in session:
        return redirect(url_for('login'))
    return f"Welcome {session['username']}!"

@app.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200