import { useState, useContext, useEffect } from "react";

// Contexts
import { UIContext } from "../UIContext";
import { NotesContext } from "../NotesContext";

// Components
import Search from "./Search";
import NoteCard from "./NoteCard";

function NotesView() {
  const { addMode, setAddMode } = useContext(UIContext);
  const { notes, addNote } = useContext(NotesContext);
  const colorOptions = ["yellow", "red", "green", "orange", "blue", "gray"];

  const [newNoteData, setNewNoteData] = useState({
    title: "",
    body: "",
    color: "",
  });

  const [error, setError] = useState("");

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
    });

    // Reset error messages
    setError("");
  }

  function handleCancelNote(e) {
    // cancel adding note
    e.preventDefault();
    if (addMode) {
      setAddMode(false);
      setNewNoteData({
        title: "",
        body: "",
        color: "",
      });
      setError("");
    }
  }

  useEffect(() => {
    console.log(notes);
  }, [notes]);

  return (
    <div className="mt-8">
      <Search />

      {addMode && (
        <form className="my-8">
          <div className="space-y-2">
            <input
              className={`block border  ${
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
              className={`block border  ${
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
            className={`flex flex-wrap mt-5 ${
              error && newNoteData.color === "" && `border border-red-600`
            }`}
          >
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

          <p className="text-sm text-red-600 mt-2 mb-3">{error}</p>

          <div className="flex gap-4">
            <button
              onClick={handleAddNote}
              className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300"
            >
              Add Note
            </button>
            <button
              onClick={handleCancelNote}
              className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="my-3">
        <label htmlFor="sortBy" className="mr-2">
          Sort by
        </label>
        <select name="sortBy" id="sortBy">
          <option value="date-created-newest">{`Date Created (Newest)`}</option>
          <option value="date-created-oldest">{`Date Created (Oldest)`}</option>
          <option value="last-edited">Last Edited</option>
          <option value="color">Color</option>
        </select>
      </div>
      <div className="space-y-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            body={note.body}
            creationDate={note.creationDate}
            lastEdited={note.lastEdited}
            color={note.color}
          />
        ))}
      </div>
    </div>
  );
}

export default NotesView;
