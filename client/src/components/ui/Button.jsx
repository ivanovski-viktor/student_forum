export default function Button({
  buttonType,
  extraClass = "",
  text,
  link,
  ...rest
}) {
  let className =
    "bg-orange-600 mt-3 text-white py-2 rounded-full hover:bg-white hover:text-orange-600 border-2 border-transparent hover:border-orange-600 transition duration-200 ease-in-out cursor-pointer " +
    extraClass;

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
