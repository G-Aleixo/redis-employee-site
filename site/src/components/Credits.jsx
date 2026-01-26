import { useNavigate } from "react-router-dom";

export default function Credits() {
  const navigate = useNavigate();

  return (
    <>
      <p>feito por</p>
      <ul>
        <li>Brasilicio</li>
        <li>Guilherme</li>
        <li>Kaio</li>
        <li>Vinícius</li>
      </ul>
      <p>Apoio de: Renan, The Rocha</p>
      <button onClick={() => navigate("/")}>Voltar Home</button>
    </>
  );
}
