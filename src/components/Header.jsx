import { useContext } from "react";
import { Link, useLocation } from "react-router";

import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";
import { ADD_NOTE_PATHS } from "../constants";

import Logo from "../icons/Logo";
import {
  RefreshCw,
  CirclePlus,
  Menu,
  Search as SearchIcon,
} from "lucide-react";

function Header() {
  const location = useLocation();
  const canAddNote = ADD_NOTE_PATHS.includes(location.pathname);

  const { addMode, setAddMode, setMobileSidebarOpen, setSearchOpen } =
    useContext(UIContext);
  const { refreshNotes, isLoading } = useContext(NotesContext);

  function toggleAddMode() {
    if (!addMode) {
      setAddMode(true);
    }
  }

  return (
    <header className="px-6 py-3 bg-chrome">
      <div className="relative flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-full hover:bg-orange-50 dark:hover:bg-orange-950 transition"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-amber-500" />
          </button>

          <Link to="/dashboard" className="flex items-center">
            <Logo className="w-14 h-14 text-amber-500" />
          </Link>
        </div>

        {/* Search trigger — desktop only, acts as a button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 w-[45%] max-w-xl h-10 rounded-2xl px-4 cursor-pointer transition duration-200 border border-orange-200 dark:border-amber-800 hover:ring-2 hover:ring-amber-400 bg-white dark:bg-zinc-800 text-orange-400 dark:text-amber-600"
        >
          <SearchIcon className="w-4 h-4 shrink-0" />
          <span className="text-sm">Search notes…</span>
        </button>

        <div className="flex gap-2 items-center">
          <button
            className="md:hidden px-2 py-2 rounded-4xl cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon className="w-6 h-6 text-amber-500" />
          </button>
          {canAddNote && (
            <button
              onClick={toggleAddMode}
              className="px-2 py-2 rounded-4xl cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300"
            >
              <CirclePlus className="w-6 h-6 text-amber-500" />
            </button>
          )}
          <button
            onClick={refreshNotes}
            disabled={isLoading}
            className="rounded-4xl px-2 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-6 h-6 text-amber-500 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
