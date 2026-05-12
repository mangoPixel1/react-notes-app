import { useContext, useMemo } from "react";
import { Archive } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { NOTE_STATUS } from "../constants";

import NoteCard from "../components/NoteCard";
import LayoutToggle from "../components/LayoutToggle";
import NotesGrid from "../components/NotesGrid";

function Archived() {
  const { notes } = useContext(NotesContext);

  const archivedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === NOTE_STATUS.ARCHIVED)
        .sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited)),
    [notes],
  );

  return (
    <div className="space-y-4">
      <div className="h-8" />
      <div className="flex items-center gap-4">
        <Archive className="w-10 h-10 text-gray-400" />
        <h1 className="font-bold text-4xl text-gray-500">Archived</h1>
      </div>

      <div className="flex gap-4">
        <LayoutToggle />
      </div>

      {archivedNotes.length === 0 ? (
        <p className="text-gray-500 italic">No archived notes.</p>
      ) : (
        <NotesGrid>
          {archivedNotes.map((note) => (
            <NoteCard key={note.id} {...note} variant="archived" />
          ))}
        </NotesGrid>
      )}
    </div>
  );
}

export default Archived;
