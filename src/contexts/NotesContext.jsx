import { useReducer, createContext } from "react";
import { NOTE_STATUS } from "../constants";

// eslint-disable-next-line react-refresh/only-export-components
export const NotesContext = createContext();

// Note shape: { id, title, body, color, pinned, status, folderId, creationDate, lastEdited, deletedAt }
// Dates are ISO 8601 strings. folderId and deletedAt are null when unset.
const initialState = {
  notesList: [],
  foldersList: [],
  isLoading: false,
  error: null,
};

function notesReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "ADD_NOTE": {
      const now = new Date().toISOString();
      const noteObj = {
        id: crypto.randomUUID(),
        creationDate: now,
        lastEdited: now,
        title: action.payload.title,
        body: action.payload.body,
        color: action.payload.color,
        pinned: false,
        status: NOTE_STATUS.ACTIVE,
        folderId: action.payload.folderId || null,
        deletedAt: null,
      };
      return { ...state, notesList: [...state.notesList, noteObj] };
    }

    case "EDIT_NOTE": {
      const { id, title, body } = action.payload;
      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();
      if (!trimmedTitle && !trimmedBody) return state;
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === id
            ? { ...note, lastEdited: new Date().toISOString(), title: trimmedTitle, body: trimmedBody }
            : note,
        ),
      };
    }

    case "ARCHIVE_NOTE":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, status: NOTE_STATUS.ARCHIVED, lastEdited: new Date().toISOString() }
            : note,
        ),
      };

    case "UNARCHIVE_NOTE":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, status: NOTE_STATUS.ACTIVE, lastEdited: new Date().toISOString() }
            : note,
        ),
      };

    case "PIN_NOTE":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, pinned: true, lastEdited: new Date().toISOString() }
            : note,
        ),
      };

    case "UNPIN_NOTE":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, pinned: false, lastEdited: new Date().toISOString() }
            : note,
        ),
      };

    case "MOVE_TO_TRASH": {
      const now = new Date().toISOString();
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, status: NOTE_STATUS.TRASHED, deletedAt: now, lastEdited: now }
            : note,
        ),
      };
    }

    case "RESTORE_FROM_TRASH":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload
            ? { ...note, status: NOTE_STATUS.ACTIVE, deletedAt: null, lastEdited: new Date().toISOString() }
            : note,
        ),
      };

    case "DELETE_NOTE":
      return {
        ...state,
        notesList: state.notesList.filter((note) => note.id !== action.payload),
      };

    case "ADD_FOLDER": {
      const newFolder = { id: action.payload.id, name: action.payload.name };
      return { ...state, foldersList: [...state.foldersList, newFolder] };
    }

    case "EDIT_FOLDER":
      return {
        ...state,
        foldersList: state.foldersList.map((folder) =>
          folder.id === action.payload.id
            ? { ...folder, name: action.payload.name }
            : folder,
        ),
      };

    // Deleting a folder unassigns its notes (sets folderId to null).
    case "DELETE_FOLDER":
      return {
        ...state,
        foldersList: state.foldersList.filter((folder) => folder.id !== action.payload),
        notesList: state.notesList.map((note) =>
          note.folderId === action.payload ? { ...note, folderId: null } : note,
        ),
      };

    case "ADD_NOTE_TO_FOLDER":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload.noteId
            ? { ...note, folderId: action.payload.folderId }
            : note,
        ),
      };

    case "REMOVE_NOTE_FROM_FOLDER":
      return {
        ...state,
        notesList: state.notesList.map((note) =>
          note.id === action.payload.noteId ? { ...note, folderId: null } : note,
        ),
      };

    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  async function addNote(newNote) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({
        type: "ADD_NOTE",
        payload: { title: newNote.title, body: newNote.body, color: newNote.color, folderId: newNote.folderId },
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function editNote(id, title, body) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "EDIT_NOTE", payload: { id, title, body } });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function archiveNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "ARCHIVE_NOTE", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function unarchiveNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "UNARCHIVE_NOTE", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function pinNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "PIN_NOTE", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function unpinNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "UNPIN_NOTE", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function moveNoteToTrash(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "MOVE_TO_TRASH", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function restoreNoteFromTrash(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "RESTORE_FROM_TRASH", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function deleteNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "DELETE_NOTE", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function addFolder(name) {
    const id = crypto.randomUUID();
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "ADD_FOLDER", payload: { id, name } });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
    return id;
  }

  async function editFolder(id, name) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "EDIT_FOLDER", payload: { id, name } });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function deleteFolder(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "DELETE_FOLDER", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function addNoteToFolder(noteId, folderId) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "ADD_NOTE_TO_FOLDER", payload: { noteId, folderId } });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function removeNoteFromFolder(noteId) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "REMOVE_NOTE_FROM_FOLDER", payload: { noteId } });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes: state.notesList,
        folders: state.foldersList,
        isLoading: state.isLoading,
        error: state.error,
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
        addNoteToFolder,
        removeNoteFromFolder,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
