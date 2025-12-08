/**
 * Component: ImageUpload
 * Purpose: Provides an image selection UI with click-to-select,
 * drag-and-drop support, preview and removal. Returns a local
 * preview via `URL.createObjectURL` for quick client-side preview.
 * Used inside the upload modal.
 */
import { useState, useRef } from "react";

function ImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // handle drag-and-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => setImage(null);

  return (
    <div className="image-group rounded-md p-4 w-full max-w-sm">
      <h1 className="text-xl font-semibold my-2 md:text-2xl xl:text-2xl">
        Upload your photo
      </h1>

      <div
        className={`w-full border-3 border-dashed rounded-md flex items-center justify-center cursor-pointer overflow-hidden ${
          image ? "h-auto" : "h-60 p-6 text-center text-2xl"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-400">Click or drag an image here</p>
        )}
      </div>

      {image && (
        <div className="image-group-labels flex justify-between items-center mt-2 text-sm">
          <span>{image.name}</span>
          <button
            type="button"
            onClick={removeImage}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <i className="las la-trash"></i>
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageUpload;
