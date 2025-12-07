import { useState, useEffect } from "react"
import "../styles/pages/Upload-Results.css"
import { div } from "framer-motion/client";

type OverlayProps = {
  resultsOpen: boolean;
  setResultsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Results({ resultsOpen, setResultsOpen } : OverlayProps) {
  return (
    <div>HI</div>
  )
}

export default Results