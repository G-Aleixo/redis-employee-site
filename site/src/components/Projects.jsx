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
      <div className="container-fluid g-0 p-0">

        <div className="row justify-content-center py-3 g-0">
          <div className="col-sm-10 d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={() => setPage("Login")}>Voltar Home</button>
          </div>
        </div>
      </div>

      <form onSubmit={addProject}>
        <div className="row justify-content-center g-1">
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

        <div className="row justify-content-center g-1">
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
