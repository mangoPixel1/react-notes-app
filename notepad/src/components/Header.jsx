import React from "react";

function Header() {
  return (
    <header className="flex justify-between">
      <h1 className="text-2xl font-medium">Notepad</h1>
      <input
        type="text"
        placeholder="Search note..."
        className="border border-gray-500 px-2 py-2"
      />
      <button className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300">
        Menu
      </button>
    </header>
  );
}

export default Header;
