import React from "react";

function NoteCard({ title, body, color, creationDate, lastEdited }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function formatDateStr(date) {
    return `${days[date.getDay()]}, ${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }

  return (
    <div className={`p-3 border border-${color}-400 bg-${color}-100`}>
      <h1 className="font-medium text-xl">{title}</h1>
      <p className="mb-4">{body}</p>
      <span className="text-sm text-gray-500 italic">{`Created: ${formatDateStr(
        creationDate
      )}`}</span>
      <br />
    </div>
  );
}

export default NoteCard;

/* 
<span className="text-sm text-gray-500 italic">{`Last edited: ${formatDateStr(
        lastEdited
      )}`}</span>
*/

/*
const colorOptions = ["yellow", "red", "green", "orange", "blue", "gray"];

  const colorStyles = {
    yellow: "p-3 border border-yellow-400 bg-yellow-100",
    red: "p-3 border border-red-400 bg-red-100",
    green: "p-3 border border-green-400 bg-green-100",
    orange: "p-3 border border-orange-400 bg-orange-100",
    blue: "p-3 border border-blue-400 bg-blue-100",
    gray: "p-3 border border-gray-400 bg-gray-100",
  };
*/
