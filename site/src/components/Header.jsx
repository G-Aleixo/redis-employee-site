export function Header(){
    return(
        <div className="container" id="header-area">

            <div className="row justify-content-center align-items-center">
                <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="https://renan.alves.empresas/area.funcionario" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                        <button className="btn btn-success" type="button" id="button-addon1">Pesquisar</button>
                    </div>
                </div>


            <div className="row justify-content-center position-relative align-items-center custom-header">
                <div className="col-12 text-center">
                    <h1 id="title-text">Renan's Software</h1>

                    <img 
                    src="https://media.licdn.com/dms/image/v2/C4D03AQGgyUv7tOQClg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1640197397641?e=2147483647&v=beta&t=JeICrbpFVOul3jwwyzE7d0hDnoV89mXq4ZdETBl0fpw"
                    alt="Logo"
                    className="d-none d-md-block"
                    style={{
                        position: 'absolute',
                        right: '0px',
                        top: '0%',
                        height: '100%',
                        width: 'auto',
                        objectFit: 'cover'
                        }}
                    />
                </div>

                <img 
                src="https://cdn-icons-png.flaticon.com/512/9672/9672242.png"
                alt="LogoBD"
                className="img-fluid d-none d-md-block"
                style={{
                    position: 'absolute',
                    left: '0px',
                    top: '0%',
                    height: '100%',
                    width: 'auto',
                    objectFit: 'cover'
                    }}
                />
            </div>

            <div className="row justify-content-center border m-0 p-0" id="nav-bar">
                <div className="col-12 m-0 p-0">
                    <ul className="nav navbar-expand-md gap-1">
                        <li className="nav-item h-100 flex-fill">
                            <a className="nav-link active" aria-disabled="true" href="https://pt.wikipedia.org/wiki/Extra%C3%A7%C3%A3o_de_petr%C3%B3leo">Empresas Renan</a>
                        </li>
                        <li className="nav-item h-100 flex-fill">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item h-100 flex-fill">
                            <a className="nav-link" href="#">Créditos</a>
                        </li>
                        <li className="nav-item h-100 flex-fill">
                            <a className="nav-link" href="https://br.linkedin.com/in/renan-alves-de-morais-rocha-453427184">Conheça Renan</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>   
    )
}

export default Header