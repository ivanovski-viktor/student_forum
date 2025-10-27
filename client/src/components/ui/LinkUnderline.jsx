import { Link } from "react-router-dom";
export default function LinkUnderline({
  link,
  text,
  colorClass = "text-secondary",
  bgClass = "bg-secondary",
  ...rest
}) {
  const color = colorClass || "secondary";
  return (
    <Link
      className={`${colorClass} group inline-flex items-center justify-center relative`}
      to={link}
      {...rest}
    >
      <span className="relative inline-block">
        {text}
        <span
          className={`${bgClass} absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all ease-in-out duration-200`}
        ></span>
      </span>
    </Link>
  );
}
