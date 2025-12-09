import "../styles/pages/Upload-Results.css";
import { useMemo } from "react";

type Book = {
  title?: string;
  author?: string;
  image?: string;
  description?: string;
  [key: string]: any;
};

type ResultsProps = {
  onClose: () => void;
  books: any; // raw backend output, might be string
};

function Results({ onClose, books }: ResultsProps) {
  // Parse JSON if books is a string
  let bookArray: Book[] = [];
  if (typeof books === "string") {
    try {
      bookArray = JSON.parse(books.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("Failed to parse books JSON:", e);
    }
  } else if (Array.isArray(books)) {
    bookArray = books;
  }

  const uniqueBooks = useMemo(() => {
    const seen = new Set<string>();
    return bookArray.filter((book) => {
      const title = (book?.title || "").toString().trim().toLowerCase();
      if (!title || seen.has(title)) return false;
      seen.add(title);
      return true;
    });
  }, [bookArray]);

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
              <img
                src={book.image || "https://placehold.co/97x150"}
                alt={book.title}
                className="book-image"
              />
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
