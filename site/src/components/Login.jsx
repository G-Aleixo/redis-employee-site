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
    <div className={`container p-0 border border-top-0 ${borderClass}`} id="login-area">
      {/* AQUI VAI ALERTS DE ERRO */}
      {response && response.error && ( // erro
        <div className="mt-4 p-3 border rounded bg-light text-danger">
          <p>Esse usuário não foi cadastrado</p>
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
            <div className="input-group">
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
            <div className="input-group">
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
            <button className={`btn ${btnClass}`} type="submit">Fazer Login</button>
            <button className="btn btn-secondary" type="button" onClick={() => setPage("CreateAccount")}>Criar Conta</button>
          </div>
        </div>
      </form>
    </div>
  );
}
