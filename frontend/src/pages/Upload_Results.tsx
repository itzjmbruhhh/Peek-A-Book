import "../styles/pages/Upload-Results.css";
import Results from "./Results";
import Upload from "./Upload";
import { useEffect, useState } from "react";

type Props = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  answers: any;
  setRecommendedBooks: React.Dispatch<React.SetStateAction<any[]>>; // add this
};

function Upload_Results({ uploadOpen, setUploadOpen, answers, setRecommendedBooks }: Props) {
  const [currentModal, setCurrentModal] = useState<"upload" | "results" | null>("upload");
  const [recommendedBooks, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (currentModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = originalOverflow;
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [currentModal]);

  useEffect(() => {
    if (!currentModal) setUploadOpen(false);
  }, [currentModal, setUploadOpen]);

  // Whenever recommendedBooks updates locally, also update parent state
  useEffect(() => {
    setRecommendedBooks(recommendedBooks);
  }, [recommendedBooks, setRecommendedBooks]);

  if (!uploadOpen) return null;

  return (
    <div className="overlay">
      {currentModal === "upload" && (
        <Upload
          onClose={() => setCurrentModal(null)}
          onProceed={() => setCurrentModal("results")}
          answers={answers}
          setRecommendedBooks={setBooks} // pass setter here
        />
      )}

      {currentModal === "results" && (
        <Results
          onClose={() => setCurrentModal(null)}
          books={recommendedBooks} // pass local state
        />
      )}
    </div>
  );
}

export default Upload_Results;