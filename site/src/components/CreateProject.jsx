import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "./Alert";
import CreateTasks from "./CreateTasks";
import Task from "./Task";

export default function CreateProject({ fetch_custom, usedDB }) {
  const navigate = useNavigate();

  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tasksData, setTasksData] = useState([]);

  const [popup, setPopup] = useState(false);

  const [nameTask, setNameTask] = useState("");
  const [contentTask, setContentTask] = useState("");

  const [alert, setAlert] = useState({
    showAlert: false,
    title: "",
    text: "",
    className: "",
  });

  const [editTaskObj, setEditTaskObj] = useState(null);

  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  async function setTaskData(e) {
    e.preventDefault();

    if (editTaskObj != null) {
      await setTasksData((prev) =>
        prev.filter(
          (item) =>
            !(
              item.name == editTaskObj.name &&
              item.content == editTaskObj.content
            ),
        ),
      );
      setEditTaskObj(null);
    } else if (tasksData.some((obj) => obj.name == nameTask)) {
      setAlert({
        showAlert: true,
        title: "Um Erro Ocorreu!",
        text: "O nome que você escolheu já está em uso, tente outro nome.",
        className: "alert-danger",
      });
      return;
    }

    setTasksData((prev) => [
      ...prev,
      {
        name: nameTask.trim(),
        content: contentTask.trim() || "",
      },
    ]);
  }

  async function editTask(obj) {
    setEditTaskObj(obj);
    setNameTask(obj.name);
    setContentTask(obj.content);
    setPopup(true);
  }

  function deleteTask(obj) {
    setTasksData((prev) =>
      prev.filter((item) =>
        obj.idWorkTask?.trim()
          ? item.idWorkTask?.trim() !== obj.idWorkTask?.trim()
          : item.name?.trim() !== obj.name?.trim(),
      ),
    );
  }

  async function createTasks(projectId) {
    if (tasksData.length === 0) return;

    return await fetch_custom("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        tasks: tasksData.map((t) => ({
          name: t.name.trim(),
          content: t.content.trim(),
        })),
      }),
    });
  }

  async function syncTasks(projectId) {
    const oldRes = await fetch_custom(`/api/projects/${projectId}/tasks`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const oldTasks = await oldRes.json();

    for (const t of oldTasks) {
      await fetch_custom(`/api/tasks/${t.idWorkTask}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }

    await createTasks(projectId);
  }

  async function editProject(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title.trim(),
          text: text.trim(),
        }),
      });

      await syncTasks(id);

      if (res.ok) {
        setAlert({
          showAlert: true,
          title: "Projeto Editado!",
          text: "Seu projeto foi editado! Volte para o visualizador de projetos.",
          className: "alert-success",
        });
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
      setAlert({
        showAlert: true,
        title: "Um Erro Ocorreu!",
        text: "O servidor não conseguiu editar seu projeto. Recarregue a página e tente novamente.",
        className: "alert-danger",
      });
    }
  }

  async function createProject(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title.trim(),
          text: text.trim(),
          manager_id: localStorage["id"].trim(),
          createdAt: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }).trim(),
        }),
      });

      const data = await res.json();

      await createTasks(data.project_id);

      if (res.ok) {
        setAlert({
          showAlert: true,
          title: "Projeto Criado!",
          text: "Seu projeto foi criado! Volte para o visualizador de projetos.",
          className: "alert-success",
        });
      } else {
        setAlert({
          showAlert: true,
          title: "Um Erro Ocorreu!",
          text: "O nome que você escolheu já está em uso, tente outro nome.",
          className: "alert-danger",
        });
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
      setAlert({
        showAlert: true,
        title: "Um Erro Ocorreu!",
        text: "O servidor não conseguiu criar seu projeto. Recarregue a página e tente novamente.",
        className: "alert-danger",
      });
    }
  }

  useEffect(() => {
    if (
      localStorage["id"] == 0 ||
      !localStorage["id"] ||
      localStorage["id"] === undefined
    ) {
      navigate("/not-found");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    function getKeyDown(event) {
      if (event.key === "Escape") setPopup(false);
    }
    window.addEventListener("keydown", getKeyDown);
    return () => window.removeEventListener("keydown", getKeyDown);
  }, []);

  useEffect(() => {
    setPopup(false);
  }, [tasksData]);

  useEffect(() => {
    document.body.style.overflow = popup ? "hidden" : "auto";
  }, [popup]);

  useEffect(() => {
    if (!id) return;

    async function loadProject() {
      try {
        const projectRes = await fetch_custom(`/api/projects/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!projectRes.ok) {
          navigate("/not-found");
          return;
        }

        const project = await projectRes.json();
        setTitle(project.name.trim());
        setText(project.text.trim() || "");

        const tasksRes = await fetch_custom(`/api/projects/${id}/tasks`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const tasks = await tasksRes.json();
        setTasksData(tasks);
      } catch (err) {
        console.warn("Erro ao carregar projeto", err);
      }
    }

    loadProject();
  }, [id]);

  return (
    <>
      <div
        className={`container-fluid p-0 border border-2 ${borderClass}`}
        id="login-area"
      >
        <div className="row justify-content-center g-0">
          <div className="col-12">
            <h3 className="text-center py-3 border-bottom border-black w-75 mx-auto">
              Criando seu Projeto
            </h3>
          </div>
        </div>

        {alert.showAlert && (
          <Alert
            setFunction={(prev) => setAlert({ ...prev, showAlert: false })}
            title={alert.title}
            text={alert.text}
            className={alert.className}
          />
        )}

        <div className="row g-0">
          <form onSubmit={isEdit ? editProject : createProject}>
            <div className="row justify-content-center g-0">
              <div className="col-md-10 p-3">
                <div className="input-group shadow">
                  <span className="input-group-text" id="basic-addon1">
                    Título
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="Digite o Título do Projeto"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row justify-content-center g-0">
              <div className="col-md-10 p-3">
                <div className="mb-3">
                  <label htmlFor="floatingTextarea" className="form-label">
                    Informações do Projeto
                  </label>
                  <textarea
                    className="form-control"
                    name="information"
                    id="floatingTextarea"
                    aria-label="Withtextarea"
                    placeholder="Descrição do Projeto... opcional"
                    style={{ height: "140px", resize: "none" }}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                  />
                </div>
              </div>
            </div>

            {tasksData.length > 0 && (
              <>
                <div className="row g-0">
                  <div className="col-12">
                    <h3 className="text-center py-3 border-top border-black w-75 mx-auto">
                      Tarefas do Projeto
                    </h3>
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-1 p-4 justify-content-center">
                  {tasksData.map((taskObj, index) => (
                    <Task
                      key={index}
                      idWorkTask={taskObj.idWorkTask}
                      name={taskObj.name}
                      content={taskObj.content}
                      done={taskObj.done}
                      idManager={localStorage["id"]}
                      editTask={editTask}
                      deleteTask={deleteTask}
                      fetch_custom={fetch_custom}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="row py-3 g-0">
              <div className="col-sm-12 d-flex justify-content-center">
                <button
                  className="btn btn-warning w-50"
                  type="button"
                  onClick={() => (
                    setNameTask(""),
                    setContentTask(""),
                    setPopup(true)
                  )}
                >
                  Adicionar Tarefa
                </button>
              </div>
            </div>

            <div className="row justify-content-center py-3 g-0">
              <div className="col-sm-10 d-flex justify-content-center gap-3">
                <button className="btn btn-secondary w-50" type="submit">
                  Salvar Projeto
                </button>
                <button
                  type="button"
                  className="btn btn-success w-50"
                  onClick={() => navigate("/projects")}
                >
                  Voltar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {popup && (
        <CreateTasks
          setPopup={setPopup}
          nameTask={nameTask}
          setNameTask={setNameTask}
          contentTask={contentTask}
          setContentTask={setContentTask}
          setTaskData={setTaskData}
        />
      )}
    </>
  );
}
