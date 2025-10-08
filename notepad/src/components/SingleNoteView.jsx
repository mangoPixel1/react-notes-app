import { useContext, useState, useEffect } from "react";

// Context
import { NotesContext } from "../NotesContext";
import { useNavigateToNotesView } from "../UIContext";

function SingleNoteView({ id }) {
  const { notes, editNote } = useContext(NotesContext);
  const navigateToNotesView = useNavigateToNotesView();

  // refactor for better error handling/boundary?
  const [note, setNote] = useState(() => {
    const currentNote = notes.find((note) => note.id === id);
    return currentNote ? currentNote : null;
  });

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  // True when note has been modified in edit mode
  const [noteModified, setNoteModified] = useState(false);

  function handleSaveChanges() {
    if (noteModified) {
      editNote(note.id, editTitle, editBody);
    }
    // Reset state
    setNoteModified(false);
    setEditMode(false);
  }

  function handleCancelChanges() {
    // Reset state
    setEditTitle(note.title);
    setEditBody(note.body);
    setNoteModified(false);
    setEditMode(false);
  }

  function handleDeleteNote() {
    // removeNote()
    // navigate to NotesView
  }

  // Detects when the note has been modified
  useEffect(() => {
    if (editMode && (note.title !== editTitle || note.body !== editBody)) {
      setNoteModified(true);
    }
  }, [editTitle, editBody]);

  // Detects when note has been updated
  useEffect(() => {
    const updatedNote = notes.find((n) => n.id === id);

    if (updatedNote) {
      setNote(updatedNote);
      setEditTitle(updatedNote.title);
      setEditBody(updatedNote.body);
    }
  }, [notes, id]);

  // Initializes edit field values
  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditBody(note.body);
    }
  }, [note]);

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
              <button onClick={handleCancelChanges} className="cursor-pointer">
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
