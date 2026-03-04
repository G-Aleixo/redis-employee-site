import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

export default function CreateAccount({ fetch_custom, usedDB }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [information, setInformation] = useState("");
  const [favTeam, setFavTeam] = useState({ first: "", second: "" });
  const [pwd, setPwd] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    title: "",
    text: "",
    className: "",
  });

  const borderClass = usedDB === "sqlite" ? "border-primary" : "border-danger";

  async function createAcc(e) {
    document.activeElement?.blur();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch_custom("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          age: age,
          information: information.trim(),
          favorite_team: favTeam.first.trim(),
          password: pwd.trim(),
          joinedOn: new Date()
            .toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            })
            .trim(),
        }),
      });

      if (res.ok) {
        setAlert({
          showAlert: true,
          title: "Conta Criada!",
          text: "Sua conta foi criada! Volte para home e faça login.",
          className: "alert-success",
        });
      } else {
        setAlert({
          showAlert: true,
          title: "Um Erro Ocorreu!",
          text: "O nome que você escolheu já está em uso, tente outro nome.",
          className: "alert-danger",
        });
      }
      setLoading(false);
    } catch (error) {
      console.warn("Erro de rede ou CORS:", error);
      setAlert({
        showAlert: true,
        title: "Um Erro Ocorreu!",
        text: "O servidor não conseguiu se comunicar. Recarregue a página e tente novamente.",
        className: "alert-danger",
      });
    }
  }

  return (
    <div
      className={`container-fluid p-0 border border-2 ${borderClass}`}
      id="login-area"
    >
      {alert.showAlert && (
        <Alert
          setFunction={(prev) => setAlert({ ...prev, showAlert: false })}
          title={alert.title}
          text={alert.text}
          className={alert.className}
        />
      )}

      <form onSubmit={createAcc}>
        <div className="row justify-content-center g-0">
          <div className="col-12 text-center">
            <h3 className="py-3 border-bottom border-black w-75 mx-auto">
              Criando sua conta na Renan's Software
            </h3>
          </div>
        </div>

        <div className="row justify-content-center g-1">
          <div className="col-md-5 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon1">
                Nome de Usuário
              </span>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Digite seu nome"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
              <div className="invalid-feedback">Insira um Nome Válido</div>
            </div>
          </div>

          <div className="col-md-2 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2">
                Idade
              </span>
              <input
                type="number"
                className="form-control"
                name="age"
                placeholder={0}
                min={0}
                max={100}
                onChange={(e) => setAge(Number(e.target.value))}
                value={age}
                required
              />
              <div className="invalid-feedback">Insira uma Idade Válida</div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-1">
          <div className="col-md-3 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2">
                Senha
              </span>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Digite sua senha"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <div className="invalid-feedback">Insira uma Senha Válida</div>
            </div>
          </div>

          <div className="col-md-4 p-3">
            <div className="input-group shadow">
              <span className="input-group-text" id="basic-addon2">
                Time Favorito
              </span>
              <input
                className="form-control"
                name="favorite_team"
                list="datalistOptions"
                placeholder="Nome do seu time favorito"
                value={favTeam.first}
                onChange={(e) =>
                  setFavTeam((prev) => ({ ...prev, first: e.target.value }))
                }
                onBlur={() =>
                  setFavTeam(() => ({
                    first: "América Natal - RN",
                    second: "América Natal - RN",
                  }))
                }
                required
              />
              <datalist id="datalistOptions">
                <option value="América Natal - RN" />
                <option value="ABC Futebol Clube" />
                <option value="CR Flamengo - RJ" />
              </datalist>
            </div>
          </div>
        </div>

        <div className="row justify-content-center pb-5 pt-3 g-0">
          <div className="col-md-7 p-3">
            <div className="mb-3">
              <label htmlFor="floatingTextarea" className="form-label">
                Informações Extras
              </label>
              <textarea
                className="form-control"
                name="information"
                id="floatingTextarea"
                aria-label="Withtextarea"
                placeholder="Fale sobre você... opcional"
                style={{ resize: "none" }}
                onChange={(e) => setInformation(e.target.value)}
                value={information}
              />
            </div>
          </div>
        </div>

        <div className="row pb-5 g-0">
          <div className="col-12 d-flex justify-content-center gap-2">
            <button
              className="btn btn-success  px-4"
              type="submit"
              style={{ width: "160px" }}
              disabled={loading}
            >
              Criar Conta
            </button>
            <button
              className="btn btn-dark  px-4"
              type="button"
              style={{ width: "160px" }}
              onClick={() => navigate("/")}
            >
              Voltar a Home
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
