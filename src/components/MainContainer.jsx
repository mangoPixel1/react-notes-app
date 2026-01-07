import { useContext } from "react";
import { Routes, Route } from "react-router";
import { UIContext } from "../contexts/UIContext";

// Layouts
import AppLayout from "../layouts/AppLayout";

// Pages
import Home from "../pages/Home";
import Note from "../pages/Note";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

function MainContainer() {
  const { isDark } = useContext(UIContext);

  return (
    <div
      className={`min-h-screen ${
        isDark && "dark"
      } bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-300`}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/note/:id" element={<Note />} />
        </Route>
      </Routes>
    </div>
  );
}

export default MainContainer;
