"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface FileDropZoneProps {
  onFileUpload: (file: File) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileUpload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragEnter = () => setIsHovered(true);
  const handleDragLeave = () => setIsHovered(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    onFileUpload(file);
    setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
  };

  const handleEditClick = () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  return (
    <div
      className={`w-full h-3/4 max-w-lg mx-auto p-6 border-2 ${
        isHovered ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
      } border-dashed rounded-lg text-center transition-all duration-300 dark:bg-meta-4`}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={previewUrl}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={handleEditClick}
              className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
              title="Edit"
            >
              <Icon icon="mdi:pencil" width="20" />
            </button>
          </div>
          <p
            onClick={() => window.open(previewUrl, "_blank")}
            className="mt-2 text-blue-500 cursor-pointer underline"
          >
            View Image
          </p>
        </div>
      ) : (
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="text-blue-500 text-3xl mb-2">↑</div>
            <p className="text-gray-500">Drop files here to upload</p>
          </div>
        </label>
      )}
    </div>
  );
};

export default FileDropZone;
