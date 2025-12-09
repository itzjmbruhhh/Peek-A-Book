import "../styles/pages/Upload-Results.css";
import { useMemo, useState } from "react";

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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
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

      <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory px-4 py-5">
        {uniqueBooks.length > 0 ? (
          // If a book is expanded, show a centered modal-like view with image and reason
          expandedIdx !== null && uniqueBooks[expandedIdx] ? (
            <div className="w-full flex items-center justify-center">
              <div className="expanded-card bg-(--color-secondary) rounded-md p-6 shadow-lg max-w-3xl w-full flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0">
                  <img
                    src={uniqueBooks[expandedIdx].image}
                    alt={uniqueBooks[expandedIdx].title}
                    className="w-[180px] h-[260px] object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-semibold mb-1">
                    {uniqueBooks[expandedIdx].title}
                  </h2>
                  <p className="text-sm text-(--color-text-secondary) mb-4">
                    {uniqueBooks[expandedIdx].author}
                  </p>
                  <div className="reason text-sm text-(--color-text-primary)">
                    <strong>Why this fits:</strong>
                    <p className="mt-2">
                      {uniqueBooks[expandedIdx].reason_it_fits ||
                        uniqueBooks[expandedIdx].reason ||
                        uniqueBooks[expandedIdx].description}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => setExpandedIdx(null)}
                    className="ml-2 px-3 py-1 rounded-md bg-(--color-primary) text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            uniqueBooks.map((book, idx) => (
              <div
                key={idx}
                className="book-card flex-none w-[150px] h-auto flex flex-col snap-start rounded-md"
              >
                <button
                  onClick={() => setExpandedIdx(idx)}
                  className="p-0 m-0 border-0 bg-transparent cursor-pointer"
                  title={book.title}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-[180px] object-cover rounded-md"
                  />
                </button>

                <div className="book-text">
                  <h3 className="book-title line-clamp-1">{book.title}</h3>
                  <p className="author line-clamp-1">{book.author}</p>
                </div>
              </div>
            ))
          )
        ) : (
          <p>No books detected.</p>
        )}
      </div>
    </div>
  );
}

export default Results;
