import { useState, useEffect, createContext } from "react";

// Components
import NotesView from "./components/NotesView";
import SingleNoteView from "./components/SingleNoteView";

export const UIContext = createContext();

export function UIProvider({ children }) {
  const views = [NotesView, SingleNoteView];
  const [currentViewIndex, setCurrentViewIndex] = useState(0); // set to NotesView by default

  // ID of note to display in SingleNoteView
  const [currentNoteID, setCurrentNoteID] = useState();

  // Visibility state of add new note form in NotesView. Accessible in Header and NotesView
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    setAddMode(false);
  }, [currentViewIndex]);

  return (
    <UIContext.Provider
      value={{
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
