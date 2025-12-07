import React from "react";
import "../styles/pages/Upload-Results.css";
import Dropdown from "../components/Dropdown";
import ImageUpload from "../components/ImageUpload";

type UploadProps = {
  onClose: () => void;
  onProceed: () => void;
};

function Upload({ onClose, onProceed }: UploadProps) {
  return (
    <div className="container">
      <button onClick={onClose}>
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
        <button className="button cancel" onClick={onClose}>
          Cancel
        </button>

        <button className="button proceed" onClick={onProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
}

export default Upload;
