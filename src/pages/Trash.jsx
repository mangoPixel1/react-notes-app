import React from "react";
import { Trash2 } from "lucide-react";

function Trash() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="font-bold text-4xl text-gray-500">Trash</h1>
      <Trash2 className="w-16 h-16 text-gray-400" />
    </div>
  );
}

export default Trash;
