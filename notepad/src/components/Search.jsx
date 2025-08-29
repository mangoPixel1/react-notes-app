import React from "react";

function Search() {
  return (
    <input
      id="search"
      name="search"
      type="text"
      placeholder="Search notes..."
      className="w-full border border-gray-500 px-2 py-2"
    />
  );
}

export default Search;
