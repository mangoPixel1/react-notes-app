import { useContext } from "react";
import { Link, useLocation } from "react-router";

import { UIContext } from "../contexts/UIContext";
import { ADD_NOTE_PATHS } from "../constants";

import Search from "./Search";
import Logo from "../icons/Logo";
import { Sun, Moon, RefreshCw, CircleUserRound, CirclePlus } from "lucide-react";

function Header() {
  const location = useLocation();
  const canAddNote = ADD_NOTE_PATHS.includes(location.pathname);

  const { isDark, setIsDark, addMode, setAddMode, searchValue, setSearchValue } =
    useContext(UIContext);

  function toggleAddMode() {
    if (!addMode) {
      setAddMode(true);
    }
  }

  return (
    <header className="px-6 py-3 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center">
            <Logo className="w-14 h-14 text-amber-500" />
          </Link>

          <Search searchValue={searchValue} onChange={setSearchValue} />
        </div>

        <div className="flex gap-2">
          {canAddNote && (
            <button
              onClick={toggleAddMode}
              className="px-2 py-2 rounded-4xl cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300"
            >
              <CirclePlus className="w-6 h-6 text-amber-500" />
            </button>
          )}
          <button className="fixed bottom-10 right-5 sm:static rounded-4xl px-2 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition duration-300">
            <RefreshCw className="w-6 h-6 text-amber-500" />
          </button>
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
          <button className="px-2 py-2 rounded-4xl cursor-pointer hover:bg-gray-50 dark:hover:bg-orange-950 transition duration-300">
            <CircleUserRound className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
