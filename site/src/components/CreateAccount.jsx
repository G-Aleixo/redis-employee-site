import { useState } from "react";
import Alert from "./Alert";

export default function CreateAccount({ setResponse, setPage, fetch_custom }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [information, setInformation] = useState("");
  const [favTeam, setFavTeam] = useState({ first: "", second: "" });
  const [pwd, setPwd] = useState("");

  const [alert, setAlert] = useState({ sucess: false, error: false });

  async function createAcc(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom("/signup", {
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

      if (res.ok) {
        setAlert({ ...alert, sucess: true });
      } else {
        setAlert({ ...alert, error: true });
      }

    } catch (error) {
      console.warn("Erro de rede ou CORS:", error);
    }
  }

  return (
    <div className="container-fluid p-0 border border-2 border-success" id="login-area">
      {alert.sucess && (
        <Alert setFunction={() => setAlert({...alert, sucess: false})} 
        title="Conta Criada!" text="Sua conta foi criada! Volte para home e faça login." 
        className="alert-success" />
      )} 
      
      {alert.error && (
        <Alert setFunction={() => setAlert({...alert, error: false})} 
          title="Um Erro Ocorreu!" text="O nome que você escolheu já está em uso, tente outro nome." 
          className="alert-danger" />
      )}

      <form onSubmit={createAcc}>
        <div className="row justify-content-center g-0">
          <div className="col-12 text-center">
            <h3 className="py-3 border-bottom border-black w-75 mx-auto">Criando sua conta na Renan's Software</h3>
          </div>
        </div>

        <div className="row justify-content-center g-1">
          <div className="col-md-5 p-3">
            <div className="input-group shadow">
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

          <div className="col-md-2 p-3">
            <div className="input-group shadow">
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

        <div className="row justify-content-center g-1">
          <div className="col-md-3 p-3">
            <div className="input-group shadow">
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

          <div className="col-md-4 p-3">
            <div className="input-group shadow">
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

        <div className="row justify-content-center pb-5 pt-3 g-0">
          <div className="col-md-7 p-3">
            <div className="mb-3">
              <label htmlFor="floatingTextarea" className="form-label">Informações Extras</label>
              <textarea className="form-control" name="information" id="floatingTextarea" aria-label="Withtextarea" placeholder="Fale sobre você... opcional" 
                onChange={(e) => setInformation(e.target.value)}
                value={information}
              />
            </div>
          </div>
        </div>

        <div className="row pb-5 g-0">
          <div className="col-12 d-flex justify-content-center gap-2">
            <button className="btn btn-success  px-4" type="submit" style={{ width: "160px" }}>Criar Conta</button>
            <button className="btn btn-dark  px-4" type="button" style={{ width: "160px" }} onClick={() => setPage("Login")}>Voltar a Home</button>
          </div>
        </div>
      </form>
    </div>
  );
}
