import { useNavigate } from "react-router-dom";
import { getId } from "../functions/id";

export default function Project({ id, idManager, name, text, fetch_custom }) {
  const navigate = useNavigate();

  function editProject(e) {
    e.preventDefault();

    navigate("/create-project", {
      state: {
        valuesState: [name, text || "", id],
        isEdit: true,
      },
    });
  }

  async function deleteProject(e) {
    e.preventDefault();

    try {
      await fetch_custom(`/api/projects/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

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

              {idManager == getId() && (
                <button
                  className="btn btn-secondary flex-fill"
                  onClick={editProject}
                >
                  Editar
                </button>
              )}
            </div>
            {idManager == getId() && (
              <button className="btn btn-danger" onClick={deleteProject}>
                Apagar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
