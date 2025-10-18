export default function Button({
  buttonType,
  extraClass = "",
  text,
  link,
  ...rest
}) {
  let className = "btn btn--primary " + extraClass;

  return buttonType === "form" ? (
    <button type="submit" className={className} {...rest}>
      {text}
    </button>
  ) : (
    <a href={link} className={className} {...rest}>
      {text}
    </a>
  );
}
