import React from "react";

function NoteCard({ color }) {
  const colors = {
    yellow: "border border-yellow-400 bg-yellow-100",
    red: "border border-red-400 bg-red-100",
    green: "border border-green-400 bg-green-100",
    orange: "border border-orange-400 bg-orange-100",
    blue: "border border-blue-400 bg-blue-100",
    gray: "border border-gray-400 bg-gray-100",
  };

  return (
    <div className={`border border-${color}-400 bg-${color}-100`}>
      <h1>Title</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua...
      </p>
    </div>
  );
}

export default NoteCard;
