import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NoteCard from "./NoteCard";
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

const baseNote = {
  id: "note-1",
  title: "Test Note",
  body: "Test body",
  color: "yellow",
  pinned: false,
  creationDate: "2024-01-01T00:00:00Z",
};

function makeActions() {
  return {
    moveNoteToTrash: vi.fn(),
    restoreNoteFromTrash: vi.fn(),
    deleteNote: vi.fn(),
    archiveNote: vi.fn(),
    unarchiveNote: vi.fn(),
    pinNote: vi.fn(),
    unpinNote: vi.fn(),
  };
}

function renderCard(props = {}, actions = makeActions()) {
  const result = render(
    <MemoryRouter>
      <UIContext.Provider value={{ isDark: false }}>
        <NotesContext.Provider value={actions}>
          <NoteCard {...baseNote} {...props} />
        </NotesContext.Provider>
      </UIContext.Provider>
    </MemoryRouter>
  );
  return { ...result, actions };
}

// ─── Content ──────────────────────────────────────────────────────────────────

describe("NoteCard — content", () => {
  it("renders the title, body, and creation date", () => {
    renderCard();
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("Test body")).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it("title is a link to /note/{id}", () => {
    renderCard();
    expect(screen.getByRole("link", { name: "Test Note" })).toHaveAttribute(
      "href",
      "/note/note-1"
    );
  });
});

// ─── Default variant ──────────────────────────────────────────────────────────

describe("NoteCard — default variant", () => {
  it("shows Pin, Archive, and Delete when note is not pinned", () => {
    renderCard({ pinned: false });
    expect(screen.getByRole("button", { name: "Pin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("shows Unpin instead of Pin when note is pinned", () => {
    renderCard({ pinned: true });
    expect(screen.getByRole("button", { name: "Unpin" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pin" })).not.toBeInTheDocument();
  });

  it("clicking Archive calls archiveNote with the note id", async () => {
    const actions = makeActions();
    renderCard({}, actions);
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(actions.archiveNote).toHaveBeenCalledWith("note-1");
  });

  it("clicking Delete calls moveNoteToTrash with the note id", async () => {
    const actions = makeActions();
    renderCard({}, actions);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(actions.moveNoteToTrash).toHaveBeenCalledWith("note-1");
  });

  it("clicking Pin calls pinNote with the note id", async () => {
    const actions = makeActions();
    renderCard({ pinned: false }, actions);
    await userEvent.click(screen.getByRole("button", { name: "Pin" }));
    expect(actions.pinNote).toHaveBeenCalledWith("note-1");
  });

  it("clicking Unpin calls unpinNote with the note id", async () => {
    const actions = makeActions();
    renderCard({ pinned: true }, actions);
    await userEvent.click(screen.getByRole("button", { name: "Unpin" }));
    expect(actions.unpinNote).toHaveBeenCalledWith("note-1");
  });
});

// ─── Trash variant ────────────────────────────────────────────────────────────

describe("NoteCard — trash variant", () => {
  it("shows Restore and Delete Forever buttons", () => {
    renderCard({ variant: "trash" });
    expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Forever" })).toBeInTheDocument();
  });

  it("does not show Archive or Pin", () => {
    renderCard({ variant: "trash" });
    expect(screen.queryByRole("button", { name: "Archive" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pin" })).not.toBeInTheDocument();
  });

  it("clicking Restore calls restoreNoteFromTrash with the note id", async () => {
    const actions = makeActions();
    renderCard({ variant: "trash" }, actions);
    await userEvent.click(screen.getByRole("button", { name: "Restore" }));
    expect(actions.restoreNoteFromTrash).toHaveBeenCalledWith("note-1");
  });

  it("clicking Delete Forever calls deleteNote with the note id", async () => {
    const actions = makeActions();
    renderCard({ variant: "trash" }, actions);
    await userEvent.click(screen.getByRole("button", { name: "Delete Forever" }));
    expect(actions.deleteNote).toHaveBeenCalledWith("note-1");
  });
});

// ─── Archived variant ─────────────────────────────────────────────────────────

describe("NoteCard — archived variant", () => {
  it("shows only the Unarchive button", () => {
    renderCard({ variant: "archived" });
    expect(screen.getByRole("button", { name: "Unarchive" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Archive" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pin" })).not.toBeInTheDocument();
  });

  it("clicking Unarchive calls unarchiveNote with the note id", async () => {
    const actions = makeActions();
    renderCard({ variant: "archived" }, actions);
    await userEvent.click(screen.getByRole("button", { name: "Unarchive" }));
    expect(actions.unarchiveNote).toHaveBeenCalledWith("note-1");
  });
});
