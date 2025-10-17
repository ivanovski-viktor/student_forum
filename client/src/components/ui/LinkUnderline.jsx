import { Link } from "react-router-dom";
export default function LinkUnderline({
  link,
  text,
  colorClass = "text-green-600",
  bgClass = "bg-green-600",
  ...rest
}) {
  const color = colorClass || "green-600";

  return (
    <Link
      className={`${colorClass} group inline-flex items-center justify-center`}
      to={link}
      {...rest}
    >
      <span className="relative py-0.5">
        {text}{" "}
        <span
          className={`${bgClass} absolute block h-[1px] w-0 overflow-hidden group-hover:w-full transition-all ease-in-out duration-200 bottom-0 left-0`}
        ></span>
      </span>
    </Link>
  );
}
