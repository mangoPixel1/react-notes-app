import { useState, useContext, useEffect } from "react";

// Contexts
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

// Components
import Search from "../components/Search";
import NoteCard from "../components/NoteCard";

function Home() {
  const { notesLayout, addMode, setAddMode } = useContext(UIContext);
  const { notes, addNote } = useContext(NotesContext);

  // add to UIContext: to persist search value and results
  const [searchValue, setSearchValue] = useState(""); // the value of search input
  const [searchResults, setSearchResults] = useState(null); // the notes to render from searching

  function handleSearchInputChange(e) {
    const searchTerm = e.target.value;
    if (searchTerm === "") {
      setSearchValue("");
      setSearchResults(null);
      return;
    }
    setSearchValue(searchTerm);

    // set to notes and deal with sortedNotes
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredNotes);
  }

  const colorOptions = ["yellow", "red", "green", "orange", "blue", "gray"];
  const colorSortOrder = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
    blue: 4,
    gray: 5,
  };

  const [newNoteData, setNewNoteData] = useState({
    title: "",
    body: "",
    color: "",
  });

  const [sortOption, setSortOption] = useState("date-created-newest");
  const [sortedNotes, setSortedNotes] = useState(
    [...notes].sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
    )
  );
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
    switch (sortOption) {
      case "date-created-newest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
          )
        );
        break;

      case "date-created-oldest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(a.creationDate) - new Date(b.creationDate)
          )
        );
        break;

      case "last-edited-newest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(b.lastEdited) - new Date(a.lastEdited)
          )
        );
        break;

      case "last-edited-oldest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(a.lastEdited) - new Date(b.lastEdited)
          )
        );
        break;

      case "color":
        setSortedNotes(
          [...notes].sort(
            (a, b) => colorSortOrder[a.color] - colorSortOrder[b.color]
          )
        );
        break;
      default:
        console.log("default sorting option");
        setSortedNotes([...notes]);
        break;
    }
  }, [notes, sortOption]);

  return (
    <div className="mt-8">
      <Search
        searchValue={searchValue}
        handleInputChange={handleSearchInputChange}
      />

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
              className="px-2 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 transition duration-300"
            >
              Add Note
            </button>
            <button
              onClick={handleCancelNote}
              className="px-2 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!searchResults && (
        <div className="my-3">
          <label htmlFor="sortBy" className="mr-2">
            Sort by
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            name="sortBy"
            id="sortBy"
          >
            <option value="date-created-newest">{`Date Created (Newest)`}</option>
            <option value="date-created-oldest">{`Date Created (Oldest)`}</option>
            <option value="last-edited-newest">{`Last Edited (Newest)`}</option>
            <option value="last-edited-oldest">{`Last Edited (Oldest)`}</option>
            <option value="color">Color</option>
          </select>
        </div>
      )}

      <div
        className={`${
          notesLayout === "grid"
            ? `grid grid-cols-2 sm:grid-cols-3 gap-2`
            : `space-y-4`
        }`}
      >
        {searchResults
          ? searchResults.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                body={note.body}
                creationDate={note.creationDate}
                lastEdited={note.lastEdited}
                color={note.color}
              />
            ))
          : sortedNotes.map((note) => (
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

export default Home;
