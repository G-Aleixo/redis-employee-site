import { useState } from "react";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import LoginPage from "./components/LoginPage";
import Projects from "./components/Projects";

export default function App() {
  const [usedDB, setDB] = useState("sqlite");
  const [page, setPage] = useState("Login");
  const [response, setResponse] = useState(null);

  return (
    <>
      <Header setPage={setPage} />
      {page === "Login" && 
        <>
          <Landing usedDB={usedDB} setDB={setDB} />
          <Login response={response} setResponse={setResponse} usedDB={usedDB} setDB={setDB} setPage={setPage} />
        </>
      }
      {page === "CreateAccount" && <CreateAccount setResponse={setResponse} setPage={setPage} />}
      {page === "LoginPage" && <LoginPage response={response} setPage={setPage} />}
      {page === "Projects" && <Projects setResponse={setResponse} setPage={setPage} />}
    </>
  );
}
