import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "./Alert";
import CreateTasks from "./CreateTasks";
import Task from "./Task";

export default function CreateProject({ fetch_custom, usedDB }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { valuesState = ["", "", 0], isEdit = false } = location.state || {};

  const [title, setTitle] = useState(valuesState[0]);
  const [text, setText] = useState(valuesState[1]);
  const [popup, setPopup] = useState(false);

  const [nameTask, setNameTask] = useState("");
  const [contentTask, setContentTask] = useState("");

  const [alert, setAlert] = useState({ 
    showAlert: false, 
    title: "", 
    text: "", 
    className: ""
  });

  const [tasksData, setTasksData] = useState([]);

  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  function setTaskData(e) {
    e.preventDefault();

    setTasksData((prev) => [...prev, {
      name: nameTask,
      content: contentTask
    }]);
  }

  function projectFunction(e) {
    if (isEdit) {
      editProject(e);
    } else {
      createProject(e);
    }
  }

  async function createTask(e, projectId) {
    e.preventDefault();
    return await fetch_custom("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks: tasksData,
        project_id: projectId
      })
    })
  }

  async function editProject(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom(`/api/projects/${valuesState[2]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          text: text || "",
        }),
      });
      if (res.ok) {
        setAlert({ 
          showAlert: true, 
          title: "Projeto Editado!", 
          text: "Seu projeto foi editado! Volte para o visualizador de projetos.",
          className: "alert-success"
        });
        createTask({ preventDefault: () => {} }, valuesState[2]);
      } else {
        setAlert({ 
          showAlert: true, 
          title: "Um Erro Ocorreu!", 
          text: "O nome que você escolheu já está em uso, tente outro nome.",
          className: "alert-danger"
        });
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
      setAlert({ 
        showAlert: true, 
        title: "Um Erro Ocorreu!", 
        text: "O servidor não conseguiu editar seu projeto. Recarregue a página e tente novamente.",
        className: "alert-danger"
      });
    }
  }

  async function createProject(e) {
    e.preventDefault();

    try {
      let res = await fetch_custom("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          text: text,
          manager_id: localStorage["id"],
          createdAt: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
        }),
      });
      const data = await res.json();
      if (tasksData.length > 0) res = await createTask({ preventDefault: () => {} }, data.project_id);
      if (res.ok) {
        setAlert({ 
          showAlert: true, 
          title: "Projeto Criado!", 
          text: "Seu projeto foi criado! Volte para o visualizador de projetos.",
          className: "alert-success"
        });
      } else {
        setAlert({ 
          showAlert: true, 
          title: "Um Erro Ocorreu!", 
          text: "O nome que você escolheu já está em uso, tente outro nome.",
          className: "alert-danger"
        });
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
      setAlert({ 
        showAlert: true, 
        title: "Um Erro Ocorreu!", 
        text: "O servidor não conseguiu criar seu projeto. Recarregue a página e tente novamente.",
        className: "alert-danger"
      });
    }
  }

  useEffect(() => {
    if (localStorage["id"] == 0 || !localStorage["id"] || localStorage["id"] === undefined) {
      navigate("/not-found");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    function getKeyDown(event) {
      if (event.key == "Escape") setPopup(false);
    }
    window.addEventListener("keydown", getKeyDown);
  }, [setPopup]);

  useEffect(() => {
    setPopup(false)
  }, [tasksData]);

  return (
    <>
      <div className={`container-fluid p-0 border border-2 ${borderClass}`} id="login-area">
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
          <form onSubmit={projectFunction}>
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
                  <textarea className="form-control" name="information" id="floatingTextarea" aria-label="Withtextarea" placeholder="Descrição do Projeto... opcional" style={{ height: "140px" }} onChange={(e) => setText(e.target.value)} value={text} />
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
                {tasksData.map((taskObj) => (
                  <Task key={taskObj.name} name={taskObj.name} content={taskObj.content} />
                ))}
              </>
            )}

            <div className="row py-3 g-0">
              <div className="col-sm-12 d-flex justify-content-center">
                <button className="btn btn-warning w-50" type="button" onClick={() => setPopup(true)}>
                  Adicionar Tarefa
                </button>
              </div>
            </div>

            <div className="row justify-content-center py-3 g-0">
              <div className="col-sm-10 d-flex justify-content-center gap-3">
                <button className="btn btn-secondary w-50" type="submit">
                  Salvar Projeto
                </button>
                <button className="btn btn-success w-50" onClick={() => navigate("/projects")}>
                  Voltar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {popup && <CreateTasks setPopup={setPopup} setNameTask={setNameTask} setContentTask={setContentTask} setTaskData={setTaskData} />}
    </>
  );
}
