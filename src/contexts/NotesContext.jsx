import { useReducer, createContext } from "react";

// Allows components to access the context through useContext
export const NotesContext = createContext();

const initialState = {
  notesList: [
    {
      id: crypto.randomUUID(),
      creationDate: new Date("2025-03-14T09:32:00"),
      lastEdited: new Date("2025-03-15T14:47:00"),
      title: "Mushroom",
      body: "A gray vegetable with an earthy flavor.",
      color: "gray",
      pinned: false,
      status: "active",
      folderId: null,
      deletedAt: null,
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date("2025-04-02T11:20:00"),
      lastEdited: new Date("2025-04-04T10:45:00"),
      title: "Blueberry",
      body: "A small blue fruit high in antioxidants.",
      color: "blue",
      pinned: true,
      status: "active",
      folderId: null,
      deletedAt: null,
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date("2025-05-09T13:05:00"),
      lastEdited: new Date("2025-05-10T09:15:00"),
      title: "Carrot",
      body: "A crunchy orange vegetable good for eyesight.",
      color: "orange",
      pinned: false,
      status: "active",
      folderId: null,
      deletedAt: null,
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date("2025-06-18T16:42:00"),
      lastEdited: new Date("2025-06-19T08:30:00"),
      title: "Broccoli",
      body: "A green vegetable packed with vitamins.",
      color: "green",
      pinned: false,
      status: "active",
      folderId: null,
      deletedAt: null,
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date("2025-07-27T10:25:00"),
      lastEdited: new Date("2025-07-29T12:50:00"),
      title: "Apple",
      body: "A sweet red fruit, crisp and juicy.",
      color: "red",
      pinned: true,
      status: "active",
      folderId: null,
      deletedAt: null,
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date("2025-09-03T15:18:00"),
      lastEdited: new Date("2025-09-05T09:22:00"),
      title: "Banana",
      body: "A soft yellow fruit rich in potassium.",
      color: "yellow",
      pinned: false,
      status: "active",
      folderId: null,
      deletedAt: null,
    },
  ],
  foldersList: [
    {
      id: crypto.randomUUID(),
      name: "Recipes",
    },
    {
      id: crypto.randomUUID(),
      name: "Work",
    },
    {
      id: crypto.randomUUID(),
      name: "Personal",
    },
  ],
};

function notesReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTE": {
      const newDate = new Date();
      const noteObj = {
        id: crypto.randomUUID(),
        creationDate: newDate,
        lastEdited: newDate,
        title: action.payload.title,
        body: action.payload.body,
        color: action.payload.color,
        pinned: false,
        status: "active",
        folderId: null,
        deletedAt: null,
      };
      return { ...state, notesList: [...state.notesList, noteObj] };
    }

    case "EDIT_NOTE": {
      const newEditDate = new Date();
      const { id, title, body } = action.payload;

      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();

      if (!trimmedTitle && !trimmedBody) return state;

      const updatedNotes = state.notesList.map((note) =>
        note.id === id
          ? {
              ...note,
              lastEdited: newEditDate,
              title: trimmedTitle,
              body: trimmedBody,
            }
          : note,
      );
      return { ...state, notesList: updatedNotes };
    }

    case "ARCHIVE_NOTE": {
      const editDate = new Date();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, status: "archived", lastEdited: editDate }
            : note,
        ),
      };
    }

    case "UNARCHIVE_NOTE": {
      const editDate = new Date();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, status: "active", lastEdited: editDate }
            : note,
        ),
      };
    }

    case "PIN_NOTE": {
      const editDate = new Date();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, pinned: true, lastEdited: editDate }
            : note,
        ),
      };
    }

    case "UNPIN_NOTE": {
      const editDate = new Date();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, pinned: false, lastEdited: editDate }
            : note,
        ),
      };
    }

    // Note is not permanently deleted, but moved to trash. It can be restored or permanently deleted from there.
    case "MOVE_TO_TRASH": {
      const deleteDate = new Date();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? {
                ...note,
                status: "trashed",
                deletedAt: deleteDate,
                lastEdited: deleteDate,
              }
            : note,
        ),
      };
    }

    case "RESTORE_FROM_TRASH": {
      const editDate = new Date();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? {
                ...note,
                status: "active",
                deletedAt: null,
                lastEdited: editDate,
              }
            : note,
        ),
      };
    }

    // Permanently deletes note from state. This action is dispatched from Trash view when user chooses to permanently delete a note.
    case "DELETE_NOTE": {
      return {
        ...state,
        notesList: state.notesList.filter((note) => note.id !== action.payload),
      };
    }

    // Add a new folder to the foldersList in state.
    case "ADD_FOLDER": {
      const newFolder = {
        id: action.payload.id,
        name: action.payload.name,
      };
      return { ...state, foldersList: [...state.foldersList, newFolder] };
    }

    // Edit an existing folder in the foldersList in state.
    case "EDIT_FOLDER": {
      const updatedFolders = state.foldersList.map((folder) =>
        folder.id === action.payload.id
          ? { ...folder, name: action.payload.name }
          : folder,
      );
      return { ...state, foldersList: updatedFolders };
    }

    // Delete a folder from the foldersList in state. Does not delete the notes within that folder.
    case "DELETE_FOLDER": {
      return {
        ...state,
        foldersList: state.foldersList.filter(
          (folder) => folder.id !== action.payload,
        ),
      };
    }

    default:
      return state;
  }
}

// Makes context accessible to nested child components
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  function addNote(newNote) {
    dispatch({
      type: "ADD_NOTE",
      payload: {
        title: newNote.title,
        body: newNote.body,
        color: newNote.color,
      },
    });
  }

  function editNote(id, title, body) {
    dispatch({
      type: "EDIT_NOTE",
      payload: {
        id: id,
        title: title,
        body: body,
      },
    });
  }

  function archiveNote(id) {
    dispatch({
      type: "ARCHIVE_NOTE",
      payload: id,
    });
  }

  function unarchiveNote(id) {
    dispatch({
      type: "UNARCHIVE_NOTE",
      payload: id,
    });
  }

  function pinNote(id) {
    dispatch({
      type: "PIN_NOTE",
      payload: id,
    });
  }

  function unpinNote(id) {
    dispatch({
      type: "UNPIN_NOTE",
      payload: id,
    });
  }

  function moveNoteToTrash(id) {
    dispatch({
      type: "MOVE_TO_TRASH",
      payload: id,
    });
  }

  function restoreNoteFromTrash(id) {
    dispatch({
      type: "RESTORE_FROM_TRASH",
      payload: id,
    });
  }

  function deleteNote(id) {
    dispatch({
      type: "DELETE_NOTE",
      payload: id,
    });
  }

  function addFolder(name) {
    const id = crypto.randomUUID();
    dispatch({
      type: "ADD_FOLDER",
      payload: { id, name },
    });

    return id;
  }

  function editFolder(id, name) {
    dispatch({
      type: "EDIT_FOLDER",
      payload: { id, name },
    });
  }

  function deleteFolder(id) {
    dispatch({
      type: "DELETE_FOLDER",
      payload: id,
    });
  }

  return (
    <NotesContext.Provider
      value={{
        notes: state.notesList,
        folders: state.foldersList,
        addNote,
        editNote,
        archiveNote,
        unarchiveNote,
        pinNote,
        unpinNote,
        moveNoteToTrash,
        restoreNoteFromTrash,
        deleteNote,
        addFolder,
        editFolder,
        deleteFolder,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
