import { useContext } from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import NewNoteModal from "../components/NewNoteModal";
import Sidebar from "../components/Sidebar";
import { UIContext } from "../contexts/UIContext";

export default function AppLayout() {
  const { notesLayout } = useContext(UIContext);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <NewNoteModal />

        <main className="flex-1 p-6">
          <div
            className={
              notesLayout === "grid" ? "max-w-7xl mx-auto" : "max-w-2xl mx-auto"
            }
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
