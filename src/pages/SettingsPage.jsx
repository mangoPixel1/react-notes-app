import React from "react";
import { Settings } from "lucide-react";

function SettingsPage() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="font-bold text-4xl text-gray-500">Settings</h1>
        <Settings className="w-16 h-16 text-gray-400" />
      </div>
    </div>
  );
}

export default SettingsPage;
