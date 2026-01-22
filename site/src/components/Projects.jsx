import { useState } from "react";

export default function Projects({ setResponse, setPage, fetch_custom }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  async function addProject(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: title,
          text: text,
          manager_id: localStorage["id"]
        })
      });

      const data = await res.json()
      setResponse(data);
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }
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
          {/* quando vc for replicar, replique a col tambem */}
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Special title treatment</h5>
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <button className="btn btn-primary" onClick={() => setPage("ProjectPage")}>Visualizar</button>
              </div>
            </div>
          </div>

        </div>

        <div className="row border-bottom border-black w-75 mx-auto py-3"></div>

        <div className="row justify-content-center py-3 g-0">
          <div className="col-sm-10 d-flex justify-content-center gap-3">
            <button className="btn btn-secondary w-50" onClick={() => setPage("Login")}>Criar Projeto</button>
            <button className="btn btn-success w-50" onClick={() => setPage("Login")}>Voltar Home</button>
          </div>
        </div>
      </div>

      <form onSubmit={addProject}>
        <div className="row justify-content-center g-0">
          <div className="col-md-5 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon1">titulo</span>
              <input type="text" className="form-control" name="title" placeholder="Digite titulo projeto"
                onChange={e => setTitle(e.target.value)}
                value={title} required
              />
              <div className="invalid-feedback">
                Insira um Nome Válido
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-md-3 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2">texto</span>
              <input type="text" className="form-control" name="text" placeholder="Digite texto projeto"
                onChange={e => setText(e.target.value)}
                value={text} required
              />
              <div className="invalid-feedback">
                Insira uma Senha Válida
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-success  px-4" type="submit" style={{ width: "160px" }}>Criar projeto</button>
      </form>
    </>
  );
}
