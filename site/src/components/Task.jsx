import { useState, useEffect } from "react";

export default function Task({
  idWorkTask,
  name,
  content,
  done,
  idManager,
  editTask = null,
  deleteTask = null,
  fetch_custom,
}) {
  const [status, setStatus] = useState(done);
  const [doneMessage, setDoneMessage] = useState(done ? "Feito" : "Não Feito");
  const [isChange, setIsChange] = useState(false);

  function editFunction(e) {
    e.preventDefault();
    editTask({ idWorkTask, name, content });
  }

  function deleteFunction(e) {
    e.preventDefault();
    deleteTask({ idWorkTask, name, content });
  }

  async function changeStatus() {
    if (status) setDoneMessage("Feito");
    else setDoneMessage("Não feito");
    try {
      await fetch_custom(`/api/tasks/${idWorkTask}/set-status/${status}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  useEffect(() => {
    if (isChange) changeStatus();
  }, [status]);

  return (
    <div className="col">
      <div className="card shadow h-100 text-center">
        <div className="card-body">
          <h5 className="card-title title-limited">{name}</h5>
          {content && (
            <>
              <hr />
              <p className="card-text text-limited">{content}</p>
            </>
          )}
        </div>
        <div>
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
            onChange={(e) => {
              setIsChange(true);
              setStatus(e.target.checked ? 1 : 0);
            }}
            checked={status === 1}
            disabled={
              idManager != localStorage["id"] ||
              (editTask != null && deleteTask != null)
            }
          />
          <label className="form-check-label">
            Estado da Tarefa: {doneMessage}
          </label>
        </div>
        {idManager == localStorage["id"] &&
          editTask != null &&
          deleteTask != null && (
            <div className="card-footer d-flex justify-content-center gap-2">
              <button className="btn btn-danger w-50" onClick={deleteFunction}>
                Apagar
              </button>
              <button className="btn btn-secondary w-50" onClick={editFunction}>
                Editar
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
