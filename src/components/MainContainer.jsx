import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";

// Layouts
import AppLayout from "../layouts/AppLayout";

// Components
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Dashboard from "../pages/Dashboard";
import Note from "../pages/Note";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Folders from "../pages/Folders";
import Folder from "../pages/Folder";
import Archived from "../pages/Archived";
import Trash from "../pages/Trash";
import Settings from "../pages/SettingsPage";
import Profile from "../pages/ProfilePage";

function MainContainer() {
  const { isDark } = useContext(UIContext);
  const { session } = useContext(AuthContext);

  return (
    <div
      className={`min-h-screen ${
        isDark && "dark"
      } bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-300`}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={session ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        {/* Add here: subpages for About, Contact, Help, etc. */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/note/:id" element={<Note />} />
            <Route path="/folders" element={<Folders />} />
            <Route path="/folders/:id" element={<Folder />} />
            <Route path="/archived" element={<Archived />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default MainContainer;
