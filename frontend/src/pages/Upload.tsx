import React, { useState } from "react";
import "../styles/pages/Upload-Results.css";
import ImageUpload from "../components/ImageUpload";
import { useEffect } from "react";

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
  const [retryUntil, setRetryUntil] = useState<number | null>(null);
  const [retrySecondsLeft, setRetrySecondsLeft] = useState<number | null>(null);

  // Quota configuration (mirror backend throttle: "5/minute")
  const QUOTA_RATE = "5/minute";
  const parseRate = (rate: string) => {
    const [countStr, period] = rate.split("/");
    const count = Number(countStr);
    let seconds = 60;
    if (period === "hour") seconds = 3600;
    if (period === "day") seconds = 86400;
    return { count, windowSeconds: seconds };
  };
  const { count: quotaCount, windowSeconds } = parseRate(QUOTA_RATE);
  const perTokenRecharge = Math.round(windowSeconds / quotaCount);

  useEffect(() => {
    let t: number | undefined;
    if (retryUntil) {
      const update = () => {
        const left = Math.max(0, Math.ceil((retryUntil - Date.now()) / 1000));
        setRetrySecondsLeft(left);
        if (left <= 0) {
          setRetryUntil(null);
          setRetrySecondsLeft(null);
          if (t) window.clearInterval(t);
        }
      };
      update();
      t = window.setInterval(update, 1000);
    }
    return () => {
      if (t) window.clearInterval(t);
    };
  }, [retryUntil]);

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

      // If server signals rate limit, capture Retry-After header (seconds)
      if (res.status === 429) {
        const retry = res.headers.get("Retry-After");
        const retrySec = retry ? Number(retry) : windowSeconds;
        setRetryUntil(Date.now() + retrySec * 1000);
        setLoading(false);
        const data = await res.json().catch(() => ({}));
        console.error("Upload failed (rate limit):", data.error || data);
        return;
      }

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
      {/* Show rate-limit notification only when server returns 429 */}
      {retryUntil && (
        <div className="rate-limit-notice mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-900">
          <strong>Rate limit exceeded:</strong>
          {retrySecondsLeft != null ? (
            <span>
              {" "}
              Try again in {retrySecondsLeft} second
              {retrySecondsLeft !== 1 ? "s" : ""}.
            </span>
          ) : (
            <span> Please try again later.</span>
          )}
          <button
            onClick={() => {
              setRetryUntil(null);
              setRetrySecondsLeft(null);
            }}
            className="ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      )}
      {loading && (
        <div className="overlay z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-center">
              Uploading and Generating Recommendations...
            </p>
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
            loading || retryUntil ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleUpload}
          disabled={loading || !!retryUntil}
        >
          {loading ? "Uploading..." : "Proceed"}
        </button>
      </div>
    </div>
  );
}

export default Upload;
