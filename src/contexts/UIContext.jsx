import { useState, useEffect, useRef, createContext } from "react";

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

function getSystemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;
}

export function UIProvider({ children }) {
  const [theme, setTheme] = useState(() => readStorage("ui:theme", "system"));
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);
  const isDark = theme === "system" ? systemPrefersDark : theme === "dark";
  const setIsDark = (value) => setTheme(value ? "dark" : "light");
  const [notesLayout, setNotesLayout] = useState(() => readStorage("ui:notesLayout", "grid"));
  const [defaultNoteColor, setDefaultNoteColor] = useState(() => readStorage("ui:defaultNoteColor", "yellow"));
  const [defaultSortOrder, setDefaultSortOrder] = useState(() => readStorage("ui:defaultSortOrder", "date-created-newest"));
  const [sidebarExpanded, setSidebarExpanded] = useState(() => readStorage("ui:sidebarExpanded", true));
  const [addMode, setAddMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [bodyVariant, setBodyVariant] = useState("landing");
  const [toasts, setToasts] = useState([]);
  const toastTimeouts = useRef({});

  function removeToast(id) {
    clearTimeout(toastTimeouts.current[id]);
    delete toastTimeouts.current[id];
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function addToast({ message, actionLabel, onAction, duration = 5000 }) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, actionLabel, onAction }]);
    toastTimeouts.current[id] = setTimeout(() => removeToast(id), duration);
    return id;
  }

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setSystemPrefersDark(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const body = document.body;
    if (bodyVariant === "app") {
      body.classList.remove("bg-white", "bg-zinc-800");
      body.classList.add("bg-chrome");
    } else {
      body.classList.remove("bg-chrome");
      body.classList.toggle("bg-zinc-800", isDark);
      body.classList.toggle("bg-white", !isDark);
    }
  }, [isDark, bodyVariant]);

  useEffect(() => {
    try { localStorage.setItem("ui:theme", JSON.stringify(theme)); } catch (e) { void e; }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem("ui:notesLayout", JSON.stringify(notesLayout)); } catch (e) { void e; }
  }, [notesLayout]);

  useEffect(() => {
    try { localStorage.setItem("ui:defaultNoteColor", JSON.stringify(defaultNoteColor)); } catch (e) { void e; }
  }, [defaultNoteColor]);

  useEffect(() => {
    try { localStorage.setItem("ui:defaultSortOrder", JSON.stringify(defaultSortOrder)); } catch (e) { void e; }
  }, [defaultSortOrder]);

  useEffect(() => {
    try { localStorage.setItem("ui:sidebarExpanded", JSON.stringify(sidebarExpanded)); } catch (e) { void e; }
  }, [sidebarExpanded]);

  useEffect(() => {
    const timeouts = toastTimeouts.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        setIsDark,
        notesLayout,
        setNotesLayout,
        defaultNoteColor,
        setDefaultNoteColor,
        defaultSortOrder,
        setDefaultSortOrder,
        sidebarExpanded,
        setSidebarExpanded,
        addMode,
        setAddMode,
        searchValue,
        setSearchValue,
        searchOpen,
        setSearchOpen,
        confirmAction,
        setConfirmAction,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        setBodyVariant,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
