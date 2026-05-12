import { describe, it, expect } from "vitest";
import { notesReducer } from "./NotesContext";

const baseNote = {
  id: "n1",
  title: "Note 1",
  body: "",
  color: "default",
  pinned: false,
  status: "active",
  folderId: null,
  creationDate: "2024-01-01T00:00:00Z",
  lastEdited: "2024-01-01T00:00:00Z",
  deletedAt: null,
};

const baseFolder = { id: "f1", name: "Work" };

const emptyState = { notesList: [], foldersList: [], isLoading: false, error: null };

describe("notesReducer", () => {
  describe("SET_LOADING / SET_ERROR", () => {
    it("sets isLoading", () => {
      expect(notesReducer(emptyState, { type: "SET_LOADING", payload: true }).isLoading).toBe(true);
    });

    it("sets error message", () => {
      expect(notesReducer(emptyState, { type: "SET_ERROR", payload: "oops" }).error).toBe("oops");
    });
  });

  describe("SET_NOTES / SET_FOLDERS", () => {
    it("replaces notesList", () => {
      const state = notesReducer(emptyState, { type: "SET_NOTES", payload: [baseNote] });
      expect(state.notesList).toHaveLength(1);
      expect(state.notesList[0].id).toBe("n1");
    });

    it("replaces foldersList", () => {
      const state = notesReducer(emptyState, { type: "SET_FOLDERS", payload: [baseFolder] });
      expect(state.foldersList).toHaveLength(1);
      expect(state.foldersList[0].id).toBe("f1");
    });
  });

  describe("ADD_NOTE", () => {
    it("prepends the new note to the list", () => {
      const existing = { ...emptyState, notesList: [baseNote] };
      const newNote = { ...baseNote, id: "n2", title: "Note 2" };
      const state = notesReducer(existing, { type: "ADD_NOTE", payload: newNote });
      expect(state.notesList[0].id).toBe("n2");
      expect(state.notesList).toHaveLength(2);
    });
  });

  describe("UPDATE_NOTE", () => {
    it("replaces the matching note in place", () => {
      const updated = { ...baseNote, title: "Updated" };
      const state = notesReducer(
        { ...emptyState, notesList: [baseNote] },
        { type: "UPDATE_NOTE", payload: updated }
      );
      expect(state.notesList[0].title).toBe("Updated");
      expect(state.notesList).toHaveLength(1);
    });

    it("does not touch other notes", () => {
      const other = { ...baseNote, id: "n2", title: "Other" };
      const state = notesReducer(
        { ...emptyState, notesList: [baseNote, other] },
        { type: "UPDATE_NOTE", payload: { ...baseNote, title: "Changed" } }
      );
      expect(state.notesList[1].title).toBe("Other");
    });
  });

  describe("DELETE_NOTE", () => {
    it("removes the note with the given id", () => {
      const state = notesReducer(
        { ...emptyState, notesList: [baseNote] },
        { type: "DELETE_NOTE", payload: "n1" }
      );
      expect(state.notesList).toHaveLength(0);
    });

    it("leaves other notes untouched", () => {
      const other = { ...baseNote, id: "n2" };
      const state = notesReducer(
        { ...emptyState, notesList: [baseNote, other] },
        { type: "DELETE_NOTE", payload: "n1" }
      );
      expect(state.notesList).toHaveLength(1);
      expect(state.notesList[0].id).toBe("n2");
    });
  });

  describe("ADD_FOLDER", () => {
    it("appends the folder to the list", () => {
      const state = notesReducer(emptyState, { type: "ADD_FOLDER", payload: baseFolder });
      expect(state.foldersList).toHaveLength(1);
      expect(state.foldersList[0].id).toBe("f1");
    });
  });

  describe("UPDATE_FOLDER", () => {
    it("replaces the matching folder", () => {
      const state = notesReducer(
        { ...emptyState, foldersList: [baseFolder] },
        { type: "UPDATE_FOLDER", payload: { id: "f1", name: "Personal" } }
      );
      expect(state.foldersList[0].name).toBe("Personal");
    });
  });

  describe("DELETE_FOLDER", () => {
    it("removes the folder", () => {
      const state = notesReducer(
        { ...emptyState, foldersList: [baseFolder] },
        { type: "DELETE_FOLDER", payload: "f1" }
      );
      expect(state.foldersList).toHaveLength(0);
    });

    it("unassigns notes that belonged to the deleted folder", () => {
      const assignedNote = { ...baseNote, folderId: "f1" };
      const state = notesReducer(
        { ...emptyState, notesList: [assignedNote], foldersList: [baseFolder] },
        { type: "DELETE_FOLDER", payload: "f1" }
      );
      expect(state.notesList[0].folderId).toBeNull();
    });

    it("does not touch notes assigned to a different folder", () => {
      const otherNote = { ...baseNote, folderId: "f2" };
      const state = notesReducer(
        { ...emptyState, notesList: [otherNote], foldersList: [baseFolder] },
        { type: "DELETE_FOLDER", payload: "f1" }
      );
      expect(state.notesList[0].folderId).toBe("f2");
    });
  });

  describe("unknown action", () => {
    it("returns state unchanged", () => {
      const state = notesReducer(emptyState, { type: "DOES_NOT_EXIST" });
      expect(state).toEqual(emptyState);
    });
  });
});
