import React, { useState } from "react";
import previcon from "../assets/Filltericons/previous.png";
import nexticon from "../assets/Filltericons/next.png";

const FilterBar = ({ handleFilterChange }) => {
  
  const filters = [
    "All", "Travel", "Pets", "Cinema", "Gaming", "Nature",
    "Wildlife", "Nightlife", "Sports Cars", "Luxury",
    "Cuisine", "Technology", "World History", "Landscapes", "Climate Change",
  ];
  

  const itemsPerPage = 8;
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < filters.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const visibleFilters = filters.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex items-center p-2 flex-wrap gap-2 sm:gap-4">
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`hidden sm:flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow ${
          startIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <img src={previcon} width={12} sm:width={16} alt="Previous" />
      </button>

      <div className="flex overflow-x-auto items-center gap-2 sm:gap-4 mx-2 sm:mx-4">
        {visibleFilters.map((filter, index) => (
          <button
            key={index}
            className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 rounded-md shadow hover:bg-gray-300 transition duration-200 whitespace-nowrap"
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={startIndex + itemsPerPage >= filters.length}
        className={`hidden sm:flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow ${
          startIndex + itemsPerPage >= filters.length
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <img src={nexticon} width={12} sm:width={16} alt="Next" />
      </button>
    </div>
  );
};

export default FilterBar;
