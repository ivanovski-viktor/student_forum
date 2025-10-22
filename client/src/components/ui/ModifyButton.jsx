export default function ModifyButton({
  active,
  onClick,
  extraClass,
  popupText = "Измени",
  children,
}) {
  let className = "modify-btn popup-sm--wrapper";
  if (active) className += " active";
  if (extraClass) className += ` ${extraClass}`;

  return (
    <button onClick={onClick} className={className}>
      <div className="popup-sm">{popupText}</div>
      {children}
    </button>
  );
}
