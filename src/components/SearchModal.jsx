import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon, X } from "lucide-react";

import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";
import { NOTE_STATUS } from "../constants";

const PREVIEW_LENGTH = 80;

function SearchModal() {
  const { searchOpen, setSearchOpen, isDark } = useContext(UIContext);
  const { notes } = useContext(NotesContext);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    if (searchOpen) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [searchOpen]);

  function close() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleSelect(note) {
    close();
    navigate(`/note/${note.id}`);
  }

  if (!searchOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? notes
        .filter((n) => n.status === NOTE_STATUS.ACTIVE)
        .filter(
          (n) =>
            (n.title ?? "").toLowerCase().includes(trimmed) ||
            (n.body ?? "").toLowerCase().includes(trimmed),
        )
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.25)" }}
      onClick={close}
    >
      <div
        className={`w-full max-w-lg h-[480px] rounded-2xl shadow-2xl flex flex-col ${
          isDark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-orange-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div
          className={`shrink-0 flex items-center gap-3 px-4 py-3 ${
            isDark ? "border-b border-zinc-700" : "border-b border-orange-100"
          }`}
        >
          <SearchIcon className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-base ${
              isDark
                ? "text-zinc-100 placeholder-zinc-500"
                : "text-zinc-700 placeholder-zinc-400"
            }`}
          />
          {query && (
            <button
              onClick={close}
              className="p-0.5 rounded-full hover:bg-orange-100 dark:hover:bg-zinc-700 transition"
            >
              <X className="w-5 h-5 text-amber-500" />
            </button>
          )}
        </div>

        {/* Results area — always fills remaining space */}
        <div className="flex-1 overflow-y-auto">
          {trimmed ? (
            <ul>
              {results.length === 0 ? (
                <li className={`px-4 py-8 text-center text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  No notes found for &ldquo;{query}&rdquo;
                </li>
              ) : (
                results.map((note) => (
                  <li
                    key={note.id}
                    onClick={() => handleSelect(note)}
                    className={`px-4 py-3 cursor-pointer transition ${
                      isDark
                        ? "hover:bg-zinc-700 border-b border-zinc-700 last:border-0"
                        : "hover:bg-orange-50 border-b border-orange-50 last:border-0"
                    }`}
                  >
                    <p className={`font-bold text-sm truncate ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                      {note.title?.trim() || "Untitled"}
                    </p>
                    {note.body?.trim() && (
                      <p className={`text-xs mt-0.5 truncate ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        {note.body.trim().slice(0, PREVIEW_LENGTH)}
                      </p>
                    )}
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
