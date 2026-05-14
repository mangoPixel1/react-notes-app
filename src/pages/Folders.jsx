import { useState, useContext } from "react";
import { Folder, FolderPlus, FolderClosed } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

import LayoutToggle from "../components/LayoutToggle";
import FolderCard from "../components/FolderCard";

function Folders() {
  const { notesLayout, isDark } = useContext(UIContext);
  const { notes, folders, deleteFolder, editFolder, addFolder } =
    useContext(NotesContext);

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");

  const handleRename = (folder) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  const handleAddFolder = async () => {
    const defaultFolderName = "New Folder";
    const newFolderId = await addFolder(defaultFolderName);
    setEditingFolderId(newFolderId);
    setNewFolderName(defaultFolderName);
  };

  const handleSave = (id) => {
    const folderName = newFolderName.trim() || "Untitled Folder";
    editFolder(id, folderName);
    setEditingFolderId(null);
    setNewFolderName("");
  };

  const listView = notesLayout === "list";
  const gridClass = listView
    ? "space-y-2"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";

  const renameInput = (id) => (
    <input
      type="text"
      value={newFolderName}
      onChange={(e) => setNewFolderName(e.target.value)}
      onBlur={() => handleSave(id)}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => { if (e.key === "Enter") handleSave(id); }}
      autoFocus
      className={`w-full font-semibold text-base bg-transparent border-b focus:outline-none ${isDark ? "border-gray-500 text-gray-100" : "border-gray-400 text-gray-700"}`}
    />
  );

  return (
    <div className="space-y-4">
      <div className="h-8" />
      <div className="flex items-center gap-3">
        <FolderClosed className="w-9 h-9 text-gray-400" />
        <h1 className="font-bold text-4xl text-gray-500">Folders</h1>
      </div>

      <div className="flex gap-4">
        <LayoutToggle />
      </div>

      {folders.length === 0 && editingFolderId === null ? (
        <div className={gridClass}>
          <NewFolderButton isDark={isDark} listView={listView} onClick={handleAddFolder} />
        </div>
      ) : (
        <div className={gridClass}>
          {folders.map((folder) => {
            const noteCount = notes.filter((n) => n.folderId === folder.id).length;

            if (editingFolderId === folder.id) {
              return (
                <div
                  key={folder.id}
                  className={`relative rounded-2xl shadow-md backdrop-blur-sm p-5 pt-4 flex ${listView ? "flex-row items-center gap-3 px-4 py-3" : "flex-col items-center"} ${isDark ? "bg-zinc-800/60" : "bg-white"}`}
                >
                  {listView ? (
                    <>
                      <Folder className="w-8 h-8 shrink-0 text-amber-400" fill="currentColor" stroke="none" />
                      {renameInput(folder.id)}
                    </>
                  ) : (
                    <>
                      <Folder className="w-16 h-16 mt-2 text-amber-400" fill="currentColor" stroke="none" />
                      <div className="w-full px-2 mt-3 text-center">
                        {renameInput(folder.id)}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            return (
              <FolderCard
                key={folder.id}
                id={folder.id}
                name={folder.name}
                noteCount={noteCount}
                isDark={isDark}
                listView={listView}
                onRename={() => handleRename(folder)}
                onDelete={() => deleteFolder(folder.id)}
              />
            );
          })}
          <NewFolderButton isDark={isDark} listView={listView} onClick={handleAddFolder} />
        </div>
      )}
    </div>
  );
}

function NewFolderButton({ isDark, listView, onClick }) {
  if (listView) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${isDark ? "border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200" : "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600"}`}
      >
        <FolderPlus className="w-8 h-8 shrink-0" />
        <span className="font-medium text-sm">New Folder</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-colors aspect-square ${isDark ? "border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200" : "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600"}`}
    >
      <FolderPlus className="w-10 h-10" />
      <span className="font-medium text-sm">New Folder</span>
    </button>
  );
}

export default Folders;
