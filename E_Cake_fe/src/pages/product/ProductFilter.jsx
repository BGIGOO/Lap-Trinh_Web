import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { useState } from "react";

const ITEMS = Array.from({ length: 20 }).map((_, idx) => ({
  id: idx + 1,
  name: `Filter ${idx + 1}`,
}));

const PAGE_SIZE = 6;

export default function ProductFilter() {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - PAGE_SIZE, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + PAGE_SIZE, ITEMS.length - PAGE_SIZE)
    );
  };

  const visibleItems = ITEMS.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      {/* Nút trái */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
          startIndex === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#FF5A3E] text-white hover:bg-yellow-500"
        }`}
      >
        <FaChevronLeft size={14} />
      </button>

      {/* Các ô item */}
      <div className="flex gap-5">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="w-16 h-16 flex-shrink-0 rounded-md bg-white
                       flex items-center justify-center font-semibold
                       shadow-sm hover:shadow-md transition"
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Nút phải */}
      <button
        onClick={handleNext}
        disabled={startIndex + PAGE_SIZE >= ITEMS.length}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
          startIndex + PAGE_SIZE >= ITEMS.length
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#FF5A3E] text-white hover:bg-yellow-500"
        }`}
      >
        <FaChevronRight size={14} />
      </button>

      {/* Icon search */}
      <button
        className="ml-2 w-10 h-10 flex items-center justify-center 
                   rounded-full bg-green-400 text-white 
                   hover:bg-green-500 transition"
      >
        <FaSearch size={14} />
      </button>
    </div>
  );
}
