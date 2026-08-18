import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { NOTE_STATUS } from "../constants";
import { supabase } from "../lib/supabase";
import { toFolder, toNote } from "../utils/mappers";
import { AuthContext } from "./AuthContext";
import { UIContext } from "./UIContext";

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

export function notesReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_NOTES":
      return { ...state, notesList: action.payload };
    case "SET_FOLDERS":
      return { ...state, foldersList: action.payload };
    case "ADD_NOTE":
      return { ...state, notesList: [action.payload, ...state.notesList] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notesList: state.notesList.map((n) =>
          n.id === action.payload.id ? action.payload : n,
        ),
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notesList: state.notesList.filter((n) => n.id !== action.payload),
      };
    case "UPDATE_NOTES": {
      const updatedById = new Map(action.payload.map((n) => [n.id, n]));
      return {
        ...state,
        notesList: state.notesList.map((n) => updatedById.get(n.id) ?? n),
      };
    }
    case "DELETE_NOTES": {
      const idsToDelete = new Set(action.payload);
      return {
        ...state,
        notesList: state.notesList.filter((n) => !idsToDelete.has(n.id)),
      };
    }
    case "ADD_FOLDER":
      return { ...state, foldersList: [...state.foldersList, action.payload] };
    case "UPDATE_FOLDER":
      return {
        ...state,
        foldersList: state.foldersList.map((f) =>
          f.id === action.payload.id ? action.payload : f,
        ),
      };
    // Deleting a folder unassigns its notes (sets folderId to null).
    case "DELETE_FOLDER":
      return {
        ...state,
        foldersList: state.foldersList.filter((f) => f.id !== action.payload),
        notesList: state.notesList.map((n) =>
          n.folderId === action.payload ? { ...n, folderId: null } : n,
        ),
      };
    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(UIContext);
  const userId = user?.id ?? null;

  const fetchData = useCallback(async () => {
    if (!userId) {
      dispatch({ type: "SET_NOTES", payload: [] });
      dispatch({ type: "SET_FOLDERS", payload: [] });
      return;
    }
    setIsInitialLoad(true);
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [notesRes, foldersRes] = await Promise.all([
        supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("folders")
          .select("*")
          .order("created_at", { ascending: true }),
      ]);
      if (notesRes.error) throw notesRes.error;
      if (foldersRes.error) throw foldersRes.error;
      dispatch({ type: "SET_NOTES", payload: notesRes.data.map(toNote) });
      dispatch({
        type: "SET_FOLDERS",
        payload: foldersRes.data.map(toFolder),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      setIsInitialLoad(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function addNote(newNote) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          title: newNote.title,
          body: newNote.body,
          color: newNote.color,
          status: NOTE_STATUS.ACTIVE,
          pinned: false,
          folder_id: newNote.folderId ?? null,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "ADD_NOTE", payload: toNote(data) });
      addToast({
        message: "Note added",
        actionLabel: "Undo",
        onAction: () => moveNoteToTrash(data.id),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function editNote(id, title, body) {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle && !trimmedBody) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: trimmedTitle,
          body: trimmedBody,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function archiveNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          status: NOTE_STATUS.ARCHIVED,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
      addToast({
        message: "Note archived",
        actionLabel: "Undo",
        onAction: () => unarchiveNote(id),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function unarchiveNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          status: NOTE_STATUS.ACTIVE,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
      addToast({
        message: "Note unarchived",
        actionLabel: "Undo",
        onAction: () => archiveNote(id),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function pinNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ pinned: true, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function unpinNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ pinned: false, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function moveNoteToTrash(id) {
    const now = new Date().toISOString();
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          status: NOTE_STATUS.TRASHED,
          deleted_at: now,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
      addToast({
        message: "Note moved to trash",
        actionLabel: "Undo",
        onAction: () => restoreNoteFromTrash(id),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function restoreNoteFromTrash(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          status: NOTE_STATUS.ACTIVE,
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
      addToast({
        message: "Note restored",
        actionLabel: "Undo",
        onAction: () => moveNoteToTrash(id),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function deleteNote(id) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      dispatch({ type: "DELETE_NOTE", payload: id });
      addToast({ message: "Note deleted forever" });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function restoreNotesFromTrash(ids) {
    if (!ids.length) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          status: NOTE_STATUS.ACTIVE,
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .in("id", ids)
        .select();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTES", payload: data.map(toNote) });
      addToast({
        message: `${ids.length} note${ids.length === 1 ? "" : "s"} restored`,
        actionLabel: "Undo",
        onAction: () => Promise.all(ids.map((id) => moveNoteToTrash(id))),
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function deleteNotes(ids) {
    if (!ids.length) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await supabase.from("notes").delete().in("id", ids);
      if (error) throw error;
      dispatch({ type: "DELETE_NOTES", payload: ids });
      addToast({ message: `${ids.length} note${ids.length === 1 ? "" : "s"} deleted forever` });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function addFolder(name) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("folders")
        .insert({ name, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      const folder = toFolder(data);
      dispatch({ type: "ADD_FOLDER", payload: folder });
      return folder.id;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function editFolder(id, name) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("folders")
        .update({ name })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_FOLDER", payload: toFolder(data) });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function deleteFolder(id) {
    const folder = state.foldersList.find((f) => f.id === id);
    const affectedNoteIds = state.notesList
      .filter((n) => n.folderId === id)
      .map((n) => n.id);

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Unassign notes first to avoid FK violation
      const { error: unassignError } = await supabase
        .from("notes")
        .update({ folder_id: null })
        .eq("folder_id", id);
      if (unassignError) throw unassignError;
      const { error } = await supabase.from("folders").delete().eq("id", id);
      if (error) throw error;
      dispatch({ type: "DELETE_FOLDER", payload: id });
      if (folder) {
        addToast({
          message: `Folder "${folder.name}" deleted`,
          actionLabel: "Undo",
          onAction: () => undoDeleteFolder(folder.name, affectedNoteIds),
        });
      }
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function undoDeleteFolder(name, noteIds) {
    const newFolderId = await addFolder(name);
    if (!newFolderId) return;
    await Promise.all(noteIds.map((noteId) => addNoteToFolder(noteId, newFolderId)));
  }

  async function addNoteToFolder(noteId, folderId) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ folder_id: folderId, updated_at: new Date().toISOString() })
        .eq("id", noteId)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function removeNoteFromFolder(noteId) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ folder_id: null, updated_at: new Date().toISOString() })
        .eq("id", noteId)
        .select()
        .single();
      if (error) throw error;
      dispatch({ type: "UPDATE_NOTE", payload: toNote(data) });
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
        isInitialLoad,
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
        restoreNotesFromTrash,
        deleteNotes,
        addFolder,
        editFolder,
        deleteFolder,
        addNoteToFolder,
        removeNoteFromFolder,
        refreshNotes: fetchData,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
