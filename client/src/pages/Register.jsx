import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Form from "../components/Form";
import LinkUnderline from "../components/LinkUnderline";

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
    <div className="p-5 min-h-screen flex flex-col items-center justify-center">
      <Form handleSubmit={handleSubmit} title="Регистрирај се!">
        <Input
          type="text"
          name="username"
          placeholder="Корисничко име"
          value={formData.username}
          onChange={handleChange}
        />

        <Input
          type="email"
          name="email"
          placeholder="Е-пошта"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Лозинка"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Потврди ја лозинката"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button buttonType="form" text="Продолжи" />

        <LinkUnderline link="/login" text="Кон најава" />
      </Form>
    </div>
  );
}
