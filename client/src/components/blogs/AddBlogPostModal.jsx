"use client";

import { useState } from "react";
import Modal from "react-modal";
import Input from "../ui/Input";
import RichTextEditor from "../ui/LexEditor";
import { usePostRequest } from "../../hooks/usePostRequest";
import Message from "../ui/Message";
import Button from "../ui/Button";
import { X } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

Modal.setAppElement("#root");

export default function AddBlogPostModal({ isOpen, onClose }) {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState({});

  const {
    exec: createPost,
    loading,
    success,
    error,
  } = usePostRequest(`${apiUrl}/posts`, token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage({});

    // Frontend validation
    if (!title.trim()) {
      setErrorMessage({ type: "title", text: "Please enter a title" });
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setErrorMessage({ type: "content", text: "Please enter content" });
      return;
    }

    // Submit post
    const post = await createPost({ title, description: content });
    if (post) {
      // Clear state
      setTitle("");
      setContent("");
      setErrorMessage({});

      // Wait 2s then reload page
      setTimeout(() => {
        // Close modal
        onClose();
        window.location.reload();
      }, 2000);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage({}); // Clear error when typing
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName={{
        base: "fixed inset-0 bg-transparent z-50 flex justify-center items-start overflow-y-auto transition-colors duration-300 px-6",
        afterOpen: "!bg-foreground/50",
      }}
      className="relative w-full max-w-lg mx-auto my-20 bg-background rounded-xl border border-stroke shadow-2xl outline-none z-50"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 sm:p-10">
        <div className="flex justify-between items-center mb-4">
          <h2>Креирај објава</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-foreground-light hover:text-foreground text-xl font-bold transition-colors duration-200 ease-in-out"
          >
            <X />
          </button>
        </div>

        {/* Title */}
        <div>
          <Input
            id="blog-title-input"
            type="text"
            value={title}
            placeholder="Наслов на објавата..."
            className="input input--secondary outline-0"
            required={false}
            onChange={handleInputChange(setTitle)}
          />
          {errorMessage.type === "title" && (
            <Message simple={true} type="error" text={errorMessage.text} />
          )}
        </div>

        {/* Content */}
        <div>
          <RichTextEditor setContent={setContent} />
          {errorMessage.type === "content" && (
            <Message simple={true} type="error" text={errorMessage.text} />
          )}
        </div>

        {!success && (
          <Button
            buttonType="form"
            text={loading ? "Објавува..." : "Објави"}
            disabled={loading}
          />
        )}

        {success && <Message text="Post submitted successfully!" />}
        {error && <Message type="error" text={error} />}
      </form>
    </Modal>
  );
}
