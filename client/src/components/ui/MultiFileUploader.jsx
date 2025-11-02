import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Video, Music } from "lucide-react"; // Lucide icons

const MAX_FILES = 3;
const MAX_SIZE_MB = 1;

export default function MultiFileUploader({ files, setFiles }) {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
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

      let newFiles = [...files, ...acceptedFiles];
      if (newFiles.length > MAX_FILES) {
        alert(`You can only upload up to ${MAX_FILES} files`);
        newFiles = newFiles.slice(0, MAX_FILES);
      }

      setFiles(newFiles);
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
    },
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: true,
  });

  const handleRemove = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const renderPreview = (file) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="block w-auto mx-auto max-w-full object-contain h-20"
        />
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <div className="flex items-center justify-center h-20 w-full bg-gray-100 rounded">
          <Video size={24} />
        </div>
      );
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div className="flex items-center justify-center h-20 w-full bg-gray-100 rounded">
          <Music size={24} />
        </div>
      );
    }

    return (
      <div className="h-20 w-full bg-gray-100 rounded flex items-center justify-center">
        FILE
      </div>
    );
  };

  return (
    <div className="file-uploader">
      <div
        {...getRootProps()}
        className="p-5 border-stroke border border-dashed rounded-md cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag & drop some files, or click to select</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-1">
          <strong className="text-xs">
            Selected files ({files.length}/{MAX_FILES}):
          </strong>
          <ul className="grid grid-cols-3 text-center pt-2 gap-2">
            {files.map((file, i) => (
              <li
                key={i}
                className="border border-stroke p-1 rounded-md flex flex-col"
              >
                {renderPreview(file)}
                <div className="flex flex-col items-center flex-1 justify-between mt-1">
                  <span className="text-[10px] truncate w-full">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    className="cursor-pointer text-xs text-error border border-stroke rounded-sm py-0.5 w-full mt-1 hover:border-error transition-colors duration-200 ease-in-out"
                    onClick={() => handleRemove(i)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
