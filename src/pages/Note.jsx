import { useContext, useState, useEffect } from "react";

// Context
import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";
import { useLocation, useNavigate, useParams } from "react-router";

function Note() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    notes,
    folders,
    editNote,
    archiveNote,
    unarchiveNote,
    pinNote,
    unpinNote,
    moveNoteToTrash,
    addNoteToFolder,
    removeNoteFromFolder,
  } = useContext(NotesContext);

  const { isDark } = useContext(UIContext);

  const note = notes.find((currentNote) => currentNote.id === id) || null;

  // Holds state for the edit form fields and tracks whether the note has been modified.
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [noteModified, setNoteModified] = useState(false);

  const backLabel =
    typeof location.state?.backLabel === "string" && location.state.backLabel
      ? location.state.backLabel
      : "Back to notes";

  function handleBackToNotes() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/dashboard");
  }

  // Save note edits only when content changed, then exit edit mode.
  function handleSaveChanges() {
    if (!note) return;

    if (noteModified) {
      editNote(note.id, editTitle, editBody);
    }
    // Reset state
    setNoteModified(false);
    setEditMode(false);
  }

  // Revert draft values back to note data and exit edit mode.
  function handleCancelChanges() {
    if (!note) return;

    // Reset state
    setEditTitle(note.title);
    setEditBody(note.body);
    setNoteModified(false);
    setEditMode(false);
  }

  // Move the note to trash and return to the previous page.
  function handleDeleteNote() {
    if (!note) return;
    moveNoteToTrash(note.id);
    handleBackToNotes();
  }

  function handleMoveToFolder(event) {
    if (!note) return;
    const selectedFolderId = event.target.value; // selected value from dropdown
    if (!selectedFolderId) {
      removeNoteFromFolder(note.id); // If "No folder" is selected, remove from any folder
      return;
    }
    addNoteToFolder(note.id, selectedFolderId);
  }

  // Detects when the note has been modified
  useEffect(() => {
    if (!note) return;

    if (editMode && (note.title !== editTitle || note.body !== editBody)) {
      setNoteModified(true);
    } else {
      setNoteModified(false);
    }
  }, [editTitle, editBody, editMode, note]);

  // Initializes edit field values
  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditBody(note.body);
    } else {
      setEditTitle("");
      setEditBody("");
    }
  }, [note]);

  // Show a fallback state when the note id is no longer valid.
  if (!note) {
    return (
      <div className="mt-10 space-y-4">
        <p className="text-gray-500 italic">This note no longer exists.</p>
        <button
          onClick={handleBackToNotes}
          className="cursor-pointer hover:underline"
        >
          {backLabel}
        </button>
      </div>
    );
  }

  // Map note colors to light/dark styles for the note container.
  const colorMap = {
    yellow: isDark
      ? "mt-3 p-3 border-2 border-yellow-400 bg-yellow-100 bg-zinc-700"
      : "mt-3 p-3 border-2 border-yellow-400 bg-yellow-100",
    red: isDark
      ? "mt-3 p-3 border-2 border-red-400 bg-red-100 bg-zinc-700"
      : "mt-3 p-3 border-2 border-red-400 bg-red-100",
    green: isDark
      ? "mt-3 p-3 border-2 border-green-400 bg-green-100 bg-zinc-700"
      : "mt-3 p-3 border-2 border-green-400 bg-green-100",
    orange: isDark
      ? "mt-3 p-3 border-2 border-orange-400 bg-orange-100 bg-zinc-700"
      : "mt-3 p-3 border-2 border-orange-400 bg-orange-100",
    blue: isDark
      ? "mt-3 p-3 border-2 border-blue-400 bg-blue-100 bg-zinc-700"
      : "mt-3 p-3 border-2 border-blue-400 bg-blue-100",
    gray: isDark
      ? "mt-3 p-3 border-2 border-gray-400 bg-gray-100 bg-zinc-700"
      : "mt-3 p-3 border-2 border-gray-400 bg-gray-100",
  };

  // Lookup tables for the page-level date/time formatter.
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

  // Convert Date objects to the full "Day, Mon DD, YYYY at HH:MM" format.
  function formatDateStr(date) {
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return `${day}, ${month} ${dateNum}, ${year} at ${hour
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  return (
    <div className="">
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
            </div>
          </div>
          <div className={colorMap[note.color]}>
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
              onClick={handleBackToNotes}
              className="cursor-pointer hover:underline"
            >
              {backLabel}
            </button>

            <div className="space-x-2">
              <label className="inline-flex items-center gap-2">
                <select
                  className="rounded-md border border-gray-500 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800"
                  value={note.folderId || ""}
                  onChange={handleMoveToFolder}
                  disabled={folders.length === 0}
                >
                  <option value="">No folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => setEditMode(true)}
                className="cursor-pointer"
              >
                Edit
              </button>

              {note.status === "archived" ? (
                <button
                  onClick={() => unarchiveNote(note.id)}
                  className="cursor-pointer"
                >
                  Unarchive
                </button>
              ) : (
                <button
                  onClick={() => archiveNote(note.id)}
                  className="cursor-pointer"
                >
                  Archive
                </button>
              )}

              {note.pinned ? (
                <button
                  onClick={() => unpinNote(note.id)}
                  className="cursor-pointer"
                >
                  Unpin
                </button>
              ) : (
                <button
                  onClick={() => pinNote(note.id)}
                  className="cursor-pointer"
                >
                  Pin
                </button>
              )}

              <button
                onClick={handleDeleteNote}
                className="cursor-pointer text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div className={colorMap[note.color]}>
            <h1 className="text-xl font-semibold">{note.title}</h1>
            <p>{note.body}</p>
            <p className="mt-5 text-sm text-gray-500 italic">{`Created: ${formatDateStr(
              note.creationDate,
            )}`}</p>
            <p className="mt-2 text-sm text-gray-500 italic">{`Modified: ${formatDateStr(
              note.lastEdited,
            )}`}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Note;
