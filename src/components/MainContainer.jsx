import { useContext } from "react";

// Contexts
import { UIContext } from "../UIContext";

// Components
import Header from "./Header";
import View from "./View";

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
        <View />
      </div>
    </div>
  );
}

export default MainContainer;
