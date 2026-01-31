export default function Task({ name, content, idManager }) {
  return (
    <div className="col">
      <div className="card shadow h-100 text-center">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{content}</p>
        </div>
        {idManager == localStorage["id"] ||
          (idManager == -1 && (
            <div className="card-footer d-flex justify-content-center gap-2">
              <button className="btn btn-danger w-50">Apagar</button>
              <button className="btn btn-secondary w-50">Editar</button>
            </div>
          ))}
      </div>
    </div>
  );
}
