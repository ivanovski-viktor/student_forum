import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";
import LinkUnderline from "../components/ui/LinkUnderline";
import Message from "../components/ui/Message";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
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
        setMessage({
          type: "error",
          text: errorData.message || response.statusText,
        });
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || response.statusText,
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

        <Button buttonType="form" text="Продолжи" />
        {message.text && <Message type={message.type} text={message.text} />}

        <LinkUnderline link="/register" text="Регистрирај се" />
      </Form>
    </div>
  );
}
