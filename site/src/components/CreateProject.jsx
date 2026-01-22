import { useState } from "react";
import Alert from "./Alert";

export default function CreateProject({ setResponse, setPage, fetch_custom }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [alert, setAlert] = useState({ sucess: false, error: false });

  async function createProject(e) {
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

      if (res.ok) {
        setAlert({ ...alert, sucess: true });
      } else {
        setAlert({ ...alert, error: true });
      }

    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  return (
    <>
      {alert.sucess && (
        <Alert setFunction={() => setAlert({ ...alert, sucess: false })}
          title="Projeto Criado!" text="Seu projeto foi criado! Volte para o visualizador de projetos."
          className="alert-success" />
      )}

      {alert.error && (
        <Alert setFunction={() => setAlert({ ...alert, error: false })}
          title="Um Erro Ocorreu!" text="O nome que você escolheu já está em uso, tente outro nome."
          className="alert-danger" />
      )}
      <form onSubmit={createProject}>
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
      <button onClick={() => setPage("Projects")}>Voltar Projetos</button>
    </>
  );
}