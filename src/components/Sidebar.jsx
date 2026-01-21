import { useContext, useState } from "react";
import { UIContext } from "../contexts/UIContext";
import { Link } from "react-router";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
  const [isExpanded, setIsExpanded] = useState(true);

  const tooltipProps = !isExpanded
    ? { "data-tooltip-id": "sidebar-tooltip" }
    : {};

  return (
    <>
      <aside
        className={`shrink-0 overflow-hidden bg-orange-200 dark:bg-amber-900 p-4
  flex flex-col gap-6
  transition-[width] duration-300 ease-in-out
  ${isExpanded ? "w-44 items-start" : "w-16 items-center"}
`}
      >
        <div
          className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition cursor-pointer"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <Menu className="w-7 h-7 text-amber-600" />
        </div>

        <div className="w-full flex flex-col gap-3 items-center">
          <Link
            to="/dashboard"
            {...tooltipProps}
            data-tooltip-content="Home"
            className={`${isExpanded && "w-full rounded-xl"} p-3 flex gap-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full cursor-pointer`}
          >
            <House className="w-6 h-6 text-amber-600" />
            {isExpanded && <span className="ml-2">Home</span>}
          </Link>

          <Link
            to="/folders"
            {...tooltipProps}
            data-tooltip-content="Folders"
            className={`${isExpanded && "w-full rounded-xl"} p-3 flex gap-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full cursor-pointer`}
          >
            <FolderClosed className="w-6 h-6 text-amber-600" />
            {isExpanded && <span className="ml-2">Folders</span>}
          </Link>

          <Link
            to="/archived"
            {...tooltipProps}
            data-tooltip-content="Archived"
            className={`${isExpanded && "w-full rounded-xl"} p-3 flex gap-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full cursor-pointer`}
          >
            <Archive className="w-6 h-6 text-amber-600" />
            {isExpanded && <span className="ml-2">Archived</span>}
          </Link>

          <Link
            to="/trash"
            {...tooltipProps}
            data-tooltip-content="Trash"
            className={`${isExpanded && "w-full rounded-xl"} p-3 flex gap-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full cursor-pointer`}
          >
            <Trash2 className="w-6 h-6 text-amber-600" />
            {isExpanded && <span className="ml-2">Trash</span>}
          </Link>

          <Link
            to="/settings"
            {...tooltipProps}
            data-tooltip-content="Settings"
            className={`${isExpanded && "w-full rounded-xl"} p-3 flex gap-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full cursor-pointer`}
          >
            <Settings className="w-6 h-6 text-amber-600" />
            {isExpanded && <span className="ml-2">Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Tooltip instance */}
      {!isExpanded && (
        <Tooltip
          id="sidebar-tooltip"
          place="right"
          delayShow={100}
          className="z-50"
        />
      )}
    </>
  );
}

export default Sidebar;
