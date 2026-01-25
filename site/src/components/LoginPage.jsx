import { useNavigate } from "react-router-dom";
import renanImg from "../assets/renan.png";
import { useEffect } from "react";

export default function LoginPage({ response, setId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage["id"] == 0 ||
      !localStorage["id"] ||
      localStorage["id"] === undefined
    ) {
      navigate("/not-found");
      return;
    }
  }, [navigate]);

  if (response == null) return null;
  setId(response.id);

  return (
    <div
      className="container-fluid p-0 border border-success border-2"
      id="login-area"
    >
      <div className="row justify-content-center g-0">
        <div className="col-sm-8">
          <div className="row justify-content-center g-0 pt-3">
            <div className="input-group mb-3 px-0 shadow w-75 rounded">
              <span
                className="input-group-text"
                id="basic-addon1"
                style={{ width: "17ex" }}
              >
                ID no Sistema:
              </span>
              <input
                type="text"
                className="form-control"
                value={response.id}
                aria-label="SystemId"
                aria-describedby="basic-addon1"
                readOnly
              />
            </div>
          </div>

          <div className="row justify-content-center g-0">
            <div className="input-group mb-3 px-0 shadow w-75 rounded">
              <span
                className="input-group-text"
                id="basic-addon2"
                style={{ width: "17ex" }}
              >
                Nome:
              </span>
              <input
                type="text"
                className="form-control"
                value={response.name}
                aria-label="Username"
                aria-describedby="basic-addon2"
                readOnly
              />
            </div>
          </div>

          <div className="row justify-content-center g-0">
            <div className="input-group mb-3 px-0 shadow w-75 rounded">
              <span
                className="input-group-text"
                id="basic-addon3"
                style={{ width: "17ex" }}
              >
                Idade:
              </span>
              <input
                type="number"
                className="form-control"
                value={response.age}
                aria-label="userAge"
                aria-describedby="basic-addon3"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="col-sm-4 d-flex align-items-center justify-content-center border-start border-bottom border-dark-subtle ">
          <img
            src={renanImg}
            className="img-fluid w-50 rounded-circle d-none d-sm-block"
          />
        </div>
      </div>

      {response.information && (
        <div className="row justify-content-center pt-3 g-0">
          <div className="col-sm-10 px-3">
            <div className="mb-3">
              <label htmlFor="floatingTextarea" className="form-label">
                Sobre você:
              </label>
              <textarea
                className="form-control shadow rounded"
                placeholder="Leave a comment here"
                id="floatingTextarea"
                readOnly
                value={response.information}
              ></textarea>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center pt-3 g-0">
        <div className="col-sm-10 px-3 rounded">
          <div className="input-group mb-3 shadow rounded">
            <span
              className="input-group-text"
              id="basic-addon4"
              style={{ width: "17ex" }}
            >
              Time Favorito:
            </span>
            <input
              type="text"
              className="form-control"
              value={response.favTeam}
              aria-label="userTeam"
              aria-describedby="basic-addon4"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="row justify-content-center p-3 g-0">
        <div className="col-sm-10 px-0">
          <div className="input-group mb-3 shadow rounded">
            <span
              className="input-group-text"
              id="basic-addon5"
              style={{ width: "17ex" }}
            >
              Cadastro em:
            </span>
            <input
              type="text"
              className="form-control"
              value={
                response.joinedOn
                  ? " " +
                    new Date(
                      response.joinedOn.replace(" ", "T") + "Z",
                    ).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                  : "Indefinido"
              }
              aria-label="lastAccess"
              aria-describedby="basic-addon5"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="row justify-content-center py-3 g-0">
        <div className="col-sm-10 d-flex justify-content-center gap-3">
          <button
            className="btn btn-success w-50"
            onClick={() => navigate("/")}
          >
            Voltar Home
          </button>
          <button
            className="btn btn-secondary w-50"
            onClick={() => navigate("/projects")}
          >
            Ver Projetos
          </button>
        </div>
      </div>
    </div>
  );
}
