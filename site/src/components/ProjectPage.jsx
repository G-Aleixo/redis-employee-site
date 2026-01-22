export default function ProjectPage({ setPage }) {
  return (
    <div className="container-fluid p-0 border border-success border-2" id="login-area">
      <div className="row justify-content-center g-0">
        <div className="col-12 border-bottom border-black w-75 mx-auto pt-1">
          <h2 className="text-center">*Project Title*</h2>
        </div>
      </div>

      <div className="row justify-content-center pt-3 g-0">
        <div className="col-sm-10 px-3">
          <div className="mb-3">
            <label htmlFor="floatingTextarea" className="form-label">Descrição Projeto:</label>
            <textarea className="form-control shadow rounded" placeholder="Leave a comment here" id="floatingTextarea" readOnly value={"w"} style={{ height: '180px' }}></textarea>
          </div>
        </div>
      </div>

      <div className="row border-bottom border-black w-75 mx-auto py-1"></div>

      <div className="row justify-content-center g-0 pt-3">
        <div className="col-12">
          <h4 className="text-center">Tarefas do Projeto</h4>
        </div>
      </div>

      <div className="row justify-content-center g-0 pt-3">
        <div className="col-10">
          <table className="table align-middle table-dark table-hover table-bordered border-2">
            <thead>
              <tr>
                <th scope="col">Num</th>
                <th scope="col">Task Name</th>
                <th scope="col">Acesso</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Task</td>
                <td>
                  <button className="btn btn-warning" onClick={null}>Verificar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="row justify-content-center g-0">
        <div className="col-sm-10 d-flex justify-content-center gap-3">
          <button className="btn btn-success w-50" onClick={() => setPage("Login")}>Voltar</button>
          <button className="btn btn-secondary w-50" onClick={() => setPage("ProjectPage")}>Criar Tarefa</button>
        </div>
      </div>
    </div>
  );
}
