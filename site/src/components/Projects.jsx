import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Project({ id, idManager, name, text }) {
  const navigate = useNavigate();

  return (
    <div className="col p-3">
      <div className="card text-center">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{text}</p>
          <div className="d-grid gap-2">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary flex-fill"
                onClick={() => navigate(`/project/${id}`)}
              >
                Visualizar
              </button>

              {idManager == localStorage["id"] && (
                <button className="btn btn-secondary flex-fill">Editar</button>
              )}
            </div>
            {idManager == localStorage["id"] && (
              <button className="btn btn-danger">Apagar</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ fetch_custom }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  async function getProjects(e) {
    if (localStorage["id"] == 0 || !localStorage["id"] || localStorage["id"] === undefined) {
      navigate("/not-found");
      return;
    }

    e.preventDefault();

    try {
      const res = await fetch_custom("/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json()
      setProjects(data);
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { getProjects({ preventDefault: () => { } }) }, []);

  return (
    <>
      <div className="container-fluid p-0 border border-success border-2" id="login-area">
        <div className="row justify-content-center g-0">
          <div className="col-12 text-center">
            <h3 className="py-3 border-bottom border-black w-75 mx-auto">Acessando Projetos</h3>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-12 px-5">
            <form action="" method="post">
              <div className="input-group mb-3 shadow">
                <input type="text" className="form-control" placeholder="Nome do Projeto" aria-label="pesquisa" aria-describedby="button-addon1" />
                <button className="btn btn-success" type="button" id="button-addon1">Pesquisar</button>
              </div>
            </form>
          </div>
        </div>

        <div className="row d-flex justify-content-center row-cols-1 row-cols-sm-3 g-0">
          {projects.map((projectObj) => (
            <Project
              id={projectObj["idProject"]}
              idManager={projectObj["idManager"]}
              name={projectObj["name"]}
              text={projectObj["text"]}
            />
          ))}
        </div>
        <div className="row border-bottom border-black w-75 mx-auto py-3"></div>

        <div className="row justify-content-center py-3 g-0">
          <div className="col-sm-10 d-flex justify-content-center gap-3">
            <button className="btn btn-secondary w-50" onClick={() => navigate("/create-project")}>Criar Projeto</button>
            <button className="btn btn-success w-50" onClick={() => navigate("/")}>Voltar Home</button>
          </div>
        </div>
      </div>
    </>
  );
}
