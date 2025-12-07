import "../styles/pages/Upload-Results.css";
import Results from "./Results";
import Upload from "./Upload";
import { useEffect, useState } from "react";

type OverlayProps = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Upload_Results({ uploadOpen, setUploadOpen }: OverlayProps) {
  // Show results overlay useState
  const [resultsOpen, setResultsOpen] = useState(false);

  if (!uploadOpen && !resultsOpen) return null;

  const original = document.body.style.overflow;

  // Show upload/results overlay logic — hide body scroll when either modal is open
  useEffect(() => {
    if (uploadOpen || resultsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }

    return () => {
      document.body.style.overflow = original;
    };
  }, [uploadOpen, resultsOpen]);

  return (
    <div className="overlay">
      {/* Upload container */}
      {uploadOpen && (
        <Upload
          uploadOpen={uploadOpen}
          setUploadOpen={setUploadOpen}
          setResultsOpen={setResultsOpen}
        />
      )}

      {/* Results container */}
      {resultsOpen && (
        <Results resultsOpen={resultsOpen} setResultsOpen={setResultsOpen} />
      )}
    </div>
  );
}

export default Upload_Results;
