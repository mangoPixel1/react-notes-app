import { useContext } from "react";
import { Routes, Route } from "react-router";

// Contexts
import { UIContext } from "../contexts/UIContext";

// Layouts
import AppLayout from "../layouts/AppLayout";
import LandingLayout from "../layouts/LandingLayout";

// Components
import Header from "./Header";
import Home from "../pages/Home";
import Note from "../pages/Note";
import Landing from "../pages/Landing";

function MainContainer() {
  const { isDark } = useContext(UIContext);

  return (
    <div
      className={`${
        isDark && "dark"
      } bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition duration-300 flex justify-center p-5 sm:px-10`}
    >
      <div className="w-full flex justify-center">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="dashboard/note/:id" element={<Note />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default MainContainer;

/* 
return (
    <div
      className={`${
        isDark && "dark"
      } bg-gray-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition duration-300 flex justify-center p-5 sm:px-10`}
    >
      <div className="w-full max-w-3xl">
        <Routes>
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/note/:id" element={<Note />} />
          </Route>
        </Routes>
      </div>
    </div>
  );

*/
