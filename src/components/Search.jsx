import { useState, useContext } from "react";

// Contexts
import { UIContext } from "../contexts/UIContext";

function Search({ searchValue, handleInputChange }) {
  const { isDark } = useContext(UIContext);

  return (
    <div className="flex items-center">
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search notes..."
        className={`w-full h-10 rounded-md px-6 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 ${
          isDark
            ? "bg-amber-950 text-gray-300 placeholder-amber-700"
            : "bg-orange-100 text-gray-600 placeholder-orange-400 "
        }`}
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default Search;
