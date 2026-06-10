import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Pin, MoreVertical, Archive, Trash2, RotateCcw } from "lucide-react";

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
  const { isDark, setConfirmAction } = useContext(UIContext);
  const {
    moveNoteToTrash,
    restoreNoteFromTrash,
    deleteNote,
    archiveNote,
    unarchiveNote,
    pinNote,
    unpinNote,
  } = useContext(NotesContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const { border, lightBg, darkBg } = NOTE_COLOR_CLASSES[color];
  const colorClass = `relative group flex flex-col p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm ${border} ${isDark ? darkBg : lightBg}`;
  const iconButtonBase = `p-1 rounded-full cursor-pointer transition-opacity duration-200 ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"}`;

  return (
    <div className={colorClass}>
      {variant === "default" && (
        <button
          onClick={() => (pinned ? unpinNote(id) : pinNote(id))}
          title={pinned ? "Unpin" : "Pin"}
          className={`${iconButtonBase} absolute top-3 right-3 ${pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <Pin size={16} fill={pinned ? "#6A7283" : "none"} stroke={pinned ? "#6A7283" : "currentColor"} />
        </button>
      )}

      <Link to={`/note/${id}`} state={backLabel ? { backLabel } : undefined}>
        <h1 className="font-semibold text-lg cursor-pointer hover:underline line-clamp-2 mb-1 pr-7">
          {title}
        </h1>
      </Link>

      <p className="mb-4 text-sm line-clamp-4 text-gray-700 dark:text-gray-300">{body}</p>

      <div className="flex justify-between items-center mt-auto">
        <p className="text-sm text-gray-500 italic">{`Created: ${formatDateShort(creationDate)}`}</p>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            title="More options"
            className={`${iconButtonBase} ${menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div
              className={`absolute bottom-8 right-0 z-10 rounded-xl shadow-lg py-1 min-w-36 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
            >
              {variant === "trash" ? (
                <>
                  <button
                    onClick={() => { restoreNoteFromTrash(id); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    Restore
                  </button>
                  <button
                    onClick={() => { setConfirmAction({ action: "delete", noteId: id }); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Delete Forever
                  </button>
                </>
              ) : variant === "archived" ? (
                <button
                  onClick={() => { unarchiveNote(id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                >
                  <Archive size={14} />
                  Unarchive
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setConfirmAction({ action: "archive", noteId: id }); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <Archive size={14} />
                    Archive
                  </button>
                  <button
                    onClick={() => { setConfirmAction({ action: "trash", noteId: id }); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default NoteCard;
