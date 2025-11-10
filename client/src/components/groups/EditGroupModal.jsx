"use client";

import { useState } from "react";
import Modal from "react-modal";
import Input from "../ui/Input";
import Message from "../ui/Message";
import Button from "../ui/Button";
import { X } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import ImageUploader from "../ui/ImageUploader";

Modal.setAppElement("#root");
const apiUrl = import.meta.env.VITE_API_URL;

export default function EditGroupModal({ isOpen, onClose, url, groupData }) {
  const token = localStorage.getItem("token");

  // Step state
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState(groupData?.name || "");
  const [description, setDescription] = useState(groupData?.description || "");
  const [errorMessage, setErrorMessage] = useState({});

  // Step 2
  const [groupName, setGroupName] = useState(groupData?.name || null);
  const [image, setImage] = useState(null);
  const [cover, setCover] = useState(null);
  const [uploading, setUploading] = useState(false);

  // PUT request (edit group)
  const {
    data: editResponse,
    loading: editing,
    error: editError,
    refetch: updateGroup,
  } = useFetch(
    null,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({}),
    },
    false
  );

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage({});
  };

  const handleSubmitInfo = async (e) => {
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

    // build updated data
    const updatedData = { name, description };

    // run PUT
    await updateGroup(
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedData),
      })
    );

    // manually update state for next step
    setGroupName(name);
    setStep(2);
  };

  const handleSubmitImages = async (e) => {
    e.preventDefault();
    if (!groupName) return;

    setUploading(true);
    try {
      if (image) {
        const formData = new FormData();
        formData.append("group_image", image);
        const res = await fetch(`${apiUrl}/groups/${groupName}/group-image`, {
          method: "POST",
          headers: { Authorization: token },
          body: formData,
        });
        if (!res.ok) console.error("Image upload failed", res.statusText);
      }

      if (cover) {
        const formData = new FormData();
        formData.append("group_cover", cover);
        const res = await fetch(`${apiUrl}/groups/${groupName}/group-cover`, {
          method: "POST",
          headers: { Authorization: token },
          body: formData,
        });
        if (!res.ok) console.error("Cover upload failed", res.statusText);
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
      handleClose(true);
    }
  };

  const handleClose = (refresh = false) => {
    setStep(1);
    setName(groupData?.name || "");
    setDescription(groupData?.description || "");
    setErrorMessage({});
    setGroupName(groupData?.name || null);
    setImage(null);
    setCover(null);
    setUploading(false);
    onClose();
    if (refresh) window.location.reload();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => handleClose()}
      shouldCloseOnOverlayClick={true}
      overlayClassName={{
        base: "fixed inset-0 bg-transparent z-[99] flex justify-center items-start overflow-y-auto transition-colors duration-300 px-6",
        afterOpen: "!bg-background/80",
      }}
      className="relative w-full max-w-lg mx-auto my-20 bg-background rounded-xl border border-stroke shadow-2xl outline-none z-50"
    >
      {step === 1 && (
        <form
          onSubmit={handleSubmitInfo}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Уреди група</h2>
            <button
              type="button"
              onClick={() => handleClose()}
              className="text-foreground-light hover:text-foreground text-xl font-bold transition-colors duration-200 ease-in-out"
            >
              <X />
            </button>
          </div>

          <Input
            id="group-name"
            type="text"
            value={name}
            placeholder="Име на групата..."
            className="input input--secondary outline-0"
            onChange={handleInputChange(setName)}
          />
          {errorMessage.type === "name" && (
            <Message simple type="error" text={errorMessage.text} />
          )}

          <textarea
            id="group-description"
            value={description}
            onChange={handleInputChange(setDescription)}
            placeholder="Опис на групата..."
            className="input input--secondary outline-0 min-h-32"
          />
          {errorMessage.type === "description" && (
            <Message simple type="error" text={errorMessage.text} />
          )}

          <Button
            buttonType="form"
            text={editing ? "Се уредува..." : "Зачувај промени"}
            disabled={editing}
          />

          {editError && <Message type="error" text={editError} />}
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmitImages}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Промени слики (опционално)</h2>
            <button
              type="button"
              onClick={() => handleClose(true)}
              className="text-foreground-light hover:text-foreground text-xl font-bold transition-colors duration-200 ease-in-out"
            >
              <X />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <ImageUploader file={image} setFile={setImage} />
            <ImageUploader file={cover} setFile={setCover} />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              buttonType="form"
              text={uploading ? "Се прикачува..." : "Заврши"}
              disabled={uploading}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
