export default function Comment({ content, nameEmployee, createdAt }) {
  return (
    <div>
      <p>foto de renan</p>
      <p>nome usuario: {nameEmployee}</p>
      <p>data criacao: {createdAt}</p>
      <p>texto: {content}</p>
    </div>
  );
}
