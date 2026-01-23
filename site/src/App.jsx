import { useState } from "react";
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
  const [page, setPage] = useState("Login");
  const [response, setResponse] = useState(null);

  const setId = (idNum) => {
    localStorage["id"] = idNum
  }

  return (
    <>
      <Header setPage={setPage} />
      {page === "Login" && 
        <>
          <Landing usedDB={usedDB} setDB={setDB} />
          <Login response={response} setResponse={setResponse} usedDB={usedDB} setDB={setDB} setPage={setPage} fetch_custom={fetch_custom} />
        </>
      }
      {page === "CreateAccount" && <CreateAccount setResponse={setResponse} setPage={setPage} fetch_custom={fetch_custom} />}
      {page === "CreateProject" && <CreateProject setResponse={setResponse} setPage={setPage} fetch_custom={fetch_custom} />}
      {page === "LoginPage" && <LoginPage response={response} setPage={setPage} setId={setId} />}
      {page === "Projects" && <Projects setResponse={setResponse} setPage={setPage} fetch_custom={fetch_custom} />}
      {page === "ProjectPage" && <ProjectPage setPage={setPage}/>}
      {page === "CreateTasks" && <CreateTasks setPage={setPage}/>}
    </>
  );
}
