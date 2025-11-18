"use client";
import { useCallback, useRef } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import Image from "next/image";

interface ImageUploadBoxProps {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageUploadBox = ({ photos, setPhotos }: ImageUploadBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setPhotos((prev) => [...prev, ...files]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="
          border-2 border-dashed border-gray-400 rounded-lg p-6 
          flex flex-col items-center justify-center cursor-pointer
          hover:border-yaleBlue transition bg-gray-50
        "
      >
        <FaCloudUploadAlt size={36} className="text-yaleBlue mb-2" />
        <p className="text-gray-600 font-medium">Click or drag images here</p>
        <p className="text-xs text-gray-400">PNG, JPG, or JPEG · up to 10MB</p>

        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {photos.map((file, index) => {
            const previewURL = URL.createObjectURL(file);
            return (
              <div key={index} className="relative">
                <Image
                  src={previewURL}
                  alt="preview"
                  width={150}
                  height={150}
                  className="rounded-lg object-cover h-24 w-full shadow-md"
                />
                <FaTimes
                  size={18}
                  className="
                    absolute top-2 right-2 bg-black/60 text-white 
                    rounded-full p-1 cursor-pointer hover:bg-red-600
                    transition
                  "
                  onClick={() => removeImage(index)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploadBox;
