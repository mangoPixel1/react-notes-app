import { useContext } from "react";
import { NotesContext } from "../NotesContext";

// Components
import Search from "./Search";

function Header() {
  const { addNote } = useContext(NotesContext);

  return (
    <header className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-medium">Notes</h1>
        <div className="space-x-2">
          <button className="fixed bottom-10 right-5 sm:static bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300">
            New Note
          </button>
          <button className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300">
            View
          </button>
          <button className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300">
            Theme
          </button>
        </div>
      </div>

      <Search />
    </header>
  );
}

export default Header;
