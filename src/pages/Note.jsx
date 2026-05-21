import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import {
  Pencil,
  Archive,
  ArchiveRestore,
  Pin,
  PinOff,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import BackButton from "../components/BackButton";

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
        <BackButton onClick={handleBackToNotes} label={backLabel} />
        <p className="text-gray-500 italic">This note no longer exists.</p>
      </div>
    );
  }

  const { border, lightBg, darkBg } = NOTE_COLOR_CLASSES[note.color];
  const colorClass = `p-6 rounded-2xl shadow-lg backdrop-blur-sm ${border} ${isDark ? darkBg : lightBg}`;

  return (
    <div className="space-y-2">
      {!editMode && (
        <BackButton onClick={handleBackToNotes} label={backLabel} />
      )}

      <div className="max-w-2xl mx-auto space-y-2">
        {/* Actions row */}
        <div className="flex justify-end items-center gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSaveChanges}
                data-tooltip-id="note-actions-tooltip"
                data-tooltip-content="Save"
                className="cursor-pointer p-2 rounded-lg transition-colors text-green-700 dark:text-green-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancelChanges}
                data-tooltip-id="note-actions-tooltip"
                data-tooltip-content="Cancel"
                className="cursor-pointer p-2 rounded-lg transition-colors text-red-700 dark:text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <X size={18} />
              </button>
              <Tooltip
                id="note-actions-tooltip"
                place="top"
                delayShow={200}
                opacity={0.6}
                className="z-50"
              />
            </>
          ) : (
            <>
              <select
                className="rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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

              <button
                onClick={() => setEditMode(true)}
                data-tooltip-id="note-actions-tooltip"
                data-tooltip-content="Edit"
                className="cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <Pencil size={18} />
              </button>

              {note.status === "archived" ? (
                <button
                  onClick={() => unarchiveNote(note.id)}
                  data-tooltip-id="note-actions-tooltip"
                  data-tooltip-content="Unarchive"
                  className="cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  <ArchiveRestore size={18} />
                </button>
              ) : (
                <button
                  onClick={() => archiveNote(note.id)}
                  data-tooltip-id="note-actions-tooltip"
                  data-tooltip-content="Archive"
                  className="cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  <Archive size={18} />
                </button>
              )}

              {note.pinned ? (
                <button
                  onClick={() => unpinNote(note.id)}
                  data-tooltip-id="note-actions-tooltip"
                  data-tooltip-content="Unpin"
                  className="cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  <PinOff size={18} />
                </button>
              ) : (
                <button
                  onClick={() => pinNote(note.id)}
                  data-tooltip-id="note-actions-tooltip"
                  data-tooltip-content="Pin"
                  className="cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  <Pin size={18} />
                </button>
              )}

              <button
                onClick={handleDeleteNote}
                data-tooltip-id="note-actions-tooltip"
                data-tooltip-content="Delete"
                className="cursor-pointer p-2 rounded-lg transition-colors text-red-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <Trash2 size={18} />
              </button>
              <Tooltip
                id="note-actions-tooltip"
                place="top"
                delayShow={200}
                opacity={0.6}
                className="z-50"
              />
            </>
          )}
        </div>

        {/* Note card */}
        <div className={colorClass}>
          {editMode ? (
            <form className="space-y-2">
              <input
                id="note-title"
                type="text"
                className="text-xl font-semibold block w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white/60 dark:bg-zinc-900/60 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                name="note-body"
                id="note-body"
                rows={10}
                className="block w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              />
            </form>
          ) : (
            <>
              <h1 className="text-xl font-semibold">{note.title}</h1>
              <p className="mt-1">{note.body}</p>
              <p className="mt-5 text-sm text-gray-500 italic">{`Created: ${formatDateFull(note.creationDate)}`}</p>
              <p className="mt-1 text-sm text-gray-500 italic">{`Modified: ${formatDateFull(note.lastEdited)}`}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Note;
