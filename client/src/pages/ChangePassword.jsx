import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";
import LinkUnderline from "../components/ui/LinkUnderline";
import logout from "../helper-functions/logout";
import Message from "../components/ui/Message";
import { usePageLoading } from "../context/PageLoadingContext";
import { usePatchRequest } from "../hooks/usePatchRequest";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ChangePassword() {
  const { pageLoading, setPageLoading } = usePageLoading();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const { exec, loading, error, success } = usePatchRequest(
    `${apiUrl}/users/me/change-password`,
    token
  );

  useEffect(() => {
    if (pageLoading) setPageLoading(false);
  }, [pageLoading, setPageLoading]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    const result = await exec(formData);

    if (result) {
      // success
      setMessage({
        type: "success",
        text: "Лозинката е успешно променета. Пренасочување...",
      });
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1500);
    } else {
      // Use the API message if available
      if (error) {
        setMessage({ type: "error", text: error });
      } else {
        setMessage({ type: "error", text: "Неуспешна промена на лозинка." });
      }
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
