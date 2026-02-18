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
    <div>
      <p>foto de renan</p>
      <p>nome usuario: {nameEmployee}</p>
      <p>data criacao: {createdAt}</p>
      <p>texto: {content}</p>
      {(idEmployee == localStorage["id"] ||
        idManager == localStorage["id"]) && (
        <button onClick={deleteFun}>Deletar Comentário</button>
      )}
    </div>
  );
}
