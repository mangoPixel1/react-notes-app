import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";

function NotesGrid({ children }) {
  const { notesLayout } = useContext(UIContext);
  return (
    <div
      className={
        notesLayout === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 gap-2"
          : "space-y-4"
      }
    >
      {children}
    </div>
  );
}

export default NotesGrid;
