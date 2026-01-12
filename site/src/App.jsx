import { useState } from 'react';
import Header from './components/Header';
import Landing from './components/Landing';
import Login from './components/Login';
import GoCreateAcc from './components/CreateAccount';




function App() {

  const [usedDB, setDB] = useState('sqlite');
  const [page, setPage] = useState("login");

  return (
    <>
      <Header />

      {page === 'login' && (<Landing usedDB={usedDB} setDB={setDB} />)}
      {page === 'login' && (<Login usedDB={usedDB} setDB={setDB} goCreateAcc={() => setPage('goCreateAcc')} />)}
      {page === 'goCreateAcc' && <GoCreateAcc usedDB={usedDB} setPage={() => setPage('login')} />}


    </>
  )
}

export default App
