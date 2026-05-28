import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import NewNoteModal from "../components/NewNoteModal";
import SearchModal from "../components/SearchModal";
import Sidebar from "../components/Sidebar";
import { UIContext } from "../contexts/UIContext";

export default function AppLayout() {
  const { setBodyVariant } = useContext(UIContext);

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

        <main className="flex-1 p-6 bg-white dark:bg-zinc-800 rounded-3xl mr-4 mb-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
