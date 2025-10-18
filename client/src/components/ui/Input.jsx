import { useRef, useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

export default function Input({
  type,
  name,
  placeholder,
  value,
  required = true,
  className = "input",
  ...rest
}) {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  function handlePasswordVisibility(e) {
    e.preventDefault(); // prevent button from submitting if inside form
    setShowPassword((prev) => !prev);
  }

  return type === "password" ? (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className={className}
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
        className="input-btn"
      >
        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
      </button>
    </div>
  ) : (
    <input
      className={className}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      required={required}
      {...rest}
    />
  );
}
