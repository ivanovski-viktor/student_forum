import { Link } from "react-router-dom";

export default function LinkUnderline({ link, text, ...rest }) {
  return (
    <Link
      className="text-green-600 no-underline underline-offset-2 hover:underline mx-auto"
      to={link}
      {...rest}
    >
      {text}
    </Link>
  );
}
