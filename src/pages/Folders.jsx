import React from "react";
import { FolderClosed } from "lucide-react";

function Folders() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="font-bold text-4xl text-gray-500">Folders</h1>
      <FolderClosed className="w-16 h-16 text-gray-400" />
    </div>
  );
}

export default Folders;
