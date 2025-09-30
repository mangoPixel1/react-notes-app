import { useState, createContext } from "react";

export const UIContext = createContext();

const NOTES_VIEW_INDEX = 0; // All notes (default)
const SINGLE_NOTE_VIEW = 1;

const views = [NotesView, SingleNoteView];
const [currentViewIndex, setCurrentViewIndex] = useState(NOTES_VIEW_INDEX);
const CurrentView = views[currentViewIndex];

const [addMode, setAddMode] = useState(false);

export function UIProvider(children) {
  return <UIContext.Provider>{children}</UIContext.Provider>;
}
