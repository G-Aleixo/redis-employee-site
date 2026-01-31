export default function Task({ name, content, idManager, editTask, deleteTask }) {
  function editFunction(e) {
    e.preventDefault();
    editTask({name: name, content: content});
  }

  function deleteFunction(e) {
    e.preventDefault();
    deleteTask({name: name, content: content});
  }

  return (
    <div className="col">
      <div className="card shadow h-100 text-center">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{content}</p>
        </div>
        {idManager == localStorage["id"] && (
          <div className="card-footer d-flex justify-content-center gap-2">
            <button className="btn btn-danger w-50" onClick={deleteFunction}>Apagar</button>
            <button className="btn btn-secondary w-50" onClick={editFunction}>Editar</button>
          </div>
        )}
      </div>
    </div>
  );
}
