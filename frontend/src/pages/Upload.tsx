import { useEffect } from "react";
import "../styles/pages/Utils.css"
import Dropdown from "../components/Dropdown";

type OverlayProps = {
  uploadOpen: boolean;
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Upload({uploadOpen, setUploadOpen} : OverlayProps) {

    if(!uploadOpen) return null;

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
    <div className='overlay'>
        {/* Container */}
        <div className="container relative border bg-(--color-primary) p-5 flex flex-row">
            <button onClick={() => setUploadOpen(false)}>
                <i className="las la-times absolute top-3 right-3 text-3xl"></i>
            </button>

            {/* Image Group */}
            <div className="image-group">
                <h1 className="text-xl font-semibold my-2">Upload your photo</h1>
                <img src="" alt="image" className="w-full h-[253px] border"/>
                <div className="image-group-labels flex justify-between">
                    <label htmlFor="" className="">File.png</label>
                    <button><i className="las la-trash m-auto"></i></button>
                </div>
            </div>

            {/* Preset Group */}
            <div>
                <h2 className="text-md font-semibold">Select Preset</h2>
                <Dropdown />
            </div>

            {/* Button Group */}
            <div className="flex gap-5 mt-15">
                <button className="border w-[50%]">back</button>
                <button className="border w-[50%]">proceed</button>
            </div>
        </div>
    </div>
  )
}

export default Upload