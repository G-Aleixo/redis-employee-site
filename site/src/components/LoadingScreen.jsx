import { useEffect } from "react";
import "../style/loading.css"; 

export function LoadingScreen({ text = "Carregando..." }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="loading">
      <div className="text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
}
