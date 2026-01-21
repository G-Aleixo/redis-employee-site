export default function Projects({ setResponse, setPage }) {
    async function addProject(e) {
        e.preventDefault();

        try {
            const res = await fetch("https://redis-employee-site.onrender.com/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "Projeto",
                    manager_id: 1
                })
            });

            const data = await res.json()
            setResponse(data);
        } catch {
            console.warn("AAAAAAAAAAAAAA")
        }
    }
    return (
        <>
            <div className="container-fluid g-0 p-0">

                <div className="row justify-content-center py-3 g-0">
                    <div className="col-sm-10 d-flex justify-content-center">
                        <button className="btn btn-success w-50" onClick={() => setPage("Login")}>Voltar Home</button>
                    </div>
                </div>
            </div>

            <button onClick={addProject}>Adicionar projeto</button>
            <p>Hello world</p>
        </>
    );
}
