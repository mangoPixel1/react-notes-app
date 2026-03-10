import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

function Folder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { notes, folders } = useContext(NotesContext);

  return (
    <div>
      <h1>Folder</h1>
      {notes.filter((note) => note.folderId === id).length > 0 ? (
        <ul>
          {notes
            .filter((note) => note.folderId === id)
            .map((note) => (
              <li key={note.id}>
                <Link to={`/dashboard/note/${note.id}`}>{note.title}</Link>
              </li>
            ))}
        </ul>
      ) : (
        <h2>No notes in this folder.</h2>
      )}
    </div>
  );
}

export default Folder;
