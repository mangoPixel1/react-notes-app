import { useContext } from "react";
import { Link, useLocation } from "react-router";

// Contexts
import { UIContext } from "../contexts/UIContext";
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
    <header className="space-y-4">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">
          <h1 className="text-2xl font-medium cursor-pointer">Notes</h1>
        </Link>

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
  );
}

export default Header;

/* 
function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

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
    <header className="space-y-4">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-medium cursor-pointer">Notes</h1>
        </Link>

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
  );
}

*/
