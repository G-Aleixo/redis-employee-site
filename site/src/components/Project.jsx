import { useNavigate } from "react-router-dom";

export default function Project({
  id,
  idManager,
  name,
  text,
  fetch_custom,
  getProjects,
}) {
  const navigate = useNavigate();

  function editProject(e) {
    e.preventDefault();
    navigate(`/create-project/${id}`);
  }

  async function deleteProject(e) {
    e.preventDefault();
    const res = await fetch_custom(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) getProjects({ preventDefault: () => {} });
  }

  return (
    <div className="col p-3">
      <div className="card text-center">
        <div className="card-body">
          <h5 className="card-title title-limited">{name}</h5>
          <hr />
          <p className="card-text text-limited">{text}</p>
          <div className="d-grid gap-2">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary flex-fill"
                onClick={() =>
                  navigate(`/project/${id}`, {
                    state: { idManager: idManager },
                  })
                }
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
