import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";

function NoteCardSkeleton() {
  const { isDark } = useContext(UIContext);

  const card = isDark ? "bg-zinc-700" : "bg-gray-100";
  const strong = isDark ? "bg-zinc-500" : "bg-gray-300";
  const mild = isDark ? "bg-zinc-600" : "bg-gray-200";

  return (
    <div className={`flex flex-col p-4 rounded-2xl shadow-md animate-pulse ${card}`}>
      <div className={`h-5 ${strong} rounded w-3/4 mb-2`} />
      <div className={`h-5 ${strong} rounded w-1/2 mb-4`} />

      <div className="space-y-2 mb-4">
        <div className={`h-3.5 ${mild} rounded w-full`} />
        <div className={`h-3.5 ${mild} rounded w-5/6`} />
        <div className={`h-3.5 ${mild} rounded w-4/6`} />
      </div>

      <div className="flex justify-between items-center mt-auto">
        <div className={`h-3 ${mild} rounded w-24`} />
        <div className={`h-6 w-6 ${mild} rounded-full`} />
      </div>
    </div>
  );
}


export default NoteCardSkeleton;
