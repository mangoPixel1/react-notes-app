import React, { useContext } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { NotesContext, NotesProvider } from "./NotesContext";
import { AuthContext } from "./AuthContext";
import { UIContext } from "./UIContext";
import { server } from "../test/mocks/server";
import { SUPABASE_URL, noteRow, folderRow } from "../test/mocks/handlers";

const mockUser = { id: "user-1", email: "test@test.com" };

function makeWrapper(user = mockUser, addToast = vi.fn()) {
  return function Wrapper({ children }) {
    return (
      <AuthContext.Provider value={{ user }}>
        <UIContext.Provider value={{ addToast }}>
          <NotesProvider>{children}</NotesProvider>
        </UIContext.Provider>
      </AuthContext.Provider>
    );
  };
}

function renderNotes(user = mockUser, addToast = vi.fn()) {
  return renderHook(() => useContext(NotesContext), { wrapper: makeWrapper(user, addToast) });
}

async function waitForIdle(result) {
  await waitFor(() => expect(result.current.isLoading).toBe(false));
}

// ─── Initial data fetch ───────────────────────────────────────────────────────

describe("NotesContext — initial fetch", () => {
  it("loads notes and folders when a user is present", async () => {
    const { result } = renderNotes();
    await waitForIdle(result);

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].id).toBe("note-1");
    expect(result.current.folders).toHaveLength(1);
    expect(result.current.folders[0].id).toBe("folder-1");
  });

  it("starts with empty state and skips fetch when no user", () => {
    const { result } = renderNotes(null);
    expect(result.current.notes).toHaveLength(0);
    expect(result.current.folders).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error state when the notes fetch fails", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json(
          { code: "500", message: "DB error", details: null, hint: null },
          { status: 500 }
        )
      )
    );
    const { result } = renderNotes();
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.isLoading).toBe(false);
  });
});

// ─── addNote ──────────────────────────────────────────────────────────────────

describe("NotesContext — addNote", () => {
  it("inserts a note and prepends it to the list", async () => {
    const newRow = { ...noteRow, id: "note-2", title: "Brand New" };
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json(newRow, { status: 201 })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => {
      await result.current.addNote({ title: "Brand New", body: "", color: "yellow", folderId: null });
    });

    await waitForIdle(result);
    expect(result.current.notes[0].id).toBe("note-2");
    expect(result.current.notes[0].title).toBe("Brand New");
    expect(result.current.notes).toHaveLength(2);
  });
});

// ─── editNote ─────────────────────────────────────────────────────────────────

describe("NotesContext — editNote", () => {
  it("updates title and body in state", async () => {
    const updatedRow = { ...noteRow, title: "Edited Title", body: "Edited body" };
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () => HttpResponse.json(updatedRow))
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => {
      await result.current.editNote("note-1", "Edited Title", "Edited body");
    });

    await waitForIdle(result);
    expect(result.current.notes[0].title).toBe("Edited Title");
    expect(result.current.notes[0].body).toBe("Edited body");
  });

  it("does not call Supabase when both title and body are blank", async () => {
    const patchSpy = vi.fn();
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () => {
        patchSpy();
        return HttpResponse.json(noteRow);
      })
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => {
      await result.current.editNote("note-1", "   ", "   ");
    });

    expect(patchSpy).not.toHaveBeenCalled();
  });
});

// ─── archiveNote / unarchiveNote ──────────────────────────────────────────────

describe("NotesContext — archiveNote", () => {
  it("sets the note's status to archived", async () => {
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json({ ...noteRow, status: "archived" })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.archiveNote("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].status).toBe("archived");
  });
});

describe("NotesContext — unarchiveNote", () => {
  it("sets the note's status back to active", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([{ ...noteRow, status: "archived" }])
      ),
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json({ ...noteRow, status: "active" })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.unarchiveNote("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].status).toBe("active");
  });
});

// ─── pinNote / unpinNote ──────────────────────────────────────────────────────

describe("NotesContext — pinNote / unpinNote", () => {
  it("pinNote sets pinned to true", async () => {
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json({ ...noteRow, pinned: true })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.pinNote("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].pinned).toBe(true);
  });

  it("unpinNote sets pinned to false", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([{ ...noteRow, pinned: true }])
      ),
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json({ ...noteRow, pinned: false })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.unpinNote("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].pinned).toBe(false);
  });
});

// ─── moveNoteToTrash ──────────────────────────────────────────────────────────

describe("NotesContext — moveNoteToTrash", () => {
  it("sets status to trashed and records deletedAt", async () => {
    const deletedAt = "2024-03-01T00:00:00Z";
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json({ ...noteRow, status: "trashed", deleted_at: deletedAt })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.moveNoteToTrash("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].status).toBe("trashed");
    expect(result.current.notes[0].deletedAt).toBe(deletedAt);
  });
});

// ─── restoreNoteFromTrash ─────────────────────────────────────────────────────

describe("NotesContext — restoreNoteFromTrash", () => {
  it("sets status to active and clears deletedAt", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([{ ...noteRow, status: "trashed", deleted_at: "2024-03-01T00:00:00Z" }])
      ),
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json({ ...noteRow, status: "active", deleted_at: null })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.restoreNoteFromTrash("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].status).toBe("active");
    expect(result.current.notes[0].deletedAt).toBeNull();
  });
});

// ─── deleteNote ───────────────────────────────────────────────────────────────

describe("NotesContext — deleteNote", () => {
  it("removes the note from state", async () => {
    const { result } = renderNotes();
    await waitForIdle(result);
    expect(result.current.notes).toHaveLength(1);

    await act(async () => { await result.current.deleteNote("note-1"); });

    await waitForIdle(result);
    expect(result.current.notes).toHaveLength(0);
  });
});

// ─── restoreNotesFromTrash ────────────────────────────────────────────────────

describe("NotesContext — restoreNotesFromTrash", () => {
  it("sets status to active and clears deletedAt for all given ids", async () => {
    const other = { ...noteRow, id: "note-2" };
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([
          { ...noteRow, status: "trashed", deleted_at: "2024-03-01T00:00:00Z" },
          { ...other, status: "trashed", deleted_at: "2024-03-01T00:00:00Z" },
        ])
      ),
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([
          { ...noteRow, status: "active", deleted_at: null },
          { ...other, status: "active", deleted_at: null },
        ])
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => {
      await result.current.restoreNotesFromTrash(["note-1", "note-2"]);
    });

    await waitForIdle(result);
    expect(result.current.notes.every((n) => n.status === "active")).toBe(true);
    expect(result.current.notes.every((n) => n.deletedAt === null)).toBe(true);
  });

  it("does nothing when given an empty list", async () => {
    const patchSpy = vi.fn();
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () => {
        patchSpy();
        return HttpResponse.json([]);
      })
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.restoreNotesFromTrash([]); });

    expect(patchSpy).not.toHaveBeenCalled();
  });
});

// ─── deleteNotes ──────────────────────────────────────────────────────────────

describe("NotesContext — deleteNotes", () => {
  it("removes all given ids from state", async () => {
    const other = { ...noteRow, id: "note-2" };
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([noteRow, other])
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);
    expect(result.current.notes).toHaveLength(2);

    await act(async () => {
      await result.current.deleteNotes(["note-1", "note-2"]);
    });

    await waitForIdle(result);
    expect(result.current.notes).toHaveLength(0);
  });

  it("does nothing when given an empty list", async () => {
    const deleteSpy = vi.fn();
    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/notes`, () => {
        deleteSpy();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.deleteNotes([]); });

    expect(deleteSpy).not.toHaveBeenCalled();
  });
});

// ─── addFolder ────────────────────────────────────────────────────────────────

describe("NotesContext — addFolder", () => {
  it("appends the folder to the list and returns its id", async () => {
    const newFolder = { id: "folder-2", name: "Personal", created_at: "2024-01-01T00:00:00Z", user_id: "user-1" };
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/folders`, () =>
        HttpResponse.json(newFolder, { status: 201 })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    let returnedId;
    await act(async () => {
      returnedId = await result.current.addFolder("Personal");
    });

    await waitForIdle(result);
    expect(returnedId).toBe("folder-2");
    expect(result.current.folders.map((f) => f.name)).toContain("Personal");
  });
});

// ─── editFolder ───────────────────────────────────────────────────────────────

describe("NotesContext — editFolder", () => {
  it("updates the folder name in state", async () => {
    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/folders`, () =>
        HttpResponse.json({ ...folderRow, name: "Renamed" })
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.editFolder("folder-1", "Renamed"); });

    await waitForIdle(result);
    expect(result.current.folders[0].name).toBe("Renamed");
  });
});

// ─── deleteFolder ─────────────────────────────────────────────────────────────

describe("NotesContext — deleteFolder", () => {
  it("removes the folder and sets folderId to null on its notes", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([{ ...noteRow, folder_id: "folder-1" }])
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    expect(result.current.notes[0].folderId).toBe("folder-1");

    await act(async () => { await result.current.deleteFolder("folder-1"); });

    await waitForIdle(result);
    expect(result.current.folders).toHaveLength(0);
    expect(result.current.notes[0].folderId).toBeNull();
  });

  it("does not affect notes that belong to a different folder", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([{ ...noteRow, id: "note-a", folder_id: "folder-2" }])
      )
    );
    const { result } = renderNotes();
    await waitForIdle(result);

    await act(async () => { await result.current.deleteFolder("folder-1"); });

    await waitForIdle(result);
    expect(result.current.notes[0].folderId).toBe("folder-2");
  });
});

// ─── toasts + undo ────────────────────────────────────────────────────────────

function echoPatchHandler() {
  return http.patch(`${SUPABASE_URL}/rest/v1/notes`, async ({ request }) => {
    const url = new URL(request.url);
    const idFilter = url.searchParams.get("id"); // e.g. "eq.note-2"
    const id = idFilter?.startsWith("eq.") ? idFilter.slice(3) : noteRow.id;
    const body = await request.json();
    return HttpResponse.json({ ...noteRow, id, ...body });
  });
}

describe("NotesContext — toasts", () => {
  it("archiveNote shows an undoable toast, and undo unarchives the note", async () => {
    server.use(echoPatchHandler());
    const addToast = vi.fn();
    const { result } = renderNotes(mockUser, addToast);
    await waitForIdle(result);

    await act(async () => { await result.current.archiveNote("note-1"); });
    await waitForIdle(result);

    expect(result.current.notes[0].status).toBe("archived");
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Note archived", actionLabel: "Undo" })
    );

    const { onAction } = addToast.mock.calls[0][0];
    await act(async () => { await onAction(); });
    await waitForIdle(result);

    expect(result.current.notes[0].status).toBe("active");
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Note unarchived", actionLabel: "Undo" })
    );
  });

  it("moveNoteToTrash shows an undoable toast, and undo restores the note", async () => {
    server.use(echoPatchHandler());
    const addToast = vi.fn();
    const { result } = renderNotes(mockUser, addToast);
    await waitForIdle(result);

    await act(async () => { await result.current.moveNoteToTrash("note-1"); });
    await waitForIdle(result);

    expect(result.current.notes[0].status).toBe("trashed");
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Note moved to trash", actionLabel: "Undo" })
    );

    const { onAction } = addToast.mock.calls[0][0];
    await act(async () => { await onAction(); });
    await waitForIdle(result);

    expect(result.current.notes[0].status).toBe("active");
  });

  it("deleteNote shows a toast with no undo action", async () => {
    const addToast = vi.fn();
    const { result } = renderNotes(mockUser, addToast);
    await waitForIdle(result);

    await act(async () => { await result.current.deleteNote("note-1"); });

    expect(addToast).toHaveBeenCalledWith({ message: "Note deleted forever" });
  });

  it("restoreNotesFromTrash shows a pluralized toast and undo re-trashes every note", async () => {
    const other = { ...noteRow, id: "note-2" };
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([
          { ...noteRow, status: "trashed", deleted_at: "2024-03-01T00:00:00Z" },
          { ...other, status: "trashed", deleted_at: "2024-03-01T00:00:00Z" },
        ])
      ),
      http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([
          { ...noteRow, status: "active", deleted_at: null },
          { ...other, status: "active", deleted_at: null },
        ])
      )
    );
    const addToast = vi.fn();
    const { result } = renderNotes(mockUser, addToast);
    await waitForIdle(result);

    await act(async () => {
      await result.current.restoreNotesFromTrash(["note-1", "note-2"]);
    });
    await waitForIdle(result);

    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "2 notes restored", actionLabel: "Undo" })
    );

    server.use(echoPatchHandler());
    const { onAction } = addToast.mock.calls[0][0];
    await act(async () => { await onAction(); });
    await waitFor(() =>
      expect(result.current.notes.every((n) => n.status === "trashed")).toBe(true)
    );
  });

  it("deleteNotes shows a pluralized toast with no undo action", async () => {
    const other = { ...noteRow, id: "note-2" };
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () => HttpResponse.json([noteRow, other]))
    );
    const addToast = vi.fn();
    const { result } = renderNotes(mockUser, addToast);
    await waitForIdle(result);

    await act(async () => { await result.current.deleteNotes(["note-1", "note-2"]); });

    expect(addToast).toHaveBeenCalledWith({ message: "2 notes deleted forever" });
  });

  it("deleteFolder shows an undoable toast, and undo recreates the folder and reassigns its notes", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
        HttpResponse.json([{ ...noteRow, folder_id: "folder-1" }])
      ),
      http.post(`${SUPABASE_URL}/rest/v1/folders`, () =>
        HttpResponse.json(
          { id: "folder-2", name: folderRow.name, created_at: "2024-01-01T00:00:00Z", user_id: "user-1" },
          { status: 201 }
        )
      ),
      echoPatchHandler()
    );
    const addToast = vi.fn();
    const { result } = renderNotes(mockUser, addToast);
    await waitForIdle(result);

    await act(async () => { await result.current.deleteFolder("folder-1"); });
    await waitForIdle(result);

    expect(result.current.folders).toHaveLength(0);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Folder "${folderRow.name}" deleted`,
        actionLabel: "Undo",
      })
    );

    const { onAction } = addToast.mock.calls[0][0];
    await act(async () => { await onAction(); });
    await waitForIdle(result);

    expect(result.current.folders).toHaveLength(1);
    expect(result.current.folders[0].name).toBe(folderRow.name);
    expect(result.current.notes[0].folderId).toBe("folder-2");
  });
});
