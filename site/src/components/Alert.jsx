export default function Alert({ setFunction, title, text, className }) {
  return (
    <div className={`alert ${className} alert-dismissible w-50 mx-auto`} role="alert">
      <h4>{title}</h4>
      <p>{text}</p>
      <button type="button" className="btn-close" onClick={setFunction} aria-label="Close"></button>
    </div>
  );
}
