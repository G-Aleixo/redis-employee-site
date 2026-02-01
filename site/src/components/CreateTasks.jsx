export default function CreateTasks({ setPopup, nameTask, setNameTask, contentTask, setContentTask, setTaskData }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 100}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form action="" onSubmit={setTaskData}>
            <div className="modal-header">
              <h5 className="modal-title">Criando uma Tarefa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setPopup(false)}></button>
            </div>

            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Título
                </span>
                <input type="text" className="form-control" placeholder="Título da Tarefa" aria-label="Username" aria-describedby="basic-addon1" value={nameTask} onChange={(e) => setNameTask(e.target.value)} required/>
              </div>

              <div className="mb-3">
                <label htmlFor="floatingTextarea" className="form-label">
                  Informações Extras
                </label>
                <textarea className="form-control" name="information" id="floatingTextarea" aria-label="Withtextarea" placeholder="Descreva a tarefa... opcional" style={{ height: "140px", resize: "none" }} value={contentTask} onChange={(e) => setContentTask(e.target.value)} />
              </div>
            </div>

            <div className="modal-footer">
              <div className="container-fluid">
                <div className="row justify-content-center g-0">
                  <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-success w-50" type="submit">
                      Salvar Tarefa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
