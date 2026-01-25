import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import LoginPage from "./components/LoginPage";
import Projects from "./components/Projects";
import ProjectPage from "./components/ProjectPage";
import CreateProject from "./components/CreateProject";
import CreateTasks from "./components/CreateTasks";
import Credits from "./components/Credits";
import LoadingScreen from "./components/LoadingScreen";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="text-center p-5">
      <h1>404</h1>
      <p>Recurso não encontrado</p>
      <button onClick={() => navigate("/")}>Voltar Home</button>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(false);

  const [usedDB, setDB] = useState("sqlite");
  const [response, setResponse] = useState(null);

  const setId = (idNum) => {
    localStorage["id"] = idNum;
  };

  async function fetch_custom(url, options) {
    const start = performance.now();
    const baseUrl = window.location.href.includes("localhost")
      ? "http://127.0.0.1:5000"
      : "https://redis-employee-site.onrender.com";

    setLoading(true);

    try {
      const response = await fetch(baseUrl + url, options);
      return response;
    } finally {
      const end = performance.now();
      console.log(`tempo: ${end - start}ms`);
      setLoading(false);
    }
  }

  return (
    <BrowserRouter basename="/redis-employee-site">
      {loading && <LoadingScreen />}
      <Header />
      <Landing usedDB={usedDB} setDB={setDB} />
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setResponse={setResponse}
              setId={setId}
              usedDB={usedDB}
              fetch_custom={fetch_custom}
            />
          }
        />
        <Route path="/credits" element={<Credits />} />
        <Route
          path="/create-account"
          element={<CreateAccount fetch_custom={fetch_custom} />}
        />
        <Route
          path="/create-project"
          element={
            <CreateProject
              setResponse={setResponse}
              fetch_custom={fetch_custom}
            />
          }
        />
        <Route
          path="/login-page"
          element={<LoginPage response={response} setId={setId} />}
        />
        <Route
          path="/projects"
          element={
            <Projects setResponse={setResponse} fetch_custom={fetch_custom} />
          }
        />
        <Route
          path="/project/:id"
          element={<ProjectPage fetch_custom={fetch_custom} />}
        />
        <Route path="/create-tasks" element={<CreateTasks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
