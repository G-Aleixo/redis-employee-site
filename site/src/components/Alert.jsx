export default function Alert({ setFunction, title, text, className = "alert-success" }) {
  return (
    <div
      className={`alert ${className} alert-dismissible w-75 mx-auto mt-4 sticky-top`}
      role="alert"
    >
      <h4>{title}</h4>
      <hr />
      <p>{text}</p>
      <button
        type="button"
        className="btn-close"
        onClick={setFunction}
        aria-label="Close"
      ></button>
    </div>
  );
}
