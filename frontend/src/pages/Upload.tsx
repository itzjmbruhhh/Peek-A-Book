import React from "react";
import "../styles/pages/Upload-Results.css";
import Dropdown from "../components/Dropdown";
import ImageUpload from "../components/ImageUpload";

type OverlayProps = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResultsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Upload({ uploadOpen, setUploadOpen, setResultsOpen }: OverlayProps) {
  if (!uploadOpen) return null;

  return (
    <div className="overlay">
      {/* Move this container as <Upload /> */}
      {/* Container Start */}
      <div className="container">
        <button onClick={() => setUploadOpen(false)}>
          <i className="las la-times absolute top-3 right-3 text-3xl"></i>
        </button>

        {/* Image Group */}
        <ImageUpload />

        {/* Preset Group */}
        <div className="md:w-full md:px-4 xl:w-full xl:px-4">
          <h2 className="text-md font-semibold">Select Preset</h2>
          <Dropdown />
        </div>

        {/* Button Group */}
        <div className="flex gap-5 mt-15 w-full md:w-[90%] md:mb-2 xl:w-[91%] xl:mb-2">
          <button
            className="button cancel"
            onClick={() => setUploadOpen(false)}
          >
            Cancel
          </button>
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
    </div>
  );
}

export default Upload;
