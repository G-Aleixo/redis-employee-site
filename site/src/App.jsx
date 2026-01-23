import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import LoginPage from "./components/LoginPage";
import Projects from "./components/Projects";
import ProjectPage from "./components/ProjectPage";
import CreateProject from "./components/CreateProject";
import CreateTasks from "./components/CreateTasks";

function fetch_custom(url, data) {
  if (true) {
    return fetch("http://127.0.0.1:5000" + url, data);
  } else {
    return fetch("https://redis-employee-site.onrender.com" + url, data)
  }
}

export default function App() {
  const [usedDB, setDB] = useState("sqlite");
  const [response, setResponse] = useState(null);

  const setId = (idNum) => {
    localStorage["id"] = idNum
  }

  return (
    <BrowserRouter basename="/redis-employee-site">
      <Header />
      <Routes>
        <Route path="/"
          element={
            <>
              <Landing usedDB={usedDB} setDB={setDB} />
              <Login response={response} setResponse={setResponse} usedDB={usedDB} setDB={setDB} fetch_custom={fetch_custom} />
            </>
          }
        />
        <Route path="/create-account"
          element={<CreateAccount setResponse={setResponse} fetch_custom={fetch_custom} />}
        />
        <Route path="/create-project"
          element={<CreateProject setResponse={setResponse} fetch_custom={fetch_custom} />}
        />
        <Route path="/login-page"
          element={<LoginPage response={response} setId={setId} />}
        />
        <Route path="/projects"
          element={<Projects setResponse={setResponse} fetch_custom={fetch_custom} />}
        />
        <Route path="/project-page"
          element={<ProjectPage />}
        />
        <Route path="/create-tasks"
          element={<CreateTasks />}
        />
      </Routes>
    </BrowserRouter>
  );
}
