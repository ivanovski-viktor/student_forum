import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MAX_SIZE_MB = 1;

export default function ImageUploader({ file, setFile }) {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      // Alert for rejected files
      fileRejections.forEach((rejection) =>
        rejection.errors.forEach((e) => {
          if (e.code === "file-too-large") {
            alert(
              `${rejection.file.name} is too large (max ${MAX_SIZE_MB} MB)`
            );
          }
          if (e.code === "file-invalid-type") {
            alert(`${rejection.file.name} is an invalid file type`);
          }
        })
      );

      // Only take the first file (single image)
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: false, // single file
  });

  const handleRemove = () => setFile(null);

  return (
    <div className="file-uploader">
      <div
        {...getRootProps()}
        className="p-5 border-stroke border-2 border-dashed rounded-md cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop an image here...</p>
        ) : (
          <p>Drag & drop an image, or click to select</p>
        )}
      </div>

      {file && (
        <div className="mt-1">
          <strong className="text-xs">Selected image:</strong>
          <div className="border border-stroke p-1 rounded-md flex flex-col items-center mt-1">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="block w-full max-h-16 object-contain"
            />
            <span className="text-[10px] truncate w-full mt-1">
              {file.name}
            </span>
            <button
              type="button"
              className="cursor-pointer text-xs text-error border border-stroke rounded-sm py-0.5 w-full mt-1 hover:border-error transition-colors duration-200 ease-in-out"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
