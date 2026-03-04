import { useState, useContext, useMemo, useCallback } from "react";

// Contexts
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

// Components
import NoteCard from "../components/NoteCard";

// Icons
import { LayoutGrid, LayoutList, Pin } from "lucide-react";

const colorSortOrder = {
  red: 0,
  orange: 1,
  yellow: 2,
  green: 3,
  blue: 4,
  gray: 5,
};

function Dashboard() {
  // Read global UI state (layout + search text) and the full notes collection.
  const { notesLayout, setNotesLayout, searchValue } = useContext(UIContext);
  const { notes } = useContext(NotesContext);

  // Track which sort mode is selected in the dropdown.
  const [sortOption, setSortOption] = useState("date-created-newest");

  // Reusable comparator used by both pinned and unpinned note groups.
  const sortNotes = useCallback(
    (a, b) => {
      switch (sortOption) {
        case "date-created-newest":
          return new Date(b.creationDate) - new Date(a.creationDate);
        case "date-created-oldest":
          return new Date(a.creationDate) - new Date(b.creationDate);
        case "last-edited-newest":
          return new Date(b.lastEdited) - new Date(a.lastEdited);
        case "last-edited-oldest":
          return new Date(a.lastEdited) - new Date(b.lastEdited);
        case "color":
          return colorSortOrder[a.color] - colorSortOrder[b.color];
        default:
          return 0;
      }
    },
    [sortOption],
  );

  // Build the pinned notes section and keep it sorted by the active sort mode.
  const activePinnedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === "active" && note.pinned === true)
        .sort(sortNotes),
    [notes, sortNotes],
  );

  // Build the regular active notes section and keep it sorted by the active sort mode.
  const sortedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === "active" && note.pinned === false)
        .sort(sortNotes),
    [notes, sortNotes],
  );

  // Apply search filtering only to the unpinned "All notes" section.
  const visibleNotes = useMemo(() => {
    if (!searchValue.trim()) return sortedNotes;

    return sortedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        note.body.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [sortedNotes, searchValue]);

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

      <div>
        {activePinnedNotes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Pin className="w-5 h-5 text-gray-500 mr-1" />
              <h2 className="text-lg font-semibold">Pinned</h2>
            </div>

            <div
              className={`${
                notesLayout === "grid"
                  ? `grid grid-cols-2 sm:grid-cols-3 gap-2`
                  : `space-y-4`
              }`}
            >
              {activePinnedNotes.map((note) => (
                <NoteCard key={note.id} {...note} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">All notes</h2>
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
    </div>
  );
}

export default Dashboard;
