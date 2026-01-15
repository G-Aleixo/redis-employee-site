import { useState } from "react";

export default function CreateAccount({ setPage }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [information, setInformation] = useState("");
  const [favTeam, setFavTeam] = useState({
    first: "",
    second: ""
  });
  const [pwd, setPwd] = useState("");
  const [response, setResponse] = useState(null);

  async function createAcc(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          age: age,
          information: information,
          favorite_team: favTeam.first,
          password: pwd
        })
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  return (
    <div className="container p-0 border border-top-0 border-dark-subtle">
      <form onSubmit={createAcc}>
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <h3 className="py-3 border-bottom">Criando sua conta na Renan"s Software</h3>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-5 py-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">Nome de Usuário</span>
              <input type="text" className="form-control" name="username" placeholder="Digite seu nome" 
                onChange={e => setName(e.target.value)} 
                value={name} required
              />
              <div className="invalid-feedback">
                Insira um Nome Válido
              </div>
            </div>
          </div>

          <div className="col-md-2 py-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon2">Idade</span>
              <input type="number" className="form-control" name="age" placeholder={0} min={0} max={100} 
                onChange={e => setAge(Number(e.target.value))} 
                value={age} required 
              />
              <div className="invalid-feedback">
                Insira uma Idade Válida
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-3 py-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon2">Senha</span>
              <input type="password" className="form-control" name="password" placeholder="Digite sua senha" 
                onChange={e => setPwd(e.target.value)} 
                value={pwd} required 
              />
              <div className="invalid-feedback">
                Insira uma Senha Válida
              </div>
            </div>
          </div>

          <div className="col-md-4 py-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon2">Time Favorito</span>
              <input className="form-control" name="favorite_team" list="datalistOptions" placeholder="Nome do seu time favorito" 
                value={favTeam.first} 
                onChange={(e) => setFavTeam(prev => ({ ...prev, first: e.target.value }))} 
                onBlur={() => setFavTeam(prev => ({ ...prev, first: "América Natal - RN", second: "América Natal - RN" }))} 
                required
              />
              <datalist id="datalistOptions">
                <option value="América Natal - RN" />
              </datalist>
            </div>
          </div>
        </div>

        <div className="row justify-content-center pb-5 pt-3">
          <div className="col-md-7">
            <div className="input-group display-flex">
              <span className="input-group-text">Informações sobre você</span>
              <textarea className="form-control" name="information" aria-label="Withtextarea" placeholder="Fale sobre você... opcional" 
                onChange={(e) => setInformation(e.target.value)}
                value={information}
              />
            </div>
          </div>
        </div>

        <div className="row pb-5">
          <div className="col-12 d-flex justify-content-center gap-2">
            <button className="btn btn-success  px-4" type="submit" style={{ width: "160px" }}>Criar Conta</button>
            <button className="btn btn-dark  px-4" type="button" style={{ width: "160px" }} onClick={() => setPage("Login")}>Voltar a Home</button>
          </div>
        </div>
      </form>
      {response && !response.error && (
        <div className="mt-4 p-3 border rounded bg-light">
          <p>Conta criada com sucesso! Você já pode fazer login.</p>
        </div>
      )} {response && response.error && (
        <div className="mt-4 p-3 border rounded bg-light text-danger">
          <p>{response.error}</p>
        </div>
      )}
    </div>
  );
}
