import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTasks({ setPopup }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage["id"] == 0 || !localStorage["id"] || localStorage["id"] === undefined) {
      navigate("/not-found");
      return;
    }
  }, [navigate]);

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form action="" onSubmit={() => setPopup(false)}>
            <div class="modal-header">
              <h5 class="modal-title">Criando uma Tarefa</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setPopup(false)}></button>
            </div>

            <div className="modal-body">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Título</span>
                <input type="text" class="form-control" placeholder="Título da Tarefa" aria-label="Username" aria-describedby="basic-addon1" />
              </div>

              <div className="mb-3">
                <label htmlFor="floatingTextarea" className="form-label">Informações Extras</label>
                <textarea className="form-control" name="information" id="floatingTextarea" aria-label="Withtextarea" placeholder="Fale sobre você... opcional"
                  onChange={null}
                  value={""}
                  style={{ height: '140px' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="container-fluid">
                <div className="row justify-content-center g-0">
                  <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-success w-50" type="submit" onClick={() => setPopup(false)}>Salvar Tarefa</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}