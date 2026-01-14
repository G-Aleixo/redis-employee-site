import { useState } from 'react'
import sqliteImg from '../assets/sqlite_logo.png'
import redisImg from '../assets/Logo-redis.svg.png'

export default function Login({ usedDB, goCreateAcc }) {
  const imageScr =
    usedDB === 'sqlite'
      ? sqliteImg
      : redisImg

  const borderClass =
    usedDB === 'sqlite'
      ? 'border-primary'
      : 'border-danger'

  const btnClass =
    usedDB === 'sqlite'
      ? 'btn-primary'
      : 'btn-danger'

  const [name, setName] = useState("")
  const [pwd, setPwd] = useState("")
  const [response, setResponse] = useState(null)

  async function login(e) {
    e.preventDefault()

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          password: pwd
        })
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.log("Erro:", error)
    }
  }

  return (
    <div className={`container p-0 border border-top-0 ${borderClass}`} id="login-area">
      <form onSubmit={login}>
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <img id="bd-logo" className="img-thumbnail my-3 border-3 shadow p-3 mb-5 bg-body-tertiary rounded" src={imageScr} alt="" />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 py-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">Nome de Usuário</span>
              <input type="text" className="form-control" name="username" placeholder="Digite seu nome" onChange={e => setName(e.target.value)} required></input>
              <div className="invalid-feedback">
                Insira um Nome Válido
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 py-3">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon2">Senha</span>
              <input type="password" className="form-control" name="password" placeholder="Digite sua senha" onChange={e => setPwd(e.target.value)} required></input>
              <div className="invalid-feedback">
                Insira uma Senha Válida
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 d-flex justify-content-center gap-3 p-4">
            <button className={`btn ${btnClass}`} type='submit'>Fazer Login</button>
            <button className="btn btn-secondary" type='button' onClick={goCreateAcc}>Criar Conta</button>
          </div>
        </div>
      </form>
      {response && !response.error && (
        <div className="mt-4 p-3 border rounded bg-light">
          <p>ID no sistema: {response.id}</p>
          <p>Seu nome de usuário: {response.name}</p>
          <p>Sua idade: {response.age}</p>
          <p>Seu time favorito: {response.favTeam}</p>
          {response.information && <p>Sobre você: {response.information}</p>}
          <p>Você entrou em: {" " + new Date(response.joinedOn).toLocaleString('pt-BR')}</p>
        </div>
      )} {response && response.error && (
        <div className="mt-4 p-3 border rounded bg-light text-danger">
          <p>Esse usuário não foi cadastrado</p>
        </div>
      )}
    </div>
  )
}
