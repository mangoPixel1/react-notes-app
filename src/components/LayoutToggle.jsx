import { useContext } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { UIContext } from "../contexts/UIContext";

function LayoutToggle() {
  const { notesLayout, setNotesLayout } = useContext(UIContext);
  return (
    <button
      onClick={() => setNotesLayout(notesLayout === "list" ? "grid" : "list")}
      className="cursor-pointer"
    >
      {notesLayout === "list" ? (
        <LayoutGrid className="w-6 h-6 text-gray-500" />
      ) : (
        <LayoutList className="w-6 h-6 text-gray-500" />
      )}
    </button>
  );
}

export default LayoutToggle;
