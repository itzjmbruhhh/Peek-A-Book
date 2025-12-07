import "../styles/pages/Upload-Results.css";

type ResultsProps = {
  onClose: () => void;
};

function Results({ onClose }: ResultsProps) {
  return (
    <div className="container p-5! xl:p-10! min-w-[350px] max-w-[350px]">
      <button onClick={onClose}>
        <i className="las la-times absolute top-3 right-3 text-3xl cursor-pointer"></i>
        <h1 className="text-md text-left font-semibold mt-10 mb-2 md:text-2xl xl:text-2xl">
          Top picks from your photo
        </h1>

        <div className="books-card-container flex flex-row justify-between gap-6 mb-5">
          {/* Book Card */}
          <div className="book-card">
            <img src="" alt="" className="book-image" />
            <div className="book-text text-left">
              <h3 className="book-title">To Kill a Mockingbird</h3>
              <p className="author">Author name</p>
            </div>
          </div>

          {/* Book Card */}
          <div className="book-card">
            <img src="" alt="" className="book-image" />
            <div className="book-text text-left">
              <h3 className="book-title">Book Title</h3>
              <p className="author">Author name</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default Results;
