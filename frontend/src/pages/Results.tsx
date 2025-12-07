import "../styles/pages/Upload-Results.css";

type ResultsProps = {
  onClose: () => void;
};

function Results({ onClose }: ResultsProps) {
  return (
    <div className="container">
      <button onClick={onClose}>
        <i className="las la-times absolute top-3 right-3 text-3xl"></i>
        HELLOOO
      </button>
    </div>
  );
}

export default Results;
