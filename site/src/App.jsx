import { useState } from 'react';
import Header from './components/Header';
import Landing from './components/Landing';
import Login from './components/Login';




function App() {

  const [usedDB, setDB] = useState('sqlite');

  return (
    <>
      <Header />
      <Landing usedDB={usedDB} setDB={setDB} />
      <Login usedDB={usedDB} />
    </>
  )
}

export default App
