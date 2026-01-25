import { useEffect, useState } from "react";
import "../style/loading.css";

export function LoadingScreen() {
  const [qtd, setQtd] = useState(0);
  const [slowResponse, setslowResponse] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setQtd((prev) => (prev + 1) % 4);
    }, 200);

    const timeout = setTimeout(() => {
      setslowResponse(true);
    }, 5500);

    return () => {
      clearInterval(timeInterval);
      clearTimeout(timeout);
    };
  }, []);

  const loadingText = slowResponse
    ? "Está demorando... recomendamos que recarregue a página."
    : `Carregando${".".repeat(qtd)}`;

  return (
    <div className="loading">
      <div className="text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text">{loadingText}</p>
      </div>
    </div>
  );
}
