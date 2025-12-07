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
      {/* Container */}
      <div className="container relative rounded-2xl bg-(--color-primary) p-4 flex flex-row h-fit">
        <button onClick={() => setUploadOpen(false)}>
          <i className="las la-times absolute top-3 right-3 text-3xl"></i>
        </button>

        {/* Image Group */}
        <ImageUpload></ImageUpload>
        {/* <div className="image-group">
                <h1 className="text-xl font-semibold my-2">Upload your photo</h1>
                <img src="" alt="image" className="w-full h-[253px] border"/>
                <div className="image-group-labels flex justify-between">
                    <label htmlFor="" className="">File.png</label>
                    <button><i className="las la-trash m-auto"></i></button>
                </div>
            </div> */}

        {/* Preset Group */}
        <div>
          <h2 className="text-md font-semibold">Select Preset</h2>
          <Dropdown />
        </div>

        {/* Button Group */}
        <div className="flex gap-5 mt-15">
          <button className="button cancel">Cancel</button>
          <button className="button proceed">Proceed</button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
