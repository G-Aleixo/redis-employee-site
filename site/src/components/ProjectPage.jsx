import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Task from "./Task";

export default function ProjectPage({ fetch_custom, usedDB }) {
  const navigate = useNavigate();

  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  const [project, setProject] = useState({});
  const [projectsTasks, setProjectsTasks] = useState([]);

  const { id } = useParams();

  async function loadProjectPage() {
    try {
      const res = await fetch_custom(`/api/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        navigate("/not-found");
        return;
      }

      const projectData = await res.json();
      setProject(projectData);

      const taskRes = await fetch_custom(`/api/project/${id}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!taskRes.ok) throw new Error("Erro ao buscar tarefas");
      const taskData = await taskRes.json();
      setProjectsTasks(taskData);

    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  useEffect(() => {
    if (localStorage["id"] == 0 || !localStorage["id"] || localStorage["id"] === undefined) {
      navigate("/not-found");
      return;
    }
    loadProjectPage();
  }, []);

  return (
    <div className={`container-fluid p-0 border border-2 ${borderClass}`} id="login-area">
      <div className="row justify-content-center g-0">
        <div className="col-12 border-bottom border-black w-75 mx-auto pt-1">
          <h2 className="text-center">{project["name"]}</h2>
        </div>
      </div>

      {project["text"] && (
        <div className="row justify-content-center pt-3 g-0">
          <div className="col-sm-10 px-3">
            <div className="mb-3">
              <label htmlFor="floatingTextarea" className="form-label">
                Descrição Projeto:
              </label>
              <textarea value={project["text"]} className="form-control shadow rounded" placeholder="Error Info Missing" id="floatingTextarea" readOnly style={{ height: "180px" }}></textarea>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center pt-3 g-0 gap-1">
        <div className="col-sm-5 ps-3">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Id do Criador:</span>
            <input type="text" value={project["idManager"]} className="form-control shadow rounded-end" placeholder="Error Info Missing" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
          </div>
        </div>

        <div className="col-sm-5 pe-3">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon2">Id do Projeto:</span>
            <input type="text" value={project["idProject"]} className="form-control shadow rounded-end" placeholder="Error Info Missing" aria-label="Username" aria-describedby="basic-addon2" readOnly/>
          </div>
        </div>

        <div className="col-sm-10 px-3">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon3">Criado em: </span>
            <input type="text" value={project["createdAt"] || "Indefinido"} className="form-control shadow rounded-end" placeholder="Error Info Missing"aria-label="Username" aria-describedby="basic-addon3" readOnly/>
          </div>
        </div>

      </div>

      <div className="row border-bottom border-black w-75 mx-auto g-0 py-1"></div>

      {projectsTasks.length > 0 && (
        <>
          <div className="row g-0">
            <div className="col-12">
              <h3 className="text-center py-3 border-top border-black w-75 mx-auto">
                Tarefas do Projeto
              </h3>
            </div>
          </div>
          
          <div className="row row-cols-1 row-cols-md-3 g-1 p-4 justify-content-center">
            {projectsTasks.map((taskObj) => (
              <Task key={taskObj.name} name={taskObj.name} content={taskObj.content} idManager={project["idManager"]} />
            ))}
          </div>
        </>
      )}

      <div className="row justify-content-center g-0">
        <div className="col-sm-10 d-flex justify-content-center gap-3">
          <button className="btn btn-success w-50" onClick={() => navigate("/projects")}>
            Voltar
          </button>
          {project["idManager"] == localStorage["id"] && (
            <button className="btn btn-secondary w-50" onClick={() => navigate("/create-tasks")}>
              Criar Tarefa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
