import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

import NoteCard from "../components/NoteCard";

function Folder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { notes, folders } = useContext(NotesContext);

  return (
    <div>
      <h1>{folders.find((folder) => folder.id === id)?.name}</h1>
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
