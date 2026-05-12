import { Outlet } from "react-router";
import Header from "../components/Header";
import NewNoteModal from "../components/NewNoteModal";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <NewNoteModal />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
