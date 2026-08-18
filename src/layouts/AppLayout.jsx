import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import NewNoteModal from "../components/NewNoteModal";
import SearchModal from "../components/SearchModal";
import ActionConfirmationModal from "../components/ActionConfirmationModal";
import ToastContainer from "../components/ToastContainer";
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
  deleteAccount: {
    title: "Delete account?",
    description: "All of your notes and folders will be permanently deleted. This cannot be undone.",
    confirmLabel: "Delete Account",
    variant: "danger",
  },
};

export default function AppLayout() {
  const { setBodyVariant, confirmAction, setConfirmAction } = useContext(UIContext);
  const { archiveNote, moveNoteToTrash, deleteNote, deleteNotes } = useContext(NotesContext);

  function handleConfirm() {
    if (!confirmAction) return;
    const { action, noteId, noteIds, onAfterConfirm } = confirmAction;
    if (action === "archive") archiveNote(noteId);
    else if (action === "trash") moveNoteToTrash(noteId);
    else if (action === "delete") deleteNote(noteId);
    else if (action === "deleteMany") deleteNotes(noteIds);
    else if (action === "deleteAccount") confirmAction.onConfirm?.();
    setConfirmAction(null);
    onAfterConfirm?.();
  }

  const config =
    confirmAction?.action === "deleteMany"
      ? {
          title: "Delete notes permanently?",
          description: `${confirmAction.noteIds.length} note${
            confirmAction.noteIds.length === 1 ? "" : "s"
          } will be deleted forever and cannot be recovered.`,
          confirmLabel: "Delete Forever",
          variant: "danger",
        }
      : confirmAction
        ? ACTION_CONFIG[confirmAction.action]
        : {};

  useEffect(() => {
    setBodyVariant("app");
    return () => setBodyVariant("landing");
  }, [setBodyVariant]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <ToastContainer />

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
