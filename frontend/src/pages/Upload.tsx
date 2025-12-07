import { useEffect } from "react";
import "../styles/pages/Upload.css";
import Dropdown from "../components/Dropdown";

import ImageUpload from "../components/ImageUpload";

type OverlayProps = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Upload({ uploadOpen, setUploadOpen }: OverlayProps) {
  if (!uploadOpen) return null;

  const original = document.body.style.overflow;

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
          <button className="button proceed">Proceed</button>
        </div>
      </div>
      {/* Container End */}
    </div>
  );
}

export default Upload;
