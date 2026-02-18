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
      <span className="input-group-text" id="basic-addon1">
        Escreva seu comentário
      </span>
      <input
        type="text"
        className="form-control"
        name="username"
        placeholder="Comentário"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        required
      />
      <button type="submit">Enviar comentário</button>
    </form>
  );
}
