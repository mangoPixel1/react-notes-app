import { useContext } from "react";

// Contexts
import { UIContext } from "../UIContext";
import { NotesContext } from "../NotesContext";

function NoteCard({ id, title, body, color, creationDate, lastEdited }) {
  const { isDark, currentViewIndex, setCurrentViewIndex, setCurrentNoteID } =
    useContext(UIContext);
  const { removeNote } = useContext(NotesContext);

  function navigateToSingleNoteView() {
    setCurrentNoteID(id); // set current note to this note's id
    setCurrentViewIndex(1); // set view to SingleNoteView
  }

  function handleRemoveNote() {
    removeNote(id);
  }

  const colorMap = {
    yellow: isDark
      ? "p-3 border border-2 border-yellow-400 bg-zinc-700"
      : "p-3 border border-2 border-yellow-400 bg-yellow-100",
    red: isDark
      ? "p-3 border border-2 border-red-400 bg-zinc-700"
      : "p-3 border border-red-400 bg-red-100",
    green: isDark
      ? "p-3 border border-2 border-green-400 bg-zinc-700"
      : "p-3 border border-green-400 bg-green-100",
    orange: isDark
      ? "p-3 border border-2 border-orange-400 bg-zinc-700"
      : "p-3 border border-orange-400 bg-orange-100",
    blue: isDark
      ? "p-3 border border-2 border-blue-400 bg-zinc-700"
      : "p-3 border border-blue-400 bg-blue-100",
    gray: isDark
      ? "p-3 border border-2 border-gray-400 bg-zinc-700"
      : "p-3 border border-gray-400 bg-gray-100",
  };

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

  // Click on title triggers single note view

  return (
    <div className={colorMap[color]}>
      <h1
        onClick={navigateToSingleNoteView}
        className="font-semibold text-xl cursor-pointer hover:underline"
      >
        {title}
      </h1>
      <p className="mb-4">{body}</p>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500 italic">{`Created: ${formatDateStr(
          creationDate
        )}`}</p>
        <div className="flex gap-2">
          <button
            onClick={() => removeNote(id)}
            className="text-red-600 hover:text-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
