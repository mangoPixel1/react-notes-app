import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";

function FolderCard({ id, name, noteCount, isDark, onRename, onDelete, listView }) {
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

  const wrapperBase = `relative group rounded-2xl shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm border ${isDark ? "bg-zinc-800/60 border-zinc-700" : "bg-white border-gray-200"}`;
  const iconButtonBase = `p-1 rounded-full cursor-pointer transition-opacity duration-200 ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"}`;

  const menu = (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => { e.preventDefault(); setMenuOpen((prev) => !prev); }}
        title="More options"
        className={`${iconButtonBase} ${menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        <MoreVertical size={16} />
      </button>
      {menuOpen && (
        <div
          className={`absolute right-0 z-10 rounded-xl shadow-lg py-1 min-w-36 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
          style={{ top: "calc(100% + 4px)" }}
        >
          <button
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); onRename(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <Pencil size={14} />
            Rename
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); onDelete(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );

  if (listView) {
    return (
      <div className={`${wrapperBase} flex items-center gap-3 px-4 py-3`}>
        <Link to={`/folders/${id}`} className="flex items-center gap-3 flex-1 min-w-0">
          <Folder className="w-8 h-8 text-amber-400 shrink-0" fill="currentColor" stroke="none" />
          <span className={`font-semibold text-base truncate ${isDark ? "text-gray-100" : "text-gray-700"}`}>
            {name}
          </span>
          <span className="text-sm text-gray-400 shrink-0 ml-auto pr-2">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </span>
        </Link>
        {menu}
      </div>
    );
  }

  return (
    <div className={`${wrapperBase} flex flex-col items-center p-5 pt-4`}>
      <div className="absolute top-3 right-3">{menu}</div>
      <Link to={`/folders/${id}`} className="flex flex-col items-center gap-3 w-full">
        <Folder className="w-16 h-16 text-amber-400 mt-2" fill="currentColor" stroke="none" />
        <div className="text-center w-full px-2">
          <p className={`font-semibold text-base truncate ${isDark ? "text-gray-100" : "text-gray-700"}`}>
            {name}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default FolderCard;
