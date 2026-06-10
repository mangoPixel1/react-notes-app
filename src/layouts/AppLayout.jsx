import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import NewNoteModal from "../components/NewNoteModal";
import SearchModal from "../components/SearchModal";
import ActionConfirmationModal from "../components/ActionConfirmationModal";
import Sidebar from "../components/Sidebar";
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

const ACTION_CONFIG = {
  archive: {
    title: "Archive note?",
    description: "This note will be moved to your archive.",
    confirmLabel: "Archive",
    variant: "warning",
  },
  trash: {
    title: "Move to trash?",
    description: "This note will be moved to the trash.",
    confirmLabel: "Move to trash",
    variant: "danger",
  },
  delete: {
    title: "Delete permanently?",
    description: "This note will be deleted forever and cannot be recovered.",
    confirmLabel: "Delete Forever",
    variant: "danger",
  },
};

export default function AppLayout() {
  const { setBodyVariant, confirmAction, setConfirmAction } = useContext(UIContext);
  const { archiveNote, moveNoteToTrash, deleteNote } = useContext(NotesContext);

  function handleConfirm() {
    if (!confirmAction) return;
    const { action, noteId, onAfterConfirm } = confirmAction;
    if (action === "archive") archiveNote(noteId);
    else if (action === "trash") moveNoteToTrash(noteId);
    else if (action === "delete") deleteNote(noteId);
    setConfirmAction(null);
    onAfterConfirm?.();
  }

  const config = confirmAction ? ACTION_CONFIG[confirmAction.action] : {};

  useEffect(() => {
    setBodyVariant("app");
    return () => setBodyVariant("landing");
  }, [setBodyVariant]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col bg-chrome">
        <Header />
        <NewNoteModal />
        <SearchModal />
        <ActionConfirmationModal
          isOpen={!!confirmAction}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          {...config}
        />

        <main className="flex-1 p-6 bg-white dark:bg-zinc-800 rounded-3xl mr-4 mb-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
