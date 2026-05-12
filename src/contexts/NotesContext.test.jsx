import React, { useContext } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { NotesContext, NotesProvider } from "./NotesContext";
import { AuthContext } from "./AuthContext";
import { server } from "../test/mocks/server";
import { SUPABASE_URL, noteRow, folderRow } from "../test/mocks/handlers";

const mockUser = { id: "user-1", email: "test@test.com" };

function makeWrapper(user = mockUser) {
  return function Wrapper({ children }) {
    return (
      <AuthContext.Provider value={{ user }}>
        <NotesProvider>{children}</NotesProvider>
      </AuthContext.Provider>
    );
  };
}

function renderNotes(user = mockUser) {
  return renderHook(() => useContext(NotesContext), { wrapper: makeWrapper(user) });
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
