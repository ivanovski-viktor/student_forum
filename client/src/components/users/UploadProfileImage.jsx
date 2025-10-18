import { useRef } from "react";
import { RiPencilFill } from "react-icons/ri";

const apiUrl = import.meta.env.VITE_API_URL;

export default function UploadProfileImage({
  setIsUploading,
  setCurrentImageUrl,
}) {
  //   console.log("setIsUploading:", setIsUploading);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profile_picture", file);

    setIsUploading?.(true);

    try {
      const response = await fetch(`${apiUrl}/users/me/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      // Set new image url
      const data = await response.json();
      if (data.profile_image_url) {
        setCurrentImageUrl(data.profile_image_url);
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setIsUploading?.(false); // Stop loader
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className="text-base absolute top-2 right-2 text-white transition-opacity duration-200 ease-in-out hover:opacity-60 cursor-pointer bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center"
      >
        <RiPencilFill />
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
