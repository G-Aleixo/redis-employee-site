import { useNavigate } from "react-router-dom";

export default function Project({ id, idManager, name, text, fetch_custom }) {
  const navigate = useNavigate();

  function editProject(e) {
    e.preventDefault();

    navigate("/create-project", {
      state: {
        valuesState: [name, text || ""],
        isEdit: true,
      },
    });
  }

  async function deleteProject(e) {
    e.preventDefault();
    console.log("Você clicou em apagar o projeto " + id);
    try {
      await fetch_custom("URL DE GUILHERME", {
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

              {idManager == localStorage["id"] && (
                <button
                  className="btn btn-secondary flex-fill"
                  onClick={editProject}
                >
                  Editar
                </button>
              )}
            </div>
            {idManager == localStorage["id"] && (
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
