import { useEffect, useState } from "react";
import "../style/loading.css";

export function LoadingScreen() {
  const [qtd, setQtd] = useState(0);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    let step = 0;
    let timeoutId;
    function loop() {
      const time = step % 4 === 3 ? 700 : 300;
      setQtd((prev) => (prev + 1) % 4);
      step++;
      timeoutId = setTimeout(loop, time);
    }
    loop();

    const timeout = setTimeout(() => {
      setIsSlow(true);
    }, 7000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeout);
    };
  }, []);

  const loadingText = isSlow
    ? `Está demorando muito... recomendamos que espere mais um pouco${".".repeat(qtd)}`
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
