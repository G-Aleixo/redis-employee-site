import { useState } from "react";
import sqliteImg from "../assets/sqlite_logo.png";
import redisImg from "../assets/Logo-redis.svg.png";

function Alert({ alert, setFunction }) {
  let title, text, className;
  if (alert.pwdWrong) {
    title = "Senha Incorreta!";
    text = "A senha inserida não pertence a essa conta ou não existe, tente novamente.";
    className = "alert-warning";
  } else if (alert.notExists) {
    title = "Conta Não Encontrada!";
    text = "Sua conta não foi encontrada, tente criar uma conta no botão \"Criar Conta\"";
    className = "alert-danger";
  }
  return (
    <div className={`alert ${className} alert-dismissible w-50 mx-auto`} role="alert">
      <h4>{title}</h4>
      <p>{text}</p>
      <button type="button" className="btn-close" onClick={setFunction} aria-label="Close"></button>
    </div>
  );
}

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
  const [alert, setAlert] = useState({pwdWrong: false, notExists: false});

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
      
      if (res.ok) {
        setPage("LoginPage");
      } else {
        if (res.status === 404) {
          setAlert({ pwdWrong: false, notExists: true });
        } else if (res.status === 401) {
          setAlert({ pwdWrong: true, notExists: false });
        }
      }
    } catch (error) {
      console.warn("Erro de rede ou CORS:", error);
    }
  }

  return (
    <div className={`container-fluid p-0 border border-2 ${borderClass}`} id="login-area">
      {response && response.error && alert.notExists && (
        <Alert alert={alert} setFunction={() => setAlert({...alert, notExists: false})} />
      )}

      {response && response.error && alert.pwdWrong && (
        <Alert alert={alert} setFunction={() => setAlert({...alert, pwdWrong: false})} />
      )}
      
      <form onSubmit={login}>
        <div className="row justify-content-center g-0">
          <div className="col-12 text-center">
            <img id="bd-logo" className="img-thumbnail my-3 border-3 shadow p-3 mb-5 bg-body-tertiary rounded" src={imageScr} alt="" />
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-md-6 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon1" style={{width : '10ex'}}>Usuário</span>
              <input type="text" className="form-control" name="username" placeholder="Digite seu nome" onChange={e => setName(e.target.value)} required></input>
              <div className="invalid-feedback">
                Insira um Nome Válido
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-md-6 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2" style={{width : '10ex'}}>Senha</span>
              <input type="password" className="form-control" name="password" placeholder="Digite sua senha" onChange={e => setPwd(e.target.value)} required></input>
              <div className="invalid-feedback">
                Insira uma Senha Válida
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-12 d-flex justify-content-center gap-3 p-4">
            <button className={`btn ${btnClass}`} type="submit">Fazer Login</button>
            <button className="btn btn-secondary" type="button" onClick={() => setPage("CreateAccount")}>Criar Conta</button>
          </div>
        </div>
      </form>
    </div>
  );
}
