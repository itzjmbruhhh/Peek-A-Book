import "../styles/pages/Upload-Results.css";

type ResultsProps = {
  onClose: () => void;
};

export const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 6,
    title: "Moby-Dick",
    author: "Herman Melville",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 7,
    title: "War and Peace",
    author: "Leo Tolstoy",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
  {
    id: 8,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    image: "https://cdn2.penguin.com.au/covers/original/9781785150357.jpg",
  },
];


function Results({ onClose }: ResultsProps) {
  return (
    <div className="container relative p-5! xl:p-10! md:-10! min-w-[350px] max-w-[350px] md:min-w-[fit] md:max-w-[45%] xl:min-w-[fit] xl:max-w-[45%]">

  {/* Close button */}
  <button onClick={onClose} className="absolute top-3 right-3">
    <i className="las la-times text-3xl cursor-pointer"></i>
  </button>

  {/* Title aligned top-left */}
  <h1 className="text-md font-semibold mb-2 md:text-2xl xl:text-2xl">
    Top picks from your photo
  </h1>

  {/* Book Cards */}
  <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory">
  {books.map((book) => (
    <div
      key={book.id}
      className="book-card flex-none w-1/2 sm:w-1/2 md:w-1/4 xl:w-1/4 snap-start"
    >
      <img src={book.image} alt={book.title} className="book-image" />
      <div className="book-text">
        <h3 className="book-title">{book.title}</h3>
        <p className="author">{book.author}</p>
      </div>
    </div>
  ))}
</div>

</div>

  );
}

export default Results;
