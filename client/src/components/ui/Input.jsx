import { useRef, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function Input({
  type,
  name,
  placeholder,
  value,
  required = true,
  ...rest
}) {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "py-2 px-4 border-2 text-gray-800 placeholder:text-gray-400 border-gray-400 rounded-full w-full";

  function handlePasswordVisibility(e) {
    e.preventDefault(); // prevent button from submitting if inside form
    setShowPassword((prev) => !prev);
  }

  return type === "password" ? (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className={inputClass}
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        {...rest}
      />
      <button
        type="button"
        onClick={handlePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200 ease-in-out cursor-pointer text-lg"
      >
        {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
      </button>
    </div>
  ) : (
    <input
      className={inputClass}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      required={required}
      {...rest}
    />
  );
}
