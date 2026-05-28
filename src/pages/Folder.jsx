import { useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { FolderClosed } from "lucide-react";

import BackButton from "../components/BackButton";

import { NotesContext } from "../contexts/NotesContext";
import { NOTE_STATUS } from "../constants";

import NoteCard from "../components/NoteCard";
import LayoutToggle from "../components/LayoutToggle";
import NotesGrid from "../components/NotesGrid";

function Folder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { notes, folders } = useContext(NotesContext);
  const folder = folders.find((f) => f.id === id);
  const folderNotes = notes.filter(
    (note) => note.folderId === id && note.status === NOTE_STATUS.ACTIVE,
  );

  return (
    <div className="space-y-4">
      <BackButton
        onClick={() => navigate("/folders")}
        label="Back to Folders"
      />
      <div className="flex items-center gap-4">
        <FolderClosed className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        <h2 className="font-bold text-4xl text-gray-500 dark:text-gray-400">{folder?.name}</h2>
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
