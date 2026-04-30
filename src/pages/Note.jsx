import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";
import { NOTE_COLOR_CLASSES } from "../constants";
import { formatDateFull } from "../utils/formatDate";

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

  function handleSaveChanges() {
    if (!note) return;
    if (noteModified) {
      editNote(note.id, editTitle, editBody);
    }
    setNoteModified(false);
    setEditMode(false);
  }

  function handleCancelChanges() {
    if (!note) return;
    setEditTitle(note.title);
    setEditBody(note.body);
    setNoteModified(false);
    setEditMode(false);
  }

  function handleDeleteNote() {
    if (!note) return;
    moveNoteToTrash(note.id);
    handleBackToNotes();
  }

  function handleMoveToFolder(event) {
    if (!note) return;
    const selectedFolderId = event.target.value;
    if (!selectedFolderId) {
      removeNoteFromFolder(note.id);
      return;
    }
    addNoteToFolder(note.id, selectedFolderId);
  }

  useEffect(() => {
    if (!note) return;
    if (editMode && (note.title !== editTitle || note.body !== editBody)) {
      setNoteModified(true);
    } else {
      setNoteModified(false);
    }
  }, [editTitle, editBody, editMode, note]);

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditBody(note.body);
    } else {
      setEditTitle("");
      setEditBody("");
    }
  }, [note]);

  if (!note) {
    return (
      <div className="mt-10 space-y-4">
        <p className="text-gray-500 italic">This note no longer exists.</p>
        <button onClick={handleBackToNotes} className="cursor-pointer hover:underline">
          {backLabel}
        </button>
      </div>
    );
  }

  const { border, lightBg, darkBg } = NOTE_COLOR_CLASSES[note.color];
  const colorClass = `mt-3 p-3 ${border} ${isDark ? darkBg : lightBg}`;

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
          <div className={colorClass}>
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
            <button onClick={handleBackToNotes} className="cursor-pointer hover:underline">
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

              <button onClick={() => setEditMode(true)} className="cursor-pointer">
                Edit
              </button>

              {note.status === "archived" ? (
                <button onClick={() => unarchiveNote(note.id)} className="cursor-pointer">
                  Unarchive
                </button>
              ) : (
                <button onClick={() => archiveNote(note.id)} className="cursor-pointer">
                  Archive
                </button>
              )}

              {note.pinned ? (
                <button onClick={() => unpinNote(note.id)} className="cursor-pointer">
                  Unpin
                </button>
              ) : (
                <button onClick={() => pinNote(note.id)} className="cursor-pointer">
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

          <div className={colorClass}>
            <h1 className="text-xl font-semibold">{note.title}</h1>
            <p>{note.body}</p>
            <p className="mt-5 text-sm text-gray-500 italic">{`Created: ${formatDateFull(note.creationDate)}`}</p>
            <p className="mt-2 text-sm text-gray-500 italic">{`Modified: ${formatDateFull(note.lastEdited)}`}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Note;
