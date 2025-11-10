import { useState } from "react";
import UploadProfileImage from "./UploadProfileImage";
import userPlaceholder from "../../assets/user-placeholder.png";
import InlineLoader from "../layout/InlineLoader";

export default function ProfileImage({ image_url, uploadImage = false }) {
  const [currentImageUrl, setCurrentImageUrl] = useState(image_url);
  const [isUploading, setIsUploading] = useState(false);

  return uploadImage === true ? (
    <div className="relative">
      <UploadProfileImage
        setIsUploading={setIsUploading}
        setCurrentImageUrl={setCurrentImageUrl}
      />
      {isUploading ? (
        <div className="rounded-xl w-full flex items-center justify-center aspect-[1/1.25] bg-gray-100">
          <InlineLoader />
        </div>
      ) : (
        <img
          className={`rounded-xl w-full aspect-[1/1.25] object-cover bg-foreground/10 ${
            image_url ? "" : "pt-10"
          }`}
          src={currentImageUrl || userPlaceholder}
          alt="profile image"
          loading="eager"
        />
      )}
    </div>
  ) : (
    <div>
      <img
        className={`rounded-xl w-full aspect-[1/1.25] object-cover bg-foreground/10${
          image_url ? "" : "pt-10"
        }`}
        src={currentImageUrl || userPlaceholder}
        alt="profile image"
        loading="eager"
      />
    </div>
  );
}
