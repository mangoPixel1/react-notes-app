import { useState, useContext, useEffect, useMemo } from "react";

// Contexts
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

// Components
import NoteCard from "../components/NoteCard";

import { LayoutGrid, LayoutList } from "lucide-react";

function Dashboard() {
  const { notesLayout, setNotesLayout, searchValue } = useContext(UIContext);
  const { notes } = useContext(NotesContext);

  const colorSortOrder = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
    blue: 4,
    gray: 5,
  };

  const [sortOption, setSortOption] = useState("date-created-newest");
  const [sortedNotes, setSortedNotes] = useState(
    [...notes].sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
    ),
  );
  const visibleNotes = useMemo(() => {
    if (!searchValue.trim()) return sortedNotes;

    return sortedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        note.body.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [sortedNotes, searchValue]);

  useEffect(() => {
    switch (sortOption) {
      case "date-created-newest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
          ),
        );
        break;

      case "date-created-oldest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(a.creationDate) - new Date(b.creationDate),
          ),
        );
        break;

      case "last-edited-newest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(b.lastEdited) - new Date(a.lastEdited),
          ),
        );
        break;

      case "last-edited-oldest":
        setSortedNotes(
          [...notes].sort(
            (a, b) => new Date(a.lastEdited) - new Date(b.lastEdited),
          ),
        );
        break;

      case "color":
        setSortedNotes(
          [...notes].sort(
            (a, b) => colorSortOrder[a.color] - colorSortOrder[b.color],
          ),
        );
        break;
      default:
        console.log("default sorting option");
        setSortedNotes([...notes]);
        break;
    }
  }, [notes, sortOption]);

  return (
    <div className="">
      <div className="flex gap-4">
        <button
          onClick={() =>
            setNotesLayout(notesLayout === "list" ? "grid" : "list")
          }
          className="cursor-pointer"
        >
          {notesLayout === "list" ? (
            <LayoutGrid className="w-6 h-6 text-gray-500" />
          ) : (
            <LayoutList className="w-6 h-6 text-gray-500" />
          )}
        </button>
        <div className="my-3">
          <label htmlFor="sortBy" className="mr-2">
            Sort by:
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
      </div>

      <div
        className={`${
          notesLayout === "grid"
            ? `grid grid-cols-2 sm:grid-cols-3 gap-2`
            : `space-y-4`
        }`}
      >
        {visibleNotes.map((note) => (
          <NoteCard key={note.id} {...note} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
