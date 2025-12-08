import "../styles/pages/Upload-Results.css";
import { useMemo } from "react";

type ResultsProps = {
  onClose: () => void;
  books: any[]; // pass books as prop
};

function Results({ onClose, books }: ResultsProps) {
  const uniqueBooks = useMemo(() => {
    const seen = new Set<string>();
    return (books || []).filter((book) => {
      const title = (book?.title || "").toString().trim().toLowerCase();
      if (seen.has(title)) return false;
      seen.add(title);
      return true;
    });
  }, [books]);
  return (
    <div className="container relative p-5 xl:p-10 min-w-[350px] max-w-[350px] md:min-w-[fit] md:max-w-[45%] xl:min-w-[fit] xl:max-w-[45%]">
      <button onClick={onClose} className="absolute top-3 right-3">
        <i className="las la-times text-3xl cursor-pointer"></i>
      </button>
      <h1 className="text-md font-semibold mb-2 md:text-2xl xl:text-2xl">
        Top picks from your photo
      </h1>

      <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory justify-center px-15 py-5">
        {uniqueBooks.length > 0 ? (
          uniqueBooks.map((book, idx) => (
            <div
              key={idx}
              className="book-card flex-none w-1/2! max-h-[300px]! sm:w-1/2 md:w-1/4 xl:w-1/4 snap-start"
            >
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-text">
                <h3 className="book-title">{book.title}</h3>
                <p className="author">{book.author}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No books detected.</p>
        )}
      </div>
    </div>
  );
}

export default Results;
