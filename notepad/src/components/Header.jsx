import { useContext } from "react";

// Contexts
import { UIContext, useNavigateToNotesView } from "../UIContext";

function Header() {
  const {
    isDark,
    setIsDark,
    currentViewIndex,
    setCurrentViewIndex,
    setCurrentNoteID,
    addMode,
    setAddMode,
  } = useContext(UIContext);

  const navigateToNotesView = useNavigateToNotesView();

  function toggleAddMode() {
    if (!addMode) {
      setAddMode(true);
    }
  }

  function toggleView() {
    setCurrentViewIndex((prev) => (prev === 0 ? 1 : 0));
  }

  return (
    <header className="space-y-4">
      <div className="flex justify-between items-center">
        <h1
          onClick={navigateToNotesView}
          className="text-2xl font-medium cursor-pointer"
        >
          Notes
        </h1>
        <div className="space-x-2">
          {currentViewIndex === 0 && (
            <>
              <button
                onClick={toggleAddMode}
                className={`${
                  addMode && `hidden`
                } fixed bottom-10 right-5 sm:static bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300`}
              >
                + New Note
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300"
              >
                View
              </button>
            </>
          )}
          <button className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300">
            Theme
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
