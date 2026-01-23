import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import CreateTasks from "./CreateTasks";

export default function CreateProject({ setResponse, fetch_custom }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [popup, setPopup] = useState(false)

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

  useEffect(() => {
    if (localStorage["id"] == 0 || !localStorage["id"] || localStorage["id"] === undefined) {
      navigate("/not-found");
      return;
    }
  }, [navigate]);

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

      <div className="container-fluid p-0 border border-success border-2" id="login-area">
        <div className="row justify-content-center g-0">
          <div className="col-12">
            <h3 className="text-center py-3 border-bottom border-black w-75 mx-auto">Criando seu Projeto</h3>
          </div>
        </div>

        <div className="row g-0">
          <form onSubmit={createProject}>
            <div className="row justify-content-center g-0">
              <div className="col-md-10 p-3">
                <div className="input-group shadow">
                  <span className="input-group-text" id="basic-addon1">Título</span>
                  <input type="text" className="form-control" name="title" placeholder="Digite o Título do Projeto"
                    onChange={e => setTitle(e.target.value)}
                    value={title} required
                  />
                </div>
              </div>
            </div>


            <div className="row justify-content-center g-0">
              <div className="col-md-10 p-3">
                <div className="mb-3">
                  <label htmlFor="floatingTextarea" className="form-label">Informações do Projeto</label>
                  <textarea className="form-control" name="information" id="floatingTextarea" aria-label="Withtextarea" placeholder="Descrição do Projeto..." style={{ height: "140px" }}
                    onChange={e => setText(e.target.value)}
                    value={text} required
                  />
                </div>
              </div>
            </div>

            <div className="row g-0">
              <div className="col-12">
                <h3 className="text-center py-3 border-top border-black w-75 mx-auto">Tarefas do Projeto</h3>
              </div>
            </div>

            <div className="row py-3 g-0">
              <div className="col-sm-12 d-flex justify-content-center">
                <button className="btn btn-warning w-50" type="button" onClick={() => setPopup(true)}>Adicionar Tarefa</button>
              </div>
            </div>

            <div className="row justify-content-center py-3 g-0">
              <div className="col-sm-10 d-flex justify-content-center gap-3">
                <button className="btn btn-secondary w-50" type="submit">Salvar Projeto</button>
                <button className="btn btn-success w-50" onClick={() => navigate("/projects")}>Voltar</button>
              </div>
            </div>
          </form>
        </div>

      </div>

      {popup && (
        <CreateTasks setPopup={setPopup} />
      )}
    </>
  );
}