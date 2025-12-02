import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

export const UIContext = createContext();

export function UIProvider({ children }) {
  // Color theme of UI
  const [isDark, setIsDark] = useState(false);

  // Layout of NotesView (default: list)
  const [notesLayout, setNotesLayout] = useState("list");

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

  return (
    <UIContext.Provider
      value={{
        isDark,
        setIsDark,
        notesLayout,
        setNotesLayout,
        addMode,
        setAddMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
