import { useState } from "react";

export default function CreateComment({
  project_id,
  loadProjectPage,
  fetch_custom,
}) {
  const [content, setContent] = useState("");

  async function createComment(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom(`/api/projects/${project_id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          employee_id: localStorage["id"],
          createdAt: new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }),
        }),
      });
      if (res.ok) {
        loadProjectPage();
        setContent("");
      }
    } catch (error) {
      console.warn("Erro de server ou CORS", error);
    }
  }

  return (
    <form onSubmit={createComment}>
      <div className="row pt-3 g-0">
        <div className="col-12 text-center">
            <h5 className="py-3 border-bottom border-black w-75 mx-auto">
              Comentários
            </h5>
          </div>
      </div>

      <div className="row justify-content-center g-0">
        <div className="col-10">
          <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Digite seu comentário</label>
            <textarea class="form-control" name="username" id="exampleFormControlTextarea1" onChange={(e) => setContent(e.target.value)} value={content} required rows="1" onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}}></textarea>
          </div>
        </div>
      </div>

      <div className="row justify-content-center g-0">
        <div className="col-12 d-flex justify-content-center py-2">
          <button className="btn btn-success" type="submit">Enviar comentário</button>
        </div>
      </div>
    </form>
  );
}
