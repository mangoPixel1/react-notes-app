import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";

function NotesGrid({ children }) {
  const { notesLayout } = useContext(UIContext);

  if (notesLayout === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-3">{children}</div>
  );
}

export default NotesGrid;
