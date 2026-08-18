import { useContext, useMemo, useState } from "react";
import { Trash2, RotateCcw, CheckSquare, X } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";
import { NOTE_STATUS } from "../constants";

import NoteCard from "../components/NoteCard";
import LayoutToggle from "../components/LayoutToggle";
import NotesGrid from "../components/NotesGrid";

function Trash() {
  const { notes, restoreNotesFromTrash } = useContext(NotesContext);
  const { setConfirmAction } = useContext(UIContext);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const trashedNotes = useMemo(
    () =>
      notes
        .filter((note) => note.status === NOTE_STATUS.TRASHED)
        .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)),
    [notes],
  );

  const selectedCount = selectedIds.size;
  const allSelected = trashedNotes.length > 0 && selectedCount === trashedNotes.length;

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds(allSelected ? new Set() : new Set(trashedNotes.map((note) => note.id)));
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function handleRestoreSelected() {
    restoreNotesFromTrash(Array.from(selectedIds));
    exitSelectMode();
  }

  function handleDeleteSelected() {
    setConfirmAction({
      action: "deleteMany",
      noteIds: Array.from(selectedIds),
      onAfterConfirm: exitSelectMode,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Trash2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        <h1 className="font-bold text-4xl text-gray-500 dark:text-gray-400">Trash</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <LayoutToggle />

        {trashedNotes.length > 0 && (
          selectMode ? (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer accent-amber-500"
                />
                Select all
              </label>

              {selectedCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{selectedCount} selected</span>
                  <button
                    onClick={handleRestoreSelected}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer bg-orange-100 hover:bg-orange-200 dark:bg-amber-900 dark:hover:bg-amber-800 transition"
                  >
                    <RotateCcw size={14} />
                    Restore All
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                    Delete All
                  </button>
                </div>
              )}

              <button
                onClick={exitSelectMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
              >
                <X size={14} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setSelectMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
            >
              <CheckSquare size={14} />
              Select
            </button>
          )
        )}
      </div>

      {trashedNotes.length === 0 ? (
        <p className="text-gray-500 italic">No notes in trash.</p>
      ) : (
        <NotesGrid>
          {trashedNotes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              variant="trash"
              selectable={selectMode}
              selected={selectedIds.has(note.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </NotesGrid>
      )}
    </div>
  );
}

export default Trash;
