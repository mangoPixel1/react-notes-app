import { useContext, useState } from "react";
import { Link } from "react-router";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { AuthContext } from "../contexts/AuthContext";
import { UIContext } from "../contexts/UIContext";

import {
  Menu,
  House,
  FolderClosed,
  Archive,
  Trash2,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

function NavLink({ to, label, tooltipProps, onNavigate, isExpanded, children }) {
  return (
    <Link
      to={to}
      {...tooltipProps}
      data-tooltip-content={label}
      onClick={onNavigate}
      className={`
        w-full rounded-xl p-3 flex gap-3
        hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
        ${!isExpanded && "md:w-auto md:rounded-full"}
      `}
    >
      {children}
      <span className={`ml-2 ${!isExpanded && "md:hidden"}`}>{label}</span>
    </Link>
  );
}

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { user, signOut } = useContext(AuthContext);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useContext(UIContext);

  const tooltipProps = !isExpanded ? { "data-tooltip-id": "sidebar-tooltip" } : {};
  const displayName = user?.email ?? "";

  function handleMenuClick() {
    setIsExpanded((prev) => !prev);
    setMobileSidebarOpen(false);
  }

  function closeMobile() {
    setMobileSidebarOpen(false);
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          shrink-0 overflow-hidden bg-orange-200 dark:bg-amber-900 p-4
          flex flex-col gap-6 h-screen items-start
          fixed inset-y-0 left-0 z-40 w-56
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:sticky md:top-0 md:self-start md:translate-x-0 md:transition-[width]
          ${isExpanded ? "md:w-44 md:items-start" : "md:w-16 md:items-center"}
        `}
      >
        <div
          className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition cursor-pointer shrink-0"
          onClick={handleMenuClick}
        >
          <Menu className="w-7 h-7 text-amber-600" />
        </div>

        <div className="w-full flex flex-col gap-3 items-center">
          <NavLink to="/dashboard" label="Home" tooltipProps={tooltipProps} onNavigate={closeMobile} isExpanded={isExpanded}>
            <House className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
          <NavLink to="/folders" label="Folders" tooltipProps={tooltipProps} onNavigate={closeMobile} isExpanded={isExpanded}>
            <FolderClosed className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
          <NavLink to="/archived" label="Archived" tooltipProps={tooltipProps} onNavigate={closeMobile} isExpanded={isExpanded}>
            <Archive className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
          <NavLink to="/trash" label="Trash" tooltipProps={tooltipProps} onNavigate={closeMobile} isExpanded={isExpanded}>
            <Trash2 className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
        </div>

        <div className="w-full flex flex-col gap-3 items-center mt-auto">
          <Link
            to="/profile"
            {...tooltipProps}
            data-tooltip-content={displayName}
            onClick={closeMobile}
            className={`
              w-full rounded-xl p-3 flex gap-3
              hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
              ${!isExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            <UserRound className="w-6 h-6 text-amber-600 shrink-0" />
            <span className={`ml-2 truncate text-sm ${!isExpanded && "md:hidden"}`}>
              {displayName}
            </span>
          </Link>

          <Link
            to="/settings"
            {...tooltipProps}
            data-tooltip-content="Settings"
            onClick={closeMobile}
            className={`
              w-full rounded-xl p-3 flex gap-3
              hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
              ${!isExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            <Settings className="w-6 h-6 text-amber-600 shrink-0" />
            <span className={`ml-2 ${!isExpanded && "md:hidden"}`}>Settings</span>
          </Link>

          <button
            onClick={() => { signOut(); closeMobile(); }}
            {...tooltipProps}
            data-tooltip-content="Sign out"
            className={`
              w-full rounded-xl p-3 flex gap-3
              hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
              ${!isExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            <LogOut className="w-6 h-6 text-amber-600 shrink-0" />
            <span className={`ml-2 ${!isExpanded && "md:hidden"}`}>Sign out</span>
          </button>
        </div>
      </aside>

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
