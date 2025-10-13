import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
export default function LinkUnderline({ link, text, colorClass, ...rest }) {
  const color = colorClass || "green-600";

  return (
    <Link
      className={`${"text-" + color} mx-auto group inline-block relative`}
      to={link}
      {...rest}
    >
      {text}{" "}
      <div
        className={`${
          "bg-" + color
        } absolute h-[1px] w-0 overflow-hidden group-hover:w-full transition-all ease-in-out duration-200 bottom-0 left-0`}
      ></div>
    </Link>
  );
}
