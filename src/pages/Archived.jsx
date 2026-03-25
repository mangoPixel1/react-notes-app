import { useContext, useMemo } from "react";
import { Archive, LayoutGrid, LayoutList } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";
import NoteCard from "../components/NoteCard";

function Archived() {
  const { notesLayout, setNotesLayout } = useContext(UIContext);
  const { notes } = useContext(NotesContext);

  const archivedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === "archived")
        .sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited)),
    [notes],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Archive className="w-10 h-10 text-gray-400" />
        <h1 className="font-bold text-4xl text-gray-500">Archived</h1>
      </div>

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
      </div>

      {archivedNotes.length === 0 ? (
        <p className="text-gray-500 italic">No archived notes.</p>
      ) : (
        <div
          className={`${
            notesLayout === "grid"
              ? `grid grid-cols-2 sm:grid-cols-3 gap-2`
              : `space-y-4`
          }`}
        >
          {archivedNotes.map((note) => (
            <NoteCard key={note.id} {...note} variant="archived" />
          ))}
        </div>
      )}
    </div>
  );
}

export default Archived;
