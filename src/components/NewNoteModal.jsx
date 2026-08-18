import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";
import { NOTE_COLORS, NOTE_COLOR_CLASSES, ADD_NOTE_PATHS } from "../constants";

// Same palette as NOTE_COLOR_CLASSES but less translucent, so modal content stays legible.
// Written out as literal class names (rather than derived at runtime) so Tailwind's
// build-time scanner can find and generate them.
const MODAL_COLOR_CLASSES = {
  yellow: { light: "bg-yellow-100/95", dark: "bg-yellow-950/90" },
  red: { light: "bg-red-100/95", dark: "bg-red-950/90" },
  green: { light: "bg-green-100/95", dark: "bg-green-950/90" },
  orange: { light: "bg-orange-100/95", dark: "bg-orange-950/90" },
  blue: { light: "bg-blue-100/95", dark: "bg-blue-950/90" },
  gray: { light: "bg-gray-50/95", dark: "bg-zinc-800/90" },
};

function NewNoteModal() {
  const location = useLocation();
  const canAddNote = ADD_NOTE_PATHS.includes(location.pathname);
  const { addMode, setAddMode, isDark, defaultNoteColor } = useContext(UIContext);
  const { folders, addNote } = useContext(NotesContext);

  const [newNoteData, setNewNoteData] = useState({
    title: "",
    body: "",
    color: defaultNoteColor,
    folderId: null,
  });

  const [error, setError] = useState("");
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!canAddNote && addMode) {
      setAddMode(false);
    }
  }, [canAddNote, addMode, setAddMode]);

  useEffect(() => {
    if (canAddNote && addMode) {
      titleInputRef.current?.focus();
    }
  }, [canAddNote, addMode]);

  function handleAddNote(e) {
    e.preventDefault();

    if (newNoteData.title === "" || newNoteData.body === "" || newNoteData.color === "") {
      setError("All fields are required.");
      return;
    }

    addNote(newNoteData);
    setAddMode(false);
    setNewNoteData({ title: "", body: "", color: defaultNoteColor, folderId: null });
    setError("");
  }

  function handleCancelNote() {
    setAddMode(false);
    setNewNoteData({ title: "", body: "", color: defaultNoteColor, folderId: null });
    setError("");
  }

  if (!canAddNote || !addMode) return null;

  const { border } = NOTE_COLOR_CLASSES[newNoteData.color];
  const { light, dark } = MODAL_COLOR_CLASSES[newNoteData.color];
  const modalBg = isDark ? dark : light;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.25)" }}
      onClick={handleCancelNote}
    >
      <div
        className={`relative w-full max-w-xl rounded-2xl p-6 shadow-2xl transition-colors duration-300 ${border} ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold">Create new note</h2>
        <form className="space-y-4">
          <div className="space-y-2">
            <input
              ref={titleInputRef}
              className={`block w-full rounded-md border px-3 py-2 ${
                error && newNoteData.title === "" ? `border-red-600` : `border-gray-500`
              }`}
              type="text"
              placeholder="Title"
              value={newNoteData.title}
              onChange={(e) =>
                setNewNoteData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <textarea
              className={`block min-h-32 w-full rounded-md border px-3 py-2 ${
                error && newNoteData.body === "" ? `border-red-600` : `border-gray-500`
              }`}
              name="note-body"
              id="note-body"
              placeholder="Body"
              value={newNoteData.body}
              onChange={(e) =>
                setNewNoteData((prev) => ({ ...prev, body: e.target.value }))
              }
            ></textarea>
          </div>

          <div
            className={`flex flex-wrap rounded-md ${
              error && newNoteData.color === "" && `border border-red-600`
            }`}
          >
            <span className="mr-3 font-semibold">Color:</span>
            {NOTE_COLORS.map((colorOption) => (
              <div key={colorOption}>
                <input
                  type="radio"
                  id={colorOption}
                  name="colors"
                  value={colorOption}
                  checked={newNoteData.color === colorOption}
                  onChange={(e) =>
                    setNewNoteData((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
                <label htmlFor={colorOption} className="ml-1 mr-3">
                  {colorOption.charAt(0).toUpperCase() + colorOption.slice(1)}
                </label>
              </div>
            ))}
          </div>

          <div>
            <h3 className="mr-3 font-semibold">Folder:</h3>
            <select
              className="rounded-md border border-gray-500 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800"
              value={newNoteData.folderId || ""}
              onChange={(e) =>
                setNewNoteData((prev) => ({
                  ...prev,
                  folderId: e.target.value || null,
                }))
              }
            >
              <option value="">Select a folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-red-600">{error}</p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelNote}
              className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium transition hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewNoteModal;
