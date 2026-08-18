import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { UIContext } from "../contexts/UIContext";
import { AuthContext } from "../contexts/AuthContext";

// Layouts
import AppLayout from "../layouts/AppLayout";
import LandingLayout from "../layouts/LandingLayout";

// Components
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Dashboard from "../pages/Dashboard";
import Note from "../pages/Note";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Folders from "../pages/Folders";
import Folder from "../pages/Folder";
import Archived from "../pages/Archived";
import Trash from "../pages/Trash";
import Settings from "../pages/SettingsPage";

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
        <Route element={<LandingLayout />}>
          <Route
            path="/login"
            element={session ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={session ? <Navigate to="/dashboard" replace /> : <Signup />}
          />
          <Route
            path="/forgot-password"
            element={session ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        {/* Add here: subpages for About, Contact, Help, etc. */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/note/:id" element={<Note />} />
            <Route path="/folders" element={<Folders />} />
            <Route path="/folders/:id" element={<Folder />} />
            <Route path="/archived" element={<Archived />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default MainContainer;
