import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthUserContext";

import Input from "../components/ui/Input";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";
import LinkUnderline from "../components/ui/LinkUnderline";
import Message from "../components/ui/Message";
import { usePageLoading } from "../context/PageLoadingContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const { pageLoading, setPageLoading } = usePageLoading();
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthUser();

  useEffect(() => {
    if (pageLoading) {
      setPageLoading(false);
    }
  }, [pageLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/users/me", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

      // Wait for auth context to update first
      await checkAuth();

      // Stop loader immediately
      setPageLoading(false);

      // Then navigate
      navigate("/users/me", { replace: true });
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
