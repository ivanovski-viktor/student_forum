import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const API = import.meta.env.VITE_API_URL;

export default function UploadProfileImage() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger file input
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await fetch(`${API}/users/me/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      location.reload();
    } catch (error) {
      alert("Error uploading image:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className="text-xs absolute top-2 right-2 text-white transition-opacity duration-200 ease-in-out hover:opacity-60 cursor-pointer bg-orange-500 w-6 h-6 rounded-full"
      >
        <FontAwesomeIcon icon={faPen} />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
