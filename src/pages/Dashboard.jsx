import { useState, useContext, useMemo, useCallback } from "react";

import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";
import { COLOR_SORT_ORDER, NOTE_STATUS } from "../constants";

import NoteCard from "../components/NoteCard";
import LayoutToggle from "../components/LayoutToggle";
import NotesGrid from "../components/NotesGrid";

import { Pin } from "lucide-react";

function Dashboard() {
  const { searchValue } = useContext(UIContext);
  const { notes } = useContext(NotesContext);

  const [sortOption, setSortOption] = useState("date-created-newest");

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
          return COLOR_SORT_ORDER[a.color] - COLOR_SORT_ORDER[b.color];
        default:
          return 0;
      }
    },
    [sortOption],
  );

  const activePinnedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === NOTE_STATUS.ACTIVE && note.pinned === true)
        .sort(sortNotes),
    [notes, sortNotes],
  );

  const sortedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === NOTE_STATUS.ACTIVE && note.pinned === false)
        .sort(sortNotes),
    [notes, sortNotes],
  );

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
        <LayoutToggle />
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
            <NotesGrid>
              {activePinnedNotes.map((note) => (
                <NoteCard key={note.id} {...note} />
              ))}
            </NotesGrid>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">All notes</h2>
        <NotesGrid>
          {visibleNotes.map((note) => (
            <NoteCard key={note.id} {...note} />
          ))}
        </NotesGrid>
      </div>
    </div>
  );
}

export default Dashboard;
