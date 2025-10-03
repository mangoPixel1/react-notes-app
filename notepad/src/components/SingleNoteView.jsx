import { useContext, useState } from "react";

// Context
import { NotesContext } from "../NotesContext";

function SingleNoteView({ id }) {
  const { notes } = useContext(NotesContext);

  // refactor for better error handling
  const [note, setNote] = useState(notes.find((note) => note.id === id));

  return (
    <div>
      <h1 className="text-xl font-extrabold">{note.title}</h1>
      <p>{note.body}</p>
    </div>
  );
}

export default SingleNoteView;
