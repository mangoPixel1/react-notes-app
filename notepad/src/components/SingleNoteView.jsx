import { useContext, useState } from "react";

// Context
import { NotesContext } from "../NotesContext";
import { useNavigateToNotesView } from "../UIContext";

function SingleNoteView({ id }) {
  const { notes } = useContext(NotesContext);
  const navigateToNotesView = useNavigateToNotesView();

  // refactor for better error handling
  const [note, setNote] = useState(notes.find((note) => note.id === id));

  return (
    <div className="mt-10">
      <button
        onClick={navigateToNotesView}
        className="cursor-pointer hover:underline"
      >
        Back to notes
      </button>
      <div className="mt-3 border-2 border-gray-300">
        <h1 className="text-xl font-extrabold">{note.title}</h1>
        <p>{note.body}</p>
      </div>
    </div>
  );
}

export default SingleNoteView;
