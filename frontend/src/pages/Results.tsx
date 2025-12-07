import "../styles/pages/Upload-Results.css";

type OverlayProps = {
  resultsOpen: boolean;
  setResultsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Results({ resultsOpen, setResultsOpen }: OverlayProps) {
  if (!resultsOpen) return null;

  return <div>HI</div>;
}

export default Results;
