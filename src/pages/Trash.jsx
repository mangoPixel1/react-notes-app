import { useContext, useMemo } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";
import NoteCard from "../components/NoteCard";

function Trash() {
  const { notesLayout, setNotesLayout } = useContext(UIContext);
  const { notes } = useContext(NotesContext);

  const trashedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === "trashed")
        .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)),
    [notes],
  );

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-4xl text-gray-500">Trash</h1>

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

      {trashedNotes.length === 0 ? (
        <p className="text-gray-500 italic">No notes in trash.</p>
      ) : (
        <div
          className={`${
            notesLayout === "grid"
              ? `grid grid-cols-2 sm:grid-cols-3 gap-2`
              : `space-y-4`
          }`}
        >
          {trashedNotes.map((note) => (
            <NoteCard key={note.id} {...note} variant="trash" />
          ))}
        </div>
      )}
    </div>
  );
}

export default Trash;
