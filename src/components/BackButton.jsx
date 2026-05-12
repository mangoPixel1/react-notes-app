import { ArrowLeft } from "lucide-react";

function BackButton({ onClick, label }) {
  return (
    <div className="h-8 flex items-center">
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{label}</span>
      </button>
    </div>
  );
}

export default BackButton;
