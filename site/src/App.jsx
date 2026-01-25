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

function fetch_custom(url, data) {
  const start = performance.now();
  const urlNow = window.location.href;
  if (urlNow.includes("localhost")) {
    const result = fetch("http://127.0.0.1:5000" + url, data);
    const end = performance.now();
    console.log(`tempo: ${end - start}ms`);
    return result;
  } else {
    const result = fetch(
      "https://redis-employee-site.onrender.com" + url,
      data,
    );
    const end = performance.now();
    console.log(`tempo: ${end - start}ms`);
    return result;
  }
}

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
  const [usedDB, setDB] = useState("sqlite");
  const [response, setResponse] = useState(null);

  const setId = (idNum) => {
    localStorage["id"] = idNum;
  };

  return (
    <BrowserRouter basename="/redis-employee-site">
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
