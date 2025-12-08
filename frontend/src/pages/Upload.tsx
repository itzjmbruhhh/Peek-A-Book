import React, { useState } from "react";
import "../styles/pages/Upload-Results.css";
import ImageUpload from "../components/ImageUpload";

type UploadProps = {
  onClose: () => void;
  onProceed: () => void;
  answers: any;
  setRecommendedBooks: (books: any[]) => void;
};

function Upload({
  onClose,
  onProceed,
  answers,
  setRecommendedBooks,
}: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (selected: File) => setFile(selected);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("preferences", JSON.stringify(answers));

    try {
      const res = await fetch("http://localhost:8000/api/upload-shelf/", {
        method: "POST",
        headers: {
          "X-DEVICE-ID": localStorage.getItem("deviceId") || "",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data.error || data);
        setLoading(false);
        return;
      }

      console.log("Detected books:", data.books);
      setRecommendedBooks(data.books || []);
      setLoading(false);
      onProceed();
    } catch (err) {
      console.error("Network or parsing error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="container relative">
      {loading && (
        <div className="overlay z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white">Uploading and Generating Recommendations...</p>
          </div>
        </div>
      )}
      <button onClick={onClose}>
        <i className="las la-times absolute top-3 right-3 text-3xl cursor-pointer"></i>
      </button>

      <ImageUpload onFileSelect={handleFileChange} />

      <div className="flex gap-5 w-full md:w-[90%] md:mb-2 xl:w-[91%] xl:mb-2">
        <button className="button cancel" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className={`button proceed ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Proceed"}
        </button>
      </div>
    </div>
  );
}

export default Upload;
