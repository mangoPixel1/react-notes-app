import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

// Contexts
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

function NewNoteModal() {
  const location = useLocation();
  const canAddNote = ["/dashboard", "/folders"].includes(location.pathname);
  const { addMode, setAddMode } = useContext(UIContext);
  const { folders, addNote } = useContext(NotesContext);
  const colorOptions = ["yellow", "red", "green", "orange", "blue", "gray"];

  const [newNoteData, setNewNoteData] = useState({
    title: "",
    body: "",
    color: "",
    folderId: null,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!canAddNote && addMode) {
      setAddMode(false);
    }
  }, [canAddNote, addMode, setAddMode]);

  function handleAddNote(e) {
    e.preventDefault();

    // Form validation to check for empty fields
    if (
      newNoteData.title === "" ||
      newNoteData.body === "" ||
      newNoteData.color === ""
    ) {
      setError("All fields are required.");
      return;
    }

    addNote(newNoteData);
    setAddMode(false);

    // Clear form input fields
    setNewNoteData({
      title: "",
      body: "",
      color: "",
      folderId: null,
    });

    // Reset error messages
    setError("");
  }

  function handleCancelNote(e) {
    // Clear form input data
    setAddMode(false);
    setNewNoteData({
      title: "",
      body: "",
      color: "",
      folderId: null,
    });
    setError("");
  }

  if (!canAddNote || !addMode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/40"
        onClick={handleCancelNote}
      />

      <div className="relative w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-4 text-lg font-semibold">Create new note</h2>
        <form className="space-y-4">
          <div className="space-y-2">
            <input
              className={`block w-full rounded-md border px-3 py-2 ${
                error && newNoteData.title === ""
                  ? `border-red-600`
                  : `border-gray-500`
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
                error && newNoteData.body === ""
                  ? `border-red-600`
                  : `border-gray-500`
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
            {colorOptions.map((colorOption, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={colorOption}
                  name="colors"
                  value={colorOption}
                  checked={newNoteData.color === colorOption}
                  onChange={(e) =>
                    setNewNoteData((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
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

          <div className="flex gap-4">
            <button
              onClick={handleAddNote}
              className="rounded-md bg-gray-200 px-3 py-2 transition duration-300 hover:bg-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 cursor-pointer"
            >
              Add Note
            </button>
            <button
              type="button"
              onClick={handleCancelNote}
              className="rounded-md bg-gray-200 px-3 py-2 transition duration-300 hover:bg-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewNoteModal;
