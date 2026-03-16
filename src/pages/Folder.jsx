import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, FolderClosed, LayoutGrid, LayoutList } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

import NoteCard from "../components/NoteCard";

function Folder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { notes, folders } = useContext(NotesContext);
  const { notesLayout, setNotesLayout } = useContext(UIContext);

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
        <h2 className="font-bold text-3xl text-gray-500">
          {folders.find((folder) => folder.id === id)?.name}
        </h2>
      </div>

      {/* Layout toggle button */}
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

      {notes.filter((note) => note.folderId === id).length > 0 ? (
        <ul>
          {notes
            .filter((note) => note.folderId === id)
            .map((note) => (
              <NoteCard key={note.id} {...note} />
            ))}
        </ul>
      ) : (
        <h2>No notes in this folder.</h2>
      )}
    </div>
  );
}

export default Folder;
