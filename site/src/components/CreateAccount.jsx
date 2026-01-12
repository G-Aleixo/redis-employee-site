import { useState } from "react"

export function CreateAccount ( {setPage} ){
    
    const [favTeam, setFavTeam] = useState({
        firts: "",
        second: ""
    });
    
    return(
        <div className="container p-0 border border-top-0 border-dark-subtle">
            <form action="http://127.0.0.1:5000/signup" method="post">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <h3 className="py-3 border-bottom">Criando sua conta na Renan's Software</h3>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-5 py-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">Usuario:</span>
                            <input type="text" className="form-control" name="username" placeholder="Nome" required></input>
                            <div className="invalid-feedback">
                                Insira um Nome Valido.
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2 py-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon2">Idade:</span>
                            <input type="number" className="form-control" name="userage" placeholder={0} required min={0} max={100}></input>
                            <div className="invalid-feedback">
                                Insira um Nome Valido.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-3 py-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon2">Idade:</span>
                            <input type="password" className="form-control" name="password" placeholder={0} required min={0} max={100}></input>
                            <div className="invalid-feedback">
                                Insira um Nome Valido.
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4 py-3">
                        <input className="form-control" name="favorite_team" list="datalistOptions" id="exampleDataList" placeholder="Escreva seu time favorito..." value={favTeam.firts} onChange={(e) => setFavTeam(prev => ({ ...prev, firts: e.target.value}))} onBlur={() => setFavTeam(prev => ({...prev, firts: "América Natal - RN", second: "América Natal - RN"}))} />
                        <datalist id="datalistOptions">
                            <option value="América Natal - RN"/>
                        </datalist>
                    </div>
                </div>

                <div className="row justify-content-center pb-5 pt-3">
                    <div className="col-md-7">
                        <div className="input-group">
                            <span className="input-group-text">Informações sobre você</span>
                            <textarea className="form-control" name="information" aria-label="Withtextarea"></textarea>
                        </div>
                    </div>
                </div>

                <div className="row pb-5">
                    <div className="col-12 d-flex justify-content-center gap-2">
                        <button class="btn btn-success  px-4" type="submit" style={{ width: '160px' }}>Criar Conta</button>
                        <button class="btn btn-dark  px-4" type="button" style={{ width: '160px' }} onClick={setPage}>Voltar a Home</button>
                    </div>
                </div>


            </form>
        </div>
    )
}

export default CreateAccount