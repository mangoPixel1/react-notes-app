import { useState, useEffect, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UIContext = createContext();

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function UIProvider({ children }) {
  const [isDark, setIsDark] = useState(() => readStorage("ui:isDark", false));
  const [notesLayout, setNotesLayout] = useState(() => readStorage("ui:notesLayout", "grid"));
  const [sidebarExpanded, setSidebarExpanded] = useState(() => readStorage("ui:sidebarExpanded", true));
  const [addMode, setAddMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle("bg-zinc-800", isDark);
    body.classList.toggle("bg-white", !isDark);
  }, [isDark]);

  useEffect(() => {
    try { localStorage.setItem("ui:isDark", JSON.stringify(isDark)); } catch (e) { void e; }
  }, [isDark]);

  useEffect(() => {
    try { localStorage.setItem("ui:notesLayout", JSON.stringify(notesLayout)); } catch (e) { void e; }
  }, [notesLayout]);

  useEffect(() => {
    try { localStorage.setItem("ui:sidebarExpanded", JSON.stringify(sidebarExpanded)); } catch (e) { void e; }
  }, [sidebarExpanded]);

  return (
    <UIContext.Provider
      value={{
        isDark,
        setIsDark,
        notesLayout,
        setNotesLayout,
        sidebarExpanded,
        setSidebarExpanded,
        addMode,
        setAddMode,
        searchValue,
        setSearchValue,
        searchOpen,
        setSearchOpen,
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
