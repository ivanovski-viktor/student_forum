export default function Input({
  type,
  name,
  placeholder,
  value,
  required = false,
  ...rest
}) {
  return (
    <input
      className="py-2 px-4 border  text-gray-800 placeholder:text-gray-400 border-gray-400 rounded-full"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      required={required}
      {...rest}
    />
  );
}
