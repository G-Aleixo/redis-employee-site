import { useState } from "react";
import sqliteImg from "../assets/sqlite_logo.png";
import redisImg from "../assets/Logo-redis.svg.png";

export default function Login({ response, setResponse, usedDB, setPage }) {
  const imageScr =
    usedDB === "sqlite"
      ? sqliteImg
      : redisImg;

  const borderClass =
    usedDB === "sqlite"
      ? "border-primary"
      : "border-danger";

  const btnClass =
    usedDB === "sqlite"
      ? "btn-primary"
      : "btn-danger";

  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [showedAlert, setShowedAlert] = useState(false)

  async function login(e) {
    e.preventDefault();

    try {
      const res = await fetch("https://redis-employee-site.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          password: pwd
        })
      });

      const data = await res.json();
      setResponse(data);
      setPage("LoginPage");
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  return (
    <div className={`container p-0 border border-2 ${borderClass}`} id="login-area">
      {/* AQUI VAI ALERTS DE ERRO */}
      {response && response.error && showedAlert && ( // erro
        <div className="alert alert-danger alert-dismissible w-50 mx-auto" role="alert">
          <h4>Conta Não Encontrada!</h4>
          <p>Sua conta não foi encontrada, tente criar uma conta no botão "Criar Conta"</p>
          <button type="button" className="btn-close" onClick={() => setShowedAlert(false)} aria-label="Close"></button>
        </div>
      )}

      {response && response.error && showedAlert && ( // erro
        <div className="alert alert-warning alert-dismissible w-50 mx-auto" role="alert">
          <h4>Senha Incorreta!</h4>
          <p>A senha inserida não pertence a essa conta ou não existe, tente novamente.</p>
          <button type="button" className="btn-close" onClick={() => setShowedAlert(false)} aria-label="Close"></button>
        </div>
      )}
      <form onSubmit={login}>
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <img id="bd-logo" className="img-thumbnail my-3 border-3 shadow p-3 mb-5 bg-body-tertiary rounded" src={imageScr} alt="" />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 py-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon1">Nome de Usuário</span>
              <input type="text" className="form-control" name="username" placeholder="Digite seu nome" onChange={e => setName(e.target.value)} required></input>
              <div className="invalid-feedback">
                Insira um Nome Válido
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 py-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2">Senha</span>
              <input type="password" className="form-control" name="password" placeholder="Digite sua senha" onChange={e => setPwd(e.target.value)} required></input>
              <div className="invalid-feedback">
                Insira uma Senha Válida
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 d-flex justify-content-center gap-3 p-4">
            <button className={`btn ${btnClass}`} type="submit" onClick={()=> setShowedAlert(true)}>Fazer Login</button>
            <button className="btn btn-secondary" type="button" onClick={() => setPage("CreateAccount")}>Criar Conta</button>
          </div>
        </div>
      </form>
    </div>
  );
}
