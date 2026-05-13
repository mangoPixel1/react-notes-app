import { useState, useContext } from "react";
import { Link } from "react-router";
import { FolderClosed } from "lucide-react";

import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

import LayoutToggle from "../components/LayoutToggle";

function Folders() {
  const { notesLayout, isDark } = useContext(UIContext);
  const { notes, folders, deleteFolder, editFolder, addFolder } =
    useContext(NotesContext);

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");

  const handleEditClick = (folder) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  const handleAddFolder = async () => {
    const defaultFolderName = "New Folder Name";
    const newFolderId = await addFolder(defaultFolderName);
    setEditingFolderId(newFolderId);
    setNewFolderName(defaultFolderName);
  };

  const handleSave = (id) => {
    const folderName = newFolderName.trim() || "untitled folder";
    editFolder(id, folderName);
    setEditingFolderId(null);
    setNewFolderName("");
  };

  return (
    <div className="space-y-4">
      <div className="h-8" />
      <div className="flex items-center gap-4">
        <FolderClosed className="w-10 h-10 text-gray-400" />
        <h1 className="font-bold text-4xl text-gray-500">Folders</h1>
        <button
          onClick={handleAddFolder}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Add New Folder
        </button>
      </div>

      <div className="flex gap-4">
        <LayoutToggle />
      </div>

      {folders.length === 0 ? (
        <p className="text-gray-500">No folders yet.</p>
      ) : (
        <div
          className={
            notesLayout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={
                isDark
                  ? "flex justify-between bg-zinc-700 p-4 rounded-lg shadow"
                  : "flex justify-between bg-white p-4 rounded-lg shadow"
              }
            >
              {editingFolderId === folder.id ? (
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={() => handleSave(folder.id)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave(folder.id);
                  }}
                  autoFocus
                  className="font-bold text-xl text-gray-800 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <h2 className="font-semibold text-lg text-gray-600 cursor-pointer">
                  <Link to={`/folders/${folder.id}`}>
                    {`${folder.name} (${notes.filter((note) => note.folderId === folder.id).length})`}
                  </Link>
                </h2>
              )}
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(folder)}
                  className="cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFolder(folder.id)}
                  className="cursor-pointer text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Folders;
