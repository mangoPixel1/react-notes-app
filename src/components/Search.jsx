import { useState } from "react";

function Search({ searchValue, handleInputChange }) {
  return (
    <div className="mb-4">
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search notes..."
        className="w-full border border-gray-500 px-2 py-2"
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default Search;
