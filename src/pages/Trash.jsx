import { useContext, useMemo } from "react";
import { Trash2 } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { NOTE_STATUS } from "../constants";

import NoteCard from "../components/NoteCard";
import LayoutToggle from "../components/LayoutToggle";
import NotesGrid from "../components/NotesGrid";

function Trash() {
  const { notes } = useContext(NotesContext);

  const trashedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === NOTE_STATUS.TRASHED)
        .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)),
    [notes],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Trash2 className="w-10 h-10 text-gray-400" />
        <h1 className="font-bold text-4xl text-gray-500">Trash</h1>
      </div>

      <div className="flex gap-4">
        <LayoutToggle />
      </div>

      {trashedNotes.length === 0 ? (
        <p className="text-gray-500 italic">No notes in trash.</p>
      ) : (
        <NotesGrid>
          {trashedNotes.map((note) => (
            <NoteCard key={note.id} {...note} variant="trash" />
          ))}
        </NotesGrid>
      )}
    </div>
  );
}

export default Trash;
