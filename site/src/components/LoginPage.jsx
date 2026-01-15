export default function LoginPage({ response, setPage }) {
  return (
    <>
      {/* EDITAR PARA FICAR BONITO E ADEQUADO A SITE */}
      <div className="mt-4 p-3 border rounded bg-light">
        <p>ID no sistema: {response.id}</p>
        <p>Seu nome de usuário: {response.name}</p>
        <p>Sua idade: {response.age}</p>
        <p>Seu time favorito: {response.favTeam}</p>
        {response.information && <p>Sobre você: {response.information}</p>}
        <p>Você entrou em: 
          {response.joinedOn ? " " + new Date(response.joinedOn.replace(" ", "T") + "Z")
          .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "Indefinido"}
        </p>
        <button onClick={() => setPage("Login")}>Voltar Home</button>
      </div>
    </>
  );
}