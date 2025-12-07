import { useEffect, useState } from "react";
import "../styles/pages/Upload-Results.css";
import Dropdown from "../components/Dropdown";

import ImageUpload from "../components/ImageUpload";
import Results from "./Results";

type OverlayProps = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


function Upload({ uploadOpen, setUploadOpen }: OverlayProps) {
  // Show results overlay useState
  const [resultsOpen, setResultsOpen] = useState(false);

  if (!uploadOpen && !resultsOpen) return null;

  const original = document.body.style.overflow;

  // Show upload overlay logic
  useEffect(() => {
    if (uploadOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }

    return () => {
      document.body.style.overflow = original;
    };
  }, [uploadOpen]);



  return (
    <div className="overlay">
      {/* Container Start */}
      <div className="container">
        <button onClick={() => setUploadOpen(false)}>
          <i className="las la-times absolute top-3 right-3 text-3xl"></i>
        </button>

        {/* Image Group */}
        <ImageUpload></ImageUpload>

        {/* Preset Group */}
        <div className="md:w-full md:px-4 xl:w-full xl:px-4">
          <h2 className="text-md font-semibold">Select Preset</h2>
          <Dropdown />
        </div>

        {/* Button Group */}
        <div className="flex gap-5 mt-15 w-full md:w-[90%] md:mb-2 xl:w-[91%] xl:mb-2">
          <button className="button cancel">Cancel</button>
          <button
            onClick={() => {
              setUploadOpen(false);
              setResultsOpen(true);
            }}
            className="button proceed"
          >
            Proceed
          </button>
        </div>
      </div>
      {/* Container End */}

      {/* Reults container */}
      {resultsOpen && (
        <Results
          resultsOpen={resultsOpen}
          setResultsOpen={setResultsOpen}
        ></Results>
      )}
    </div>
  );
}

export default Upload;
