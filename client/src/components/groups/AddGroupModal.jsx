"use client";

import { useState } from "react";
import Modal from "react-modal";
import Input from "../ui/Input";
import Message from "../ui/Message";
import Button from "../ui/Button";
import { X } from "lucide-react";
import { usePostRequest } from "../../hooks/usePostRequest";
import ImageUploader from "../ui/ImageUploader";

Modal.setAppElement("#root");

export default function AddGroupModal({ isOpen, onClose, url }) {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [cover, setCover] = useState(null);

  const [errorMessage, setErrorMessage] = useState({});

  const {
    exec: createGroup,
    loading,
    success,
    error,
  } = usePostRequest(url, token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage({});

    if (!name.trim()) {
      setErrorMessage({ type: "name", text: "Please enter a group name" });
      return;
    }
    if (!description.trim()) {
      setErrorMessage({
        type: "description",
        text: "Please enter a description",
      });
      return;
    }

    const groupData = { name, description };

    const group = await createGroup(groupData); // 👈 send JSON, not FormData

    if (group) {
      setName("");
      setDescription("");

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    }
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 sm:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2>Креирај група</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-foreground-light hover:text-foreground text-xl font-bold transition-colors duration-200 ease-in-out"
          >
            <X />
          </button>
        </div>

        {/* Group Name */}
        <div>
          <Input
            id="group-name"
            type="text"
            value={name}
            placeholder="Име на групата..."
            className="input input--secondary outline-0"
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage({});
            }}
          />
          {errorMessage.type === "name" && (
            <Message simple type="error" text={errorMessage.text} />
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            id="group-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrorMessage({});
            }}
            placeholder="Опис на групата..."
            className="input input--secondary outline-0 min-h-32"
          />
          {errorMessage.type === "description" && (
            <Message simple type="error" text={errorMessage.text} />
          )}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <ImageUploader file={image} setFile={setImage} />
          <ImageUploader file={cover} setFile={setCover} />
        </div>

        {/* Buttons */}
        {!success && (
          <Button
            buttonType="form"
            text={loading ? "Креирање..." : "Креирај"}
            disabled={loading}
          />
        )}

        {success && <Message text="Групата е успешно креирана!" />}
        {error && <Message type="error" text={error} />}
      </form>
    </Modal>
  );
}
