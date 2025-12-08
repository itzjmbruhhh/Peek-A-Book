import "../styles/pages/Upload-Results.css";
import Results from "./Results";
import Upload from "./Upload";
import { useEffect, useState, useRef } from "react";

type Props = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  answers: any;
  setRecommendedBooks: (books: any[]) => void;
};

function Upload_Results({ uploadOpen, setUploadOpen, answers, setRecommendedBooks }: Props) {
  const [currentModal, setCurrentModal] = useState<"upload" | "results" | null>("upload");
  const original = useRef(document.body.style.overflow);

  useEffect(() => {
    if (currentModal !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = original.current;
    return () => { document.body.style.overflow = original.current; };
  }, [currentModal]);

  useEffect(() => {
    if (currentModal === null) setUploadOpen(false);
  }, [currentModal, setUploadOpen]);

  if (!uploadOpen) return null;

  return (
    <div className="overlay">
      {currentModal === "upload" && (
        <Upload
          onClose={() => setCurrentModal(null)}
          onProceed={() => setCurrentModal("results")}
          answers={answers}
          setRecommendedBooks={setRecommendedBooks}
        />
      )}
      {currentModal === "results" && (
        <Results onClose={() => setCurrentModal(null)} />
      )}
    </div>
  );
}

export default Upload_Results;
