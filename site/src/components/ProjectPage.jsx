import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getId } from "../functions/id";

export default function ProjectPage({ fetch_custom, usedDB }) {
  const navigate = useNavigate();
  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  const { id } = useParams();
  const [project, setProject] = useState({});

  async function getThisProject(e) {
    if (getId() == 0 || !getId() || getId() === undefined) {
      navigate("/not-found");
      return;
    }

    e.preventDefault();

    try {
      const res = await fetch_custom(`/api/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setProject(data);

      if (res.status !== 200) {
        navigate("/not-found");
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  useEffect(() => {
    getThisProject({ preventDefault: () => {} });
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
            <span class="input-group-text" id="basic-addon1">Id do Criador:</span>
            <input type="text" value={project["idManager"]} class="form-control shadow rounded-end" placeholder="Error Info Missing" aria-label="Username" aria-describedby="basic-addon1" readOnly/>
          </div>
        </div>

        <div className="col-sm-5 pe-3">
          <div className="input-group mb-3">
            <span class="input-group-text" id="basic-addon2">Id do Projeto:</span>
            <input type="text" value={project["idProject"]} class="form-control shadow rounded-end" placeholder="Error Info Missing" aria-label="Username" aria-describedby="basic-addon2" readOnly/>
          </div>
        </div>

        <div className="col-sm-10 px-3">
          <div className="input-group mb-3">
            <span class="input-group-text" id="basic-addon3">Criado em: </span>
            <input type="text" value={null} class="form-control shadow rounded-end" placeholder="Error Info Missing"aria-label="Username" aria-describedby="basic-addon3" readOnly/>
          </div>
        </div>

      </div>

      <div className="row border-bottom border-black w-75 mx-auto g-0 py-1"></div>

      <div className="row justify-content-center g-0 pt-3">
        <div className="col-12">
          <h4 className="text-center">Tarefas do Projeto</h4>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 p-4 g-1 justify-content-center">

        <div className="col">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">Card Template</h5>
              <p className="card-text">
                {["card  text"]}
              </p>
            </div>
            <div className="card-footer d-flex justify-content-center gap-2">
                <button className="btn btn-danger w-50" onClick={null}>
                  Apagar
                </button>
                <button className="btn btn-secondary w-50" onClick={null}>
                  Editar
                </button>
            </div>
          </div>
        </div>

      </div>

      <div className="row justify-content-center g-0">
        <div className="col-sm-10 d-flex justify-content-center gap-3">
          <button className="btn btn-success w-50" onClick={() => navigate("/projects")}>
            Voltar
          </button>
          <button className="btn btn-secondary w-50" onClick={() => navigate("/create-tasks")}>
            Criar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
}
