import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import LinkUnderline from "../components/ui/LinkUnderline";
import Message from "../components/ui/Message";
import { useAuthUser } from "../context/AuthUserContext";
import { usePageLoading } from "../context/PageLoadingContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
  const { pageLoading, setPageLoading } = usePageLoading();
  useEffect(() => {
    if (pageLoading) {
      setPageLoading(false);
    }
  }, [pageLoading]);

  const { isAuthenticated } = useAuthUser();
  const navigate = useNavigate();
  // Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/users/me", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/register`, {
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
        setMessage({
          type: "error",
          text: errorData.message || response.statusText,
        });
        return;
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: "Registration successful! Welcome, " + formData.username,
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
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
        {message.text && <Message type={message.type} text={message.text} />}

        <LinkUnderline link="/login" text="Кон најава" />
      </Form>
    </div>
  );
}
