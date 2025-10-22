import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthUserContext";

import Input from "../components/ui/Input";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";
import LinkUnderline from "../components/ui/LinkUnderline";
import Message from "../components/ui/Message";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ fix: must be JSON, not "raw"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Login failed",
        });
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      await checkAuth();
      navigate("/");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong",
      });
    }
  }

  return (
    <div className="p-5 min-h-screen flex flex-col items-center justify-center">
      <Form handleSubmit={handleSubmit} title="Најави се">
        <Input
          type="email"
          name="email"
          placeholder="Е-Пошта"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Лозинка"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button buttonType="form" text="Продолжи" />
        {message.text && <Message type={message.type} text={message.text} />}

        <LinkUnderline link="/register" text="Регистрирај се" />
      </Form>
    </div>
  );
}
