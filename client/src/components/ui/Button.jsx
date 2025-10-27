import { Link } from "react-router-dom";

export default function Button({
  buttonType,
  extraClass = "",
  text,
  link,
  ...rest
}) {
  let className = "btn " + extraClass;

  if (buttonType === "form") {
    return (
      <button type="submit" className={className} {...rest}>
        {text}
      </button>
    );
  }

  if (buttonType === "button") {
    return (
      <button type="button" className={className} {...rest}>
        {text}
      </button>
    );
  }

  return (
    <Link to={link} className={className} {...rest}>
      {text}
    </Link>
  );
}
