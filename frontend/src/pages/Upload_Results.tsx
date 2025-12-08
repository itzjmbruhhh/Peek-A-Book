/**
 * Page/Component: Upload_Results
 * Purpose: Overlay orchestrator that manages the upload -> results
 * flow. Locks background scroll while open and mounts either the
 * `Upload` component or the `Results` component based on internal state.
 */
import "../styles/pages/Upload-Results.css";
import Results from "./Results";
import Upload from "./Upload";
import { useEffect, useState, useRef } from "react";

type Props = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Upload_Results({ uploadOpen, setUploadOpen }: Props) {
  // "upload", "results", or null
  const [currentModal, setCurrentModal] = useState<"upload" | "results" | null>(
    "upload"
  );

  // capture the original body overflow once on mount
  const original = useRef(document.body.style.overflow);

  // lock scroll when any modal is open
  useEffect(() => {
    if (currentModal !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original.current;
    }

    return () => {
      document.body.style.overflow = original.current;
    };
  }, [currentModal]);

  // When the internal modal state is set to null, notify the parent
  // so the parent can unmount this component (and clear its uploadOpen flag).
  useEffect(() => {
    if (currentModal === null) {
      setUploadOpen(false);
    }
  }, [currentModal, setUploadOpen]);

  if (!uploadOpen) return null;

  return (
    <div className="overlay">
      {/* Upload modal */}
      {currentModal === "upload" && (
        <Upload
          onClose={() => setCurrentModal(null)}
          onProceed={() => setCurrentModal("results")}
        />
      )}

      {/* Results modal */}
      {currentModal === "results" && (
        <Results onClose={() => setCurrentModal(null)} />
      )}
    </div>
  );
}

export default Upload_Results;
