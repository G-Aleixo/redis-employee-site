import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Project from "./Project.jsx";

export default function Projects({ fetch_custom }) {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState([]);

  async function searchProject(e) {
    if (
      localStorage["id"] == 0 ||
      !localStorage["id"] ||
      localStorage["id"] === undefined
    ) {
      navigate("/not-found");
      return;
    }

    e.preventDefault();

    try {
      const res = await fetch_custom(`/api/projects/search/${projectName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  async function getProjects(e) {
    if (
      localStorage["id"] == 0 ||
      !localStorage["id"] ||
      localStorage["id"] === undefined
    ) {
      navigate("/not-found");
      return;
    }

    e.preventDefault();

    try {
      const res = await fetch_custom("/api/projects", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  useEffect(() => {
    getProjects({ preventDefault: () => {} });
  }, []);

  return (
    <>
      <div
        className="container-fluid p-0 border border-success border-2"
        id="login-area"
      >
        <div className="row justify-content-center g-0">
          <div className="col-12 text-center">
            <h3 className="py-3 border-bottom border-black w-75 mx-auto">
              Acessando Projetos
            </h3>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-12 px-5">
            <form onSubmit={searchProject}>
              <div className="input-group mb-3 shadow">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome do Projeto"
                  aria-label="pesquisa"
                  aria-describedby="button-addon1"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  type="submit"
                  id="button-addon1"
                >
                  Pesquisar
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="row d-flex justify-content-center row-cols-1 row-cols-sm-3 g-0">
          {projects.map((projectObj) => (
            <Project
              key={projectObj.idProject}
              id={projectObj.idProject}
              idManager={projectObj.idManager}
              name={projectObj.name}
              text={projectObj.text}
              fetch_custom={fetch_custom}
            />
          ))}
        </div>
        <div className="row border-bottom border-black w-75 mx-auto py-3"></div>

        <div className="row justify-content-center py-3 g-0">
          <div className="col-sm-10 d-flex justify-content-center gap-3">
            <button
              className="btn btn-secondary w-50"
              onClick={() => navigate("/create-project")}
            >
              Criar Projeto
            </button>
            <button
              className="btn btn-success w-50"
              onClick={() => navigate("/")}
            >
              Voltar Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
