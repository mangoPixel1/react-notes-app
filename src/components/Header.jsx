import { useContext } from "react";
import { Link, useLocation } from "react-router";

// Contexts
import { UIContext } from "../contexts/UIContext";

// Components
import Search from "./Search";

// Icons
import Logo from "../icons/Logo";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { RefreshCw } from "lucide-react";

function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/dashboard";

  const {
    isDark,
    setIsDark,
    notesLayout,
    setNotesLayout,
    addMode,
    setAddMode,
  } = useContext(UIContext);

  function toggleAddMode() {
    if (!addMode) {
      setAddMode(true);
    }
  }

  function toggleLayoutView() {
    notesLayout === "list" ? setNotesLayout("grid") : setNotesLayout("list");
  }

  return (
    <header className="px-6 py-3 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center">
            <Logo className="w-14 h-14 text-amber-500" />
          </Link>

          <Search />
        </div>

        <div className="space-x-2">
          {isHome && (
            <>
              <button
                className={`${
                  addMode && `hidden`
                } fixed bottom-10 right-5 sm:static rounded-4xl px-2 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300`}
              >
                <RefreshCw className="w-6 h-6 text-amber-500" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-2 py-2 rounded-4xl cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300"
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-amber-500" />
            ) : (
              <Moon className="w-6 h-6 text-amber-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

/* 
<header className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center">
            <Logo className="w-14 h-14 text-amber-500" />
          </Link>

          <Search />
        </div>

        <div className="space-x-2">
          {isHome && (
            <>
              <button
                onClick={toggleAddMode}
                className={`${
                  addMode && `hidden`
                } fixed bottom-10 right-5 sm:static bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300 dark:bg-zinc-600 dark:hover:bg-zinc-700`}
              >
                + New Note
              </button>
              <button
                onClick={toggleLayoutView}
                className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300 dark:bg-zinc-600 dark:hover:bg-zinc-700"
              >
                {`${notesLayout === "list" ? `Grid View` : `List View`}`}
              </button>
            </>
          )}
          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300 dark:bg-zinc-600 dark:hover:bg-zinc-700"
          >
            Theme
          </button>
        </div>
      </div>
    </header>

*/
