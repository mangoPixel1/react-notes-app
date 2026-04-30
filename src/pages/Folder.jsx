import { useContext } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, FolderClosed } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";

import NoteCard from "../components/NoteCard";
import LayoutToggle from "../components/LayoutToggle";
import NotesGrid from "../components/NotesGrid";

function Folder() {
  const { id } = useParams();

  const { notes, folders } = useContext(NotesContext);
  const folder = folders.find((f) => f.id === id);
  const folderNotes = notes.filter((note) => note.folderId === id);

  return (
    <div className="space-y-4">
      <Link className="block" to="/folders">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-6 h-6 text-gray-400" />
          <span>Back to Folders</span>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <FolderClosed className="w-10 h-10 text-gray-400" />
        <h2 className="font-bold text-3xl text-gray-500">{folder?.name}</h2>
      </div>

      <div className="flex gap-4">
        <LayoutToggle />
      </div>

      {folderNotes.length > 0 ? (
        <NotesGrid>
          {folderNotes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              backLabel={folder ? `Back to ${folder.name}` : undefined}
            />
          ))}
        </NotesGrid>
      ) : (
        <h2>No notes in this folder.</h2>
      )}
    </div>
  );
}

export default Folder;
