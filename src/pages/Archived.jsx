import React from "react";
import { Archive } from "lucide-react";

function Archived() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="font-bold text-4xl text-gray-500">Archived</h1>
      <Archive className="w-16 h-16 text-gray-400" />
    </div>
  );
}

export default Archived;
