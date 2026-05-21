import { useContext } from "react";
import { X } from "lucide-react";

// Contexts
import { UIContext } from "../contexts/UIContext";

function Search({ searchValue, onChange, autoFocus = false }) {
  const { isDark } = useContext(UIContext);

  return (
    <div className="relative flex items-center w-full">
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search notes..."
        autoFocus={autoFocus}
        className={`w-full h-10 rounded-md px-6 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 ${
          searchValue ? "pr-8" : ""
        } ${
          isDark
            ? "bg-amber-950 text-gray-300 placeholder-amber-700"
            : "bg-orange-100 text-gray-600 placeholder-orange-400"
        }`}
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
      />
      {searchValue && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 p-0.5 rounded-full hover:bg-orange-200 dark:hover:bg-amber-800 transition"
        >
          <X className="w-4 h-4 text-amber-500" />
        </button>
      )}
    </div>
  );
}

export default Search;
