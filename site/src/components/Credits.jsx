import { useNavigate } from "react-router-dom";

export default function Credits() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container-fluid g-0 p-0" id="login-area">
        <div className="row justify-content-center g-0 pb-2 pt-4">
          <div className="col-12 text-center mx-auto">
            <h4>Créditos</h4>
          </div>
        </div>

        <div className="row border-bottom border-black w-75 mx-auto g-0 py-1"></div>
        
        <div className="row justify-content-center g-0 py-4">
          <div className="col-12 text-center mx-auto">
            <h4>Frontend: Kaio Henrique</h4>
            <em>"Dev Front-end nem dev é." - Kaio H.</em>
          </div>
        </div>

        <div className="row justify-content-center g-0 py-4">
          <div className="col-12 text-center mx-auto">
            <h4>Backend: Guilherme Aleixo</h4>
            <em>"Já tentou ligar e desligar o servidor?" - Guilherme Aleixo</em>
          </div>
        </div>

        <div className="row justify-content-center g-0 py-4">
          <div className="col-12 text-center mx-auto">
            <h4>Fullstack: Brasilicio Henrique</h4>
            <em>"Eu ja fudi e desfudi esse código 3 vezes." - Brasilicio Henrique</em>
          </div>
        </div>

        <div className="row justify-content-center g-0 py-4">
          <div className="col-12 text-center mx-auto">
            <h4>Slides: Vinicius Miguel</h4>
            <em>"Sem Terraria hoje, pela terceira vez." - Vinicius Miguel</em>
          </div>
        </div>

        <div className="row border-bottom border-black w-75 mx-auto g-0 py-1"></div>

        <div className="row justify-content-center g-0 py-4">
          <div className="col-12 text-center mx-auto">
            <h5>Apoio: Renan, The Rocha</h5>
            <em>O grande, o homem, aquele que chutou uma bola e hoje ela se chama lua. <br /> - <br /> O nosso Professor.</em>
          </div>
        </div>

        <div className="row justify-content-center g-0 pb-4">
          <div className="col-sm-10 d-flex justify-content-center gap-3">
            <button className="btn btn-success w-50" onClick={() => navigate("/")}>
              Voltar a Home
            </button>
          </div>
      </div>
      </div>
    </>
  );
}
