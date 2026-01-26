import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getId } from "../functions/id";
import Alert from "./Alert";
import CreateTasks from "./CreateTasks";

export default function CreateProject({ fetch_custom, usedDB }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    valuesState = ["", "", 0],
    isEdit = false
  } = location.state || {};

  const [title, setTitle] = useState(valuesState[0]);
  const [text, setText] = useState(valuesState[1]);
  const [popup, setPopup] = useState(false);

  const [alert, setAlert] = useState({ sucess: false, error: false });

  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  function projectFunction(e) {
    if (isEdit) {
      editProject(e);
    } else {
      createProject(e);
    }
  }

  async function editProject(e) {
    e.preventDefault();

    try {
      await fetch_custom(`/api/projects/${valuesState[2]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          text: text || "",
        }),
      });
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  async function createProject(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          text: text,
          manager_id: getId(),
        }),
      });
      if (res.ok) {
        setAlert({ error: false, sucess: true });
      } else {
        setAlert({ sucess: false, error: true });
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
      setAlert({ sucess: false, error: true });
    }
  }

  useEffect(() => {
    if (getId() == 0 || !getId() || getId() === undefined) {
      navigate("/not-found");
      return;
    }
  }, [navigate]);

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

            <div className="row g-0">
              <div className="col-12">
                <h3 className="text-center py-3 border-top border-black w-75 mx-auto">
                  Tarefas do Projeto
                </h3>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-1 p-4 justify-content-center">
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

            <div className="row py-3 g-0">
              <div className="col-sm-12 d-flex justify-content-center">
                <button className="btn btn-warning w-50" type="button" onClick={() => setPopup(true)}>
                  Adicionar Tarefa
                </button>
              </div>
            </div>

            {alert.sucess && isEdit && (
              <Alert
                setFunction={() => setAlert({ ...alert, sucess: false })}
                title="Projeto Editado!"
                text="Seu projeto foi editado! Volte para o visualizador de projetos."
                className="alert-success"
              />
            )}

            {alert.sucess && !isEdit && (
              <Alert
                setFunction={() => setAlert({ ...alert, sucess: false })}
                title="Projeto Criado!"
                text="Seu projeto foi criado! Volte para o visualizador de projetos."
                className="alert-success"
              />
            )}

            {alert.error && (
              <Alert
                setFunction={() => setAlert({ ...alert, error: false })}
                title="Um Erro Ocorreu!"
                text="O nome que você escolheu já está em uso, tente outro nome."
                className="alert-danger"
              />
            )}

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

      {popup && <CreateTasks setPopup={setPopup} />}
    </>
  );
}
