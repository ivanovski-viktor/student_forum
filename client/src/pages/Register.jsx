import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "raw",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json();
        alert(
          "Registration failed: " + (errorData.message || response.statusText)
        );
        return;
      }

      const data = await response.json();
      alert("Registration successful! Welcome, " + data.username);

      navigate("/login");
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-10 border border-orange-100 bg-white rounded-xl">
      <h2 className="text-2xl mb-10 text-center">Регистрирај се!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          formMethod="POST"
          type="text"
          name="username"
          placeholder="Корисничко име"
          value={formData.username}
          onChange={handleChange}
          required
          className="py-2 px-4 border  text-gray-800 placeholder:text-gray-400 border-gray-400 rounded-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Е-пошта"
          value={formData.email}
          onChange={handleChange}
          required
          className="py-2 px-4 border rounded text-gray-800 placeholder:text-gray-400 border-gray-400 rounded-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Лозинка"
          value={formData.password}
          onChange={handleChange}
          required
          className="py-2 px-4 border  text-gray-800 placeholder:text-gray-400 border-gray-400 rounded-full"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Потврди ја лозинката"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="py-2 px-4 border  text-gray-00 placeholder:text-gray-400 border-gray-400 rounded-full"
        />
        <button
          type="submit"
          className="bg-orange-600 mt-3 text-white py-2 rounded-full hover:bg-white hover:text-orange-600 border-2 border-transparent hover:border-orange-600 transition duration-200 ease-in-out cursor-pointer"
        >
          Продолжи
        </button>
      </form>
    </div>
  );
}
