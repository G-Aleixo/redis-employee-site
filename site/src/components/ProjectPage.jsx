import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getId } from "../functions/id";

export default function ProjectPage({ fetch_custom }) {
  const navigate = useNavigate();

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
    <div
      className="container-fluid p-0 border border-success border-2"
      id="login-area"
    >
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
              <textarea
                className="form-control shadow rounded"
                placeholder="Leave a comment here"
                id="floatingTextarea"
                readOnly
                value={project["text"]}
                style={{ height: "180px" }}
              ></textarea>
            </div>
          </div>
        </div>
      )}
      <p>id do criador: {project["idManager"]}</p>
      <p>id projeto: {project["idProject"]}</p>
      <p>quando projeto foi criado: </p>

      <div className="row border-bottom border-black w-75 mx-auto py-1"></div>

      <div className="row justify-content-center g-0 pt-3">
        <div className="col-12">
          <h4 className="text-center">Tarefas do Projeto</h4>
        </div>
      </div>

      <div className="row justify-content-center g-0 pt-3">
        <div className="col-10">
          <table className="table align-middle table-dark table-hover table-bordered border-2">
            <thead>
              <tr>
                <th scope="col">Num</th>
                <th scope="col">Task Name</th>
                <th scope="col">Acesso</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Task</td>
                <td>
                  <button className="btn btn-warning" onClick={null}>
                    Verificar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="row justify-content-center g-0">
        <div className="col-sm-10 d-flex justify-content-center gap-3">
          <button
            className="btn btn-success w-50"
            onClick={() => navigate("/projects")}
          >
            Voltar
          </button>
          <button
            className="btn btn-secondary w-50"
            onClick={() => navigate("/create-task")}
          >
            Criar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
}
