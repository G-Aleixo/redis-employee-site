import sqliteImg from '../assets/sqlite_logo.png'
import redisImg from '../assets/Logo-redis.svg.png'
export function Login( {usedDB} ){
    
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
    console.log('DB atual:', usedDB)    
    
    return(
        <div className={`container p-0 border border-top-0 ${borderClass}`} id="login-area">
            <form action="">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <img id="bd-logo" className="img-thumbnail my-3 border-3 shadow p-3 mb-5 bg-body-tertiary rounded" src={imageScr} alt=""/>
                    </div>
                </div>
                
                
                <div className="row justify-content-center">
                    <div className="col-md-6 py-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">Usuario:</span>
                            <input type="text" className="form-control" placeholder="Nome" required></input>
                            <div className="invalid-feedback">
                                Insira um Nome Valido.
                            </div> 
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-6 py-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon2">Senha:</span>
                            <input type="password" className="form-control" placeholder="Senha" required></input>
                            <div className="invalid-feedback">
                                Insira uma Senha Valida.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 d-flex justify-content-center gap-3 p-4">
                        <button className={`btn ${btnClass}`} type='submit'>Fazer Login</button>
                        <button className="btn btn-secondary" type=''>Criar Conta</button>
                    </div>
                </div>

            </form>

        </div>
    )
}

export default Login