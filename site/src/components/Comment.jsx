import renanImg from "../assets/renan.jpeg";

export default function Comment({
  content,
  nameEmployee,
  createdAt,
  idEmployee,
  idManager,
  idComment,
  deleteComment,
}) {
  function deleteFun(e) {
    e.preventDefault();
    deleteComment(idComment);
  }

  return (
    <div className="container-fluid g-0">
      <div className="row justify-content-center g-0 px-3 py-2">
        <div className="col-3 col-sm-2 col-md-1 d-flex flex-column align-items-center">
          <img
            src={renanImg}
            className="img-fluid w-75 rounded-circle d-block"
          />
          <div
            style={{
              width: "2px",
              flexGrow: "1",
              backgroundColor: "gray",
              marginTop: "6px",
            }}
          ></div>
        </div>
        <div className="col-8 col-sm-10 col-md-11 ps-3">
          <div className="row g-0">
            <div className="col-12">
              <p className="text-wrap">
                <strong>{nameEmployee}#{idEmployee}</strong> - {createdAt}
              </p>
            </div>
            <div className="col-11">
              <p className="text-break" style={{ whiteSpace: "pre-wrap" }}>
                {content}
              </p>
            </div>
            <div className="col-12">
              {(idEmployee == localStorage["id"] ||
                idManager == localStorage["id"]) && (
                <button className="btn btn-danger btn-sm" onClick={deleteFun}>
                  Deletar Comentário
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
