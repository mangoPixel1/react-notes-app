import { useContext } from "react";
import { Routes, Route } from "react-router";

// Contexts
import { UIContext } from "../contexts/UIContext";

// Components
import Header from "./Header";
import Home from "../pages/Home";
import Note from "../pages/Note";

function MainContainer() {
  const { isDark } = useContext(UIContext);

  return (
    <div
      className={`${
        isDark && "dark"
      } bg-gray-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition duration-300 flex justify-center p-5 sm:px-10`}
    >
      <div className="w-full max-w-3xl ">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note/:id" element={<Note />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainContainer;
