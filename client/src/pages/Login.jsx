import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "raw",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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
      console.log("Welcome back " + data.token);
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-10 border border-orange-100 bg-white rounded-xl">
      <h2 className="text-2xl mb-10 text-center">Најави се!</h2>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <Input
          type="email"
          name="email"
          placeholder="Корисничко име"
          value={formData.username}
          onChange={handleChange}
          required={true}
        />
        <Input
          type="password"
          name="password"
          placeholder="Лозинка"
          value={formData.password}
          onChange={handleChange}
          required={true}
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
