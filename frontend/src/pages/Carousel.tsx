import { useRef } from "react";

function CardCarousel({ cards }: { cards: { title: string; author: string; image: string }[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
      >
        &lt;
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
      >
        &gt;
      </button>

      {/* Cards Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide p-2"
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="shrink-0 w-60 border rounded-lg shadow p-4"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardCarousel;
