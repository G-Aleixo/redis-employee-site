export default function Landing({ usedDB, setDB }) {
  return (
    <div className="container-fluid p-0" id="land-page">
      <div className="row m-0 p-0 g-0 border-top border-2 border-black">
        <div className="col-12 m-0 p-0">
          <div
            className="d-flex w-100 p-0"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="selector"
              id="selectSQLite"
              autoComplete="off"
              checked={usedDB === "sqlite"}
              onChange={() => setDB("sqlite")}
            />
            <label
              className="btn btn-outline-primary rounded-bottom-0 rounded-top-0 border-top-0 flex-fill border-bottom-0"
              htmlFor="selectSQLite"
              style={{ width: "50%" }}
            >
              SQLite
            </label>
            <input
              type="radio"
              className="btn-check"
              name="selector"
              id="selectRedis"
              autoComplete="off"
              checked={usedDB === "redis"}
              onChange={() => setDB("redis")}
            />
            <label
              className="btn btn-outline-danger rounded-bottom-0 rounded-top-0 border-top-0 flex-fill border-bottom-0"
              htmlFor="selectRedis"
              style={{ width: "50%" }}
            >
              Redis
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
