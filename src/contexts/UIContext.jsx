import { useState, useEffect, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UIContext = createContext();

export function UIProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [notesLayout, setNotesLayout] = useState("grid");
  const [addMode, setAddMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
