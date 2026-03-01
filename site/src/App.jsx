import { useState } from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import LoginPage from "./components/LoginPage";
import Projects from "./components/Projects";
import ProjectPage from "./components/ProjectPage";
import CreateProject from "./components/CreateProject";
import Credits from "./components/Credits";
import { LoadingScreen } from "./components/LoadingScreen";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="text-center p-5">
      <h1>404</h1>
      <p>Recurso não encontrado</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>Voltar Home</button>
    </div>
  );
}

export function App() {
  const [loading, setLoading] = useState(false);

  const [usedDB, setDB] = useState("sqlite");
  const [response, setResponse] = useState(null);

  async function fetch_custom(url, options = {}) {
    const baseUrl = window.location.href.includes("localhost")
      ? "http://127.0.0.1:5000"
      : "https://redis-employee-site.onrender.com";

    setLoading(true);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const delayTime = usedDB === "redis" ? 0 : 3500;

    try {
      options = {
        ...options,
        headers: {
          ...options.headers,
          usedDB: usedDB,
        },
      };
      await delay(delayTime);
      const response = await fetch(baseUrl + url, {...options});
      return response;
    } finally {
      setLoading(false);
    }
  }

  return (
    <HashRouter>
      {loading && <LoadingScreen />}
      <Header />
      <Landing usedDB={usedDB} setDB={setDB} />
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setResponse={setResponse}
              usedDB={usedDB}
              fetch_custom={fetch_custom}
            />
          }
        />
        <Route path="/credits" element={<Credits />} />
        <Route
          path="/create-account"
          element={
            <CreateAccount fetch_custom={fetch_custom} usedDB={usedDB} />
          }
        />
        <Route
          path="/create-project/:id?"
          element={
            <CreateProject
              fetch_custom={fetch_custom}
              usedDB={usedDB}
            />
          }
        />

        <Route
          path="/login-page"
          element={<LoginPage response={response} usedDB={usedDB} />}
        />
        <Route
          path="/projects"
          element={
            <Projects
              fetch_custom={fetch_custom}
              usedDB={usedDB}
            />
          }
        />
        <Route
          path="/project/:id"
          element={<ProjectPage fetch_custom={fetch_custom} usedDB={usedDB} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
