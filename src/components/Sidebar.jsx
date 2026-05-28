import { useContext } from "react";
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
  Sun,
  Moon,
} from "lucide-react";

function NavLink({
  to,
  label,
  tooltipProps,
  onNavigate,
  sidebarExpanded,
  children,
}) {
  return (
    <Link
      to={to}
      {...tooltipProps}
      data-tooltip-content={label}
      onClick={onNavigate}
      className={`
        w-full rounded-xl p-3 flex gap-3
        hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
        ${!sidebarExpanded && "md:w-auto md:rounded-full"}
      `}
    >
      {children}
      <span className={`ml-2 ${!sidebarExpanded && "md:hidden"}`}>{label}</span>
    </Link>
  );
}

function Sidebar() {
  const { user, signOut } = useContext(AuthContext);
  const {
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarExpanded,
    setSidebarExpanded,
    isDark,
    setIsDark,
  } = useContext(UIContext);

  const tooltipProps = !sidebarExpanded
    ? { "data-tooltip-id": "sidebar-tooltip" }
    : {};
  const displayName = user?.email ?? "";

  function handleMenuClick() {
    setSidebarExpanded((prev) => !prev);
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

      {/* Fixed strip that stays pinned during Mac trackpad overscroll bounce */}
      <div
        aria-hidden="true"
        className={`hidden md:block fixed inset-y-0 left-0 bg-chrome z-30 transition-[width] duration-300 ease-in-out ${
          sidebarExpanded ? "w-44" : "w-16"
        }`}
      />

      <aside
        className={`
          shrink-0 overflow-hidden bg-chrome p-4
          flex flex-col gap-6 h-screen items-start
          fixed inset-y-0 left-0 z-40 w-56
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:sticky md:top-0 md:self-start md:translate-x-0 md:transition-[width]
          ${sidebarExpanded ? "md:w-44 md:items-start" : "md:w-16 md:items-center"}
        `}
      >
        <div
          className="p-3 hover:bg-orange-300 dark:hover:bg-amber-800 rounded-full transition cursor-pointer shrink-0"
          onClick={handleMenuClick}
        >
          <Menu className="w-7 h-7 text-amber-600" />
        </div>

        <div className="w-full flex flex-col gap-3 items-center">
          <NavLink
            to="/dashboard"
            label="Home"
            tooltipProps={tooltipProps}
            onNavigate={closeMobile}
            sidebarExpanded={sidebarExpanded}
          >
            <House className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
          <NavLink
            to="/folders"
            label="Folders"
            tooltipProps={tooltipProps}
            onNavigate={closeMobile}
            sidebarExpanded={sidebarExpanded}
          >
            <FolderClosed className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
          <NavLink
            to="/archived"
            label="Archived"
            tooltipProps={tooltipProps}
            onNavigate={closeMobile}
            sidebarExpanded={sidebarExpanded}
          >
            <Archive className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
          <NavLink
            to="/trash"
            label="Trash"
            tooltipProps={tooltipProps}
            onNavigate={closeMobile}
            sidebarExpanded={sidebarExpanded}
          >
            <Trash2 className="w-6 h-6 text-amber-600 shrink-0" />
          </NavLink>
        </div>

        <div className="w-full flex flex-col gap-3 items-center mt-auto">
          <button
            onClick={() => setIsDark(!isDark)}
            {...tooltipProps}
            data-tooltip-content={isDark ? "Light mode" : "Dark mode"}
            className={`
              w-full rounded-xl p-3 flex gap-3
              hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
              ${!sidebarExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-amber-600 shrink-0" />
            ) : (
              <Moon className="w-6 h-6 text-amber-600 shrink-0" />
            )}
            <span className={`ml-2 ${!sidebarExpanded && "md:hidden"}`}>
              {isDark ? "Light" : "Dark"}
            </span>
          </button>

          <Link
            to="/profile"
            {...tooltipProps}
            data-tooltip-content={displayName}
            onClick={closeMobile}
            className={`
              w-full rounded-xl p-3 flex gap-3
              hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
              ${!sidebarExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            <UserRound className="w-6 h-6 text-amber-600 shrink-0" />
            <span
              className={`ml-2 truncate text-sm ${!sidebarExpanded && "md:hidden"}`}
            >
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
              ${!sidebarExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            <Settings className="w-6 h-6 text-amber-600 shrink-0" />
            <span className={`ml-2 ${!sidebarExpanded && "md:hidden"}`}>
              Settings
            </span>
          </Link>

          <button
            onClick={() => {
              signOut();
              closeMobile();
            }}
            {...tooltipProps}
            data-tooltip-content="Sign out"
            className={`
              w-full rounded-xl p-3 flex gap-3
              hover:bg-orange-300 dark:hover:bg-amber-800 cursor-pointer
              ${!sidebarExpanded && "md:w-auto md:rounded-full"}
            `}
          >
            <LogOut className="w-6 h-6 text-amber-600 shrink-0" />
            <span className={`ml-2 ${!sidebarExpanded && "md:hidden"}`}>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {!sidebarExpanded && (
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
