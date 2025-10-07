import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";
import LinkUnderline from "../components/ui/LinkUnderline";
import logout from "../helper-functions/logout";
import Message from "../components/ui/Message";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ type: "error", text: "Не сте најавени." });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/me/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      console.log("Raw response:", response);

      const data = await response.json();
      console.log("Parsed response data:", data);

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Неуспешна промена на лозинка.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Лозинката е успешно променета. Пренасочување...",
      });

      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage({
        type: "error",
        text: "Настана грешка. Обидете се повторно.",
      });
    }
  }

  return (
    <div className="p-5 min-h-screen flex flex-col items-center justify-center">
      <Form handleSubmit={handleSubmit} title="Промени лозинка">
        <Input
          type="password"
          name="password"
          placeholder="Лозинка"
          value={formData.password}
          onChange={handleChange}
          required={true}
        />
        <Input
          type="password"
          name="new_password"
          placeholder="Нова лозинка"
          value={formData.new_password}
          onChange={handleChange}
          required={true}
        />
        <Input
          type="password"
          name="confirm_password"
          placeholder="Потврди ја лозинката"
          value={formData.confirm_password}
          onChange={handleChange}
          required={true}
        />
        {message.text && <Message type={message.type} text={message.text} />}

        <Button buttonType="form" text="Промени" />

        <LinkUnderline link="/users/me" text="Назад" />
      </Form>
    </div>
  );
}
