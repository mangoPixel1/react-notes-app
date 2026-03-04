import { useState, useEffect, createContext } from "react";

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [notesLayout, setNotesLayout] = useState("grid");
  const [addMode, setAddMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const body = document.body;
    body.classList.toggle("bg-zinc-800", isDark);
    body.classList.toggle("bg-white", !isDark);
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
        searchValue,
        setSearchValue,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
