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
const apiUrl = import.meta.env.VITE_API_URL;

export default function AddGroupModal({ isOpen, onClose, url }) {
  const token = localStorage.getItem("token");

  // Step state
  const [step, setStep] = useState(1); // 1 = info, 2 = upload images

  // Step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState({});

  // Step 2
  const [groupName, setGroupName] = useState(null);
  const [image, setImage] = useState(null);
  const [cover, setCover] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Create group
  const {
    exec: createGroup,
    loading: creating,
    error: createError,
  } = usePostRequest(url, token);

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

    const groupData = { name, description };
    const response = await createGroup(groupData);

    if (response?.group?.name) {
      setGroupName(response.group.name);
      setStep(2); // move to image upload
    }
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
    setName("");
    setDescription("");
    setErrorMessage({});
    setGroupName(null);
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
        base: "fixed inset-0 bg-transparent z-50 flex justify-center items-start overflow-y-auto transition-colors duration-300 px-6",
        afterOpen: "!bg-foreground/50",
      }}
      className="relative w-full max-w-lg mx-auto my-20 bg-background rounded-xl border border-stroke shadow-2xl outline-none z-50"
    >
      {step === 1 && (
        <form
          onSubmit={handleSubmitInfo}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Креирај група</h2>
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
            text={creating ? "Креирање..." : "Креирај група"}
            disabled={creating}
          />

          {createError && <Message type="error" text={createError} />}
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmitImages}
          className="flex flex-col gap-5 p-6 sm:p-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2>Add images(optional)</h2>
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
