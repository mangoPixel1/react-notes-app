import { useContext, useState } from "react";

// Context
import { NotesContext } from "../NotesContext";
import { useNavigateToNotesView } from "../UIContext";

function SingleNoteView({ id }) {
  const { notes } = useContext(NotesContext);
  const navigateToNotesView = useNavigateToNotesView();

  // refactor for better error handling
  const [note, setNote] = useState(() => {
    const currentNote = notes.find((note) => note.id === id);
    return currentNote ? currentNote : null;
  });

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);

  function handleSaveChanges() {
    // editNote(title, body, lastUpdate)
  }

  function handleDeleteNote() {
    // removeNote()
    // navigate to NotesView
  }

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
    <div className="mt-10">
      {editMode ? (
        <>
          <div className="flex justify-end">
            <div className="space-x-2">
              <button onClick={handleSaveChanges} className="cursor-pointer">
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="cursor-pointer"
              >
                Cancel
              </button>
              <button className="cursor-pointer text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
          <div
            className={`mt-3 p-3 border-2 border-${note.color}-400 bg-${note.color}-100`}
          >
            <form className="space-y-2">
              <input
                id="note-title"
                type="text"
                className="text-xl font-semibold block border-2 border-gray-400"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                name="note-body"
                id="note-body"
                className="block border-2 border-gray-400"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              ></textarea>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <button
              onClick={navigateToNotesView}
              className="cursor-pointer hover:underline"
            >
              Back to notes
            </button>
            <div className="space-x-2">
              <button
                onClick={() => setEditMode(true)}
                className="cursor-pointer"
              >
                Edit
              </button>
              <button className="cursor-pointer text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>

          <div
            className={`mt-3 p-3 border-2 border-${note.color}-400 bg-${note.color}-100`}
          >
            <h1 className="text-xl font-semibold">{note.title}</h1>
            <p>{note.body}</p>
            <p className="mt-5 text-sm text-gray-500 italic">{`Created: ${formatDateStr(
              note.creationDate
            )}`}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleNoteView;
