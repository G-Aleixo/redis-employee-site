import { useState, useEffect } from "react";

function Project({ idManager, name, text, setPage }) {
  return (
    <div className="col">
      <div className="card text-center">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{text}</p>
          <button className="btn btn-primary" onClick={() => setPage("ProjectPage")}>Visualizar</button>
          {idManager == localStorage["id"] && (
            <>
              <button>Editar</button>
              <button>Apagar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ setPage, fetch_custom }) {
  const [projects, setProjects] = useState([]);

  async function getProjects(e) {
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

  useEffect(() => {
    getProjects({ preventDefault: () => {} });
  }, []);
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

        <div className="row d-flex justify-content-center row-cols-1 row-cols-md-3 g-0 px-3">
          {projects.map((projectObj) => (
            <Project idManager={projectObj["idManager"]} name={projectObj["name"]} text={projectObj["text"]} setPage={setPage} />
          ))}
        </div>
        <div className="row border-bottom border-black w-75 mx-auto py-3"></div>

        <div className="row justify-content-center py-3 g-0">
          <div className="col-sm-10 d-flex justify-content-center gap-3">
            <button className="btn btn-secondary w-50" onClick={() => setPage("CreateProject")}>Criar Projeto</button>
            <button className="btn btn-success w-50" onClick={() => setPage("Login")}>Voltar Home</button>
          </div>
        </div>
      </div>
    </>
  );
}
