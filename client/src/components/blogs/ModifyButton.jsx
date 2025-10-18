export default function ModifyButton({
  onClick,
  extraClass,
  popupText = "Измени",
  children,
}) {
  return (
    <button
      onClick={onClick}
      className={`modify-btn popup-sm--wrapper ${extraClass}`}
    >
      <div className="popup-sm">{popupText}</div>
      {children}
    </button>
  );
}
