import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
export default function LinkUnderline({ link, text, colorClass, ...rest }) {
  return (
    <Link
      className={`${
        colorClass || "text-green-600"
      } no-underline underline-offset-2 hover:underline mx-auto group`}
      to={link}
      {...rest}
    >
      {text}{" "}
      <FontAwesomeIcon
        className="opacity-0 max-w-0 w-4 transition-all duration-200 ease-in-out group-hover:max-w-4 group-hover:opacity-100 group-hover:ml-0.5"
        icon={faArrowRightLong}
      />
    </Link>
  );
}
