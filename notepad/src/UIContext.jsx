import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

// Components
import NotesView from "./components/NotesView";
import SingleNoteView from "./components/SingleNoteView";

export const UIContext = createContext();

export function UIProvider({ children }) {
  // Color theme of UI
  const [isDark, setIsDark] = useState(false);

  // The view to display on main section of app
  const views = [NotesView, SingleNoteView];
  const [currentViewIndex, setCurrentViewIndex] = useState(0); // set to NotesView by default

  // ID of note to display in SingleNoteView
  const [currentNoteID, setCurrentNoteID] = useState();

  // Visibility state of "add New Note" form in NotesView. Accessible in Header and NotesView
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.add("bg-zinc-800");
      body.classList.remove("bg-gray-50");
    } else {
      body.classList.add("bg-gray-50");
      body.classList.remove("bg-zinc-800");
    }
  }, [isDark]);

  useEffect(() => {
    setAddMode(false);
  }, [currentViewIndex]);

  return (
    <UIContext.Provider
      value={{
        isDark,
        setIsDark,
        views,
        currentViewIndex,
        setCurrentViewIndex,
        currentNoteID,
        setCurrentNoteID,
        addMode,
        setAddMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

// Custom hook to change view to NotesView
export function useNavigateToNotesView() {
  const { setCurrentNoteID, setCurrentViewIndex } = useContext(UIContext);

  const navigateToNotesView = useCallback(() => {
    setCurrentNoteID(null);
    setCurrentViewIndex(0); // set to NotesView
  }, [setCurrentNoteID, setCurrentViewIndex]);

  return navigateToNotesView;
}
