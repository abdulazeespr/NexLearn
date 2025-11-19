import { useRef, useState } from "react";
import Image from "next/image";

export default function PhotoUploadBox() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="w-40 h-40 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
      onClick={() => fileInputRef.current?.click()}
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <>
          <div className="flex items-center justify-center w-10 h-10 mb-2">
            <Image src="/photo.svg" alt="Upload" width={40} height={40} />
          </div>
          <p className="text-gray-500 text-sm">Add Your Profile picture</p>
        </>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
