import { useState, createContext } from "react";

// Components
import NotesView from "./components/NotesView";
import SingleNoteView from "./components/SingleNoteView";

export const UIContext = createContext();

export function UIProvider({ children }) {
  const views = [NotesView, SingleNoteView];
  const [currentViewIndex, setCurrentViewIndex] = useState(0); // set to NotesView by default

  const [addMode, setAddMode] = useState(false);

  return (
    <UIContext.Provider
      value={{
        views,
        currentViewIndex,
        setCurrentViewIndex,
        addMode,
        setAddMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
