import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import sqliteImg from "../assets/sqlite_logo.png";
import redisImg from "../assets/Logo-redis.svg.png";

export default function Login({ setResponse, usedDB, fetch_custom }) {
  const navigate = useNavigate();

  const imageScr = usedDB === "sqlite" ? sqliteImg : redisImg;

  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  const btnClass = usedDB === "sqlite" ? "btn-primary" : "btn-danger";

  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");

  const [alert, setAlert] = useState({ 
    showAlert: false, 
    title: "", 
    text: "", 
    className: "" 
  });

  async function login(e) {
    e.preventDefault();

    try {
      const res = await fetch_custom("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          password: pwd.trim(),
        }),
      });

      const data = await res.json();
      setResponse(data);

      if (res.ok) {
        navigate("/login-page");
      } else {
        if (res.status === 404) {
          setAlert({ 
            showAlert: true, 
            title: "Conta Não Encontrada!", 
            text: "Sua conta não foi encontrada, tente criar uma conta no botão 'Criar Conta'.",
            className: "alert-danger"
          });
        } else if (res.status === 401) {
          setAlert({ 
            showAlert: true, 
            title: "Senha incorreta!", 
            text: "A senha que você digitou esta incorreta.",
            className: "alert-danger"
          });
        }
      }
    } catch (error) {
      console.warn("Erro de rede ou CORS:", error);
      setAlert({ 
        showAlert: true, 
        title: "Um Erro Ocorreu!", 
        text: "Ocorreu um erro ao tentar acessar o servidor. Error 404",
        className: "alert-warning"
      });
    }
  }

  useEffect(() => {
    localStorage["id"] = 0;
  }, []);

  return (
    <div className={`container-fluid p-0 border border-2 ${borderClass}`} id="login-area">
      {alert.showAlert && (
        <Alert
          setFunction={(prev) => setAlert({ ...prev, showAlert: false })}
          title={alert.title}
          text={alert.text}
          className={alert.className}
        />
      )}

      <form onSubmit={login}>
        <div className="row justify-content-center g-0">
          <div className="col-12 text-center">
            <img
              id="bd-logo"
              className="img-thumbnail my-3 border-3 shadow p-3 mb-5 bg-body-tertiary rounded"
              src={imageScr}
              alt=""
            />
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-md-6 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon1" style={{ width: "10ex" }}>
                Usuário
              </span>
              <input type="text" className="form-control" name="username" placeholder="Digite seu nome" onChange={(e) => setName(e.target.value)} required></input>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-md-6 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2" style={{ width: "10ex" }}>
                Senha
              </span>
              <input type="password" className="form-control" name="password" placeholder="Digite sua senha" onChange={(e) => setPwd(e.target.value)} required></input>
              <div className="invalid-feedback">Insira uma Senha Válida</div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-0">
          <div className="col-12 d-flex justify-content-center gap-3 p-4">
            <button className={`btn ${btnClass} d-flex align-items-center justify-content-center`} type="submit">
              Fazer Login
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate("/create-account")}>Criar Conta</button>
          </div>
        </div>
      </form>
    </div>
  );
}
