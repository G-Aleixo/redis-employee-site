export default function Task({
  idWorkTask,
  name,
  content,
  idManager,
  editTask = null,
  deleteTask = null,
}) {
  function editFunction(e) {
    e.preventDefault();
    editTask({ idWorkTask, name, content });
  }

  function deleteFunction(e) {
    e.preventDefault();
    deleteTask({ idWorkTask, name, content });
  }

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
        {idManager == localStorage["id"] &&
          (editTask != null || deleteTask != null) && (
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
