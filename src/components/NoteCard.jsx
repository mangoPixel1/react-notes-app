import { useContext } from "react";
import { Link } from "react-router";

import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";
import { NOTE_COLOR_CLASSES } from "../constants";
import { formatDateShort } from "../utils/formatDate";

function NoteCard({
  id,
  title,
  body,
  color,
  pinned,
  creationDate,
  backLabel,
  variant = "default",
}) {
  const { isDark } = useContext(UIContext);
  const { moveNoteToTrash, restoreNoteFromTrash, deleteNote, pinNote, unpinNote } =
    useContext(NotesContext);

  const { border, lightBg, darkBg } = NOTE_COLOR_CLASSES[color];
  const colorClass = `p-3 ${border} ${isDark ? darkBg : lightBg}`;

  return (
    <div className={colorClass}>
      <Link to={`/note/${id}`} state={backLabel ? { backLabel } : undefined}>
        <h1 className="font-semibold text-xl cursor-pointer hover:underline">
          {title}
        </h1>
      </Link>

      <p className="mb-4">{body}</p>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500 italic">{`Created: ${formatDateShort(creationDate)}`}</p>
        <div className="flex gap-2">
          {variant === "trash" ? (
            <>
              <button
                onClick={() => restoreNoteFromTrash(id)}
                className="text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Restore
              </button>
              <button
                onClick={() => deleteNote(id)}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                Delete Forever
              </button>
            </>
          ) : (
            <>
              {pinned ? (
                <button onClick={() => unpinNote(id)} className="cursor-pointer hover:underline">
                  Unpin
                </button>
              ) : (
                <button onClick={() => pinNote(id)} className="cursor-pointer hover:underline">
                  Pin
                </button>
              )}
              <button
                onClick={() => moveNoteToTrash(id)}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
