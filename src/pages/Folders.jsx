import { useState, useContext } from "react";
import { Link } from "react-router";
import { FolderClosed, LayoutGrid, LayoutList } from "lucide-react";

// Context imports for notes and UI state
import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

function Folders() {
  const { notesLayout, setNotesLayout } = useContext(UIContext);
  const { folders, deleteFolder, editFolder, addFolder } =
    useContext(NotesContext);

  // Local state for editing: tracks which folder is being edited and the new name
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");

  // Handler to start editing a folder: sets editing state and pre-fills name
  const handleEditClick = (folder) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  // Handler to add a new folder: creates folder with default name and starts editing
  const handleAddFolder = () => {
    const defaultFolderName = "New Folder Name";
    const newFolderId = addFolder(defaultFolderName);

    setEditingFolderId(newFolderId);
    setNewFolderName(defaultFolderName);
  };

  // Handler to save edited folder name: trims input, saves, and resets editing state
  const handleSave = (id) => {
    const folderName = newFolderName.trim() || "untitled folder";
    editFolder(id, folderName);
    setEditingFolderId(null);
    setNewFolderName("");
  };

  return (
    <div className="space-y-4">
      {/* Header section with title and add button */}
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
      {/* Layout toggle button */}
      <div className="flex gap-4">
        <button
          onClick={() =>
            setNotesLayout(notesLayout === "list" ? "grid" : "list")
          }
          className="cursor-pointer"
        >
          {notesLayout === "list" ? (
            <LayoutGrid className="w-6 h-6 text-gray-500" />
          ) : (
            <LayoutList className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>
      {/* Conditional rendering: empty state or folder list */}
      {folders.length === 0 ? (
        <p className="text-gray-500">No folders yet.</p>
      ) : (
        <div
          className={`grid gap-4 ${
            notesLayout === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : ""
          }`}
        >
          {/* Map over folders to render each one */}
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex justify-between bg-white p-4 rounded-lg shadow"
            >
              {/* Conditional rendering: input for editing or display name */}
              {editingFolderId === folder.id ? (
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={() => handleSave(folder.id)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave(folder.id);
                    }
                  }}
                  autoFocus
                  className="font-bold text-xl text-gray-800 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <h2 className="font-bold text-xl text-gray-800 cursor-pointer">
                  <Link to={`/folders/${folder.id}`}>{folder.name}</Link>
                </h2>
              )}
              {/* Action buttons: edit and delete */}
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
