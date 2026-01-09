import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";

// Icons
import {
  Menu,
  House,
  FolderClosed,
  Archive,
  Trash2,
  Settings,
} from "lucide-react";

function Sidebar() {
  const { isDark } = useContext(UIContext);

  return (
    <aside className="w-16 shrink-0 bg-orange-200 dark:bg-amber-900 p-4 flex flex-col items-center gap-6">
      <div className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition duration-200 cursor-pointer">
        <Menu className="w-7 h-7 text-amber-600 " />
      </div>

      <div className="flex flex-col gap-3 justify-center items-center">
        <div className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition duration-200 cursor-pointer">
          <House className="w-6 h-6 text-amber-600 " />
        </div>
        <div className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition duration-200 cursor-pointer">
          <FolderClosed className="w-6 h-6 text-amber-600 " />
        </div>
        <div className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition duration-200 cursor-pointer">
          <Archive className="w-6 h-6 text-amber-600 " />
        </div>
        <div className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition duration-200 cursor-pointer">
          <Trash2 className="w-6 h-6 text-amber-600 " />
        </div>
        <div className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition duration-200 cursor-pointer">
          <Settings className="w-6 h-6 text-amber-600 " />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
