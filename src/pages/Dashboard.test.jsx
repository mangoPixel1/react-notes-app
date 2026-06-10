import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "./Dashboard";
import { UIContext } from "../contexts/UIContext";
import { NotesContext } from "../contexts/NotesContext";

let noteCounter = 0;
function makeNote(overrides = {}) {
  noteCounter += 1;
  return {
    id: `note-${noteCounter}`,
    title: "Note Title",
    body: "Note body",
    color: "yellow",
    pinned: false,
    status: "active",
    creationDate: "2024-01-15T00:00:00Z",
    lastEdited: "2024-01-15T00:00:00Z",
    folderId: null,
    deletedAt: null,
    ...overrides,
  };
}

function makeNotesActions() {
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

function renderDashboard({ notes = [] } = {}) {
  return render(
    <MemoryRouter>
      <UIContext.Provider
        value={{
          notesLayout: "grid",
          isDark: false,
          setNotesLayout: vi.fn(),
        }}
      >
        <NotesContext.Provider value={{ notes, ...makeNotesActions() }}>
          <Dashboard />
        </NotesContext.Provider>
      </UIContext.Provider>
    </MemoryRouter>
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("Dashboard — rendering", () => {
  it("always shows the 'All notes' section heading", () => {
    renderDashboard();
    expect(screen.getByText("All notes")).toBeInTheDocument();
  });

  it("renders all active unpinned notes", () => {
    const notes = [makeNote({ title: "Note A" }), makeNote({ title: "Note B" })];
    renderDashboard({ notes });
    expect(screen.getByText("Note A")).toBeInTheDocument();
    expect(screen.getByText("Note B")).toBeInTheDocument();
  });

  it("does not render archived notes", () => {
    const notes = [makeNote({ title: "Visible" }), makeNote({ title: "Archived", status: "archived" })];
    renderDashboard({ notes });
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Archived")).not.toBeInTheDocument();
  });

  it("does not render trashed notes", () => {
    const notes = [makeNote({ title: "Visible" }), makeNote({ title: "Trashed", status: "trashed" })];
    renderDashboard({ notes });
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Trashed")).not.toBeInTheDocument();
  });
});

// ─── Pinned section ───────────────────────────────────────────────────────────

describe("Dashboard — pinned section", () => {
  it("shows the Pinned heading when there are pinned active notes", () => {
    const notes = [makeNote({ pinned: true, title: "Pinned Note" })];
    renderDashboard({ notes });
    expect(screen.getByText("Pinned")).toBeInTheDocument();
  });

  it("hides the Pinned heading when there are no pinned notes", () => {
    const notes = [makeNote({ title: "Regular Note" })];
    renderDashboard({ notes });
    expect(screen.queryByText("Pinned")).not.toBeInTheDocument();
  });

  it("pinned notes appear in the Pinned section but not in All notes", () => {
    const notes = [makeNote({ title: "Pinned Note", pinned: true })];
    renderDashboard({ notes });
    // Title should appear exactly once (in Pinned section, not duplicated in All notes)
    expect(screen.getAllByText("Pinned Note")).toHaveLength(1);
  });

  it("does not show a pinned archived note in the Pinned section", () => {
    const notes = [makeNote({ title: "Ghost", pinned: true, status: "archived" })];
    renderDashboard({ notes });
    expect(screen.queryByText("Pinned")).not.toBeInTheDocument();
    expect(screen.queryByText("Ghost")).not.toBeInTheDocument();
  });
});


// ─── Sorting ──────────────────────────────────────────────────────────────────

describe("Dashboard — sorting", () => {
  it("defaults to newest-first by creation date", () => {
    const notes = [
      makeNote({ title: "Older", creationDate: "2024-01-01T00:00:00Z" }),
      makeNote({ title: "Newer", creationDate: "2024-06-01T00:00:00Z" }),
    ];
    renderDashboard({ notes });
    const titles = screen.getAllByRole("heading", { level: 1 });
    expect(titles[0]).toHaveTextContent("Newer");
    expect(titles[1]).toHaveTextContent("Older");
  });

  it("sorts oldest-first when 'Date Created (Oldest)' is selected", async () => {
    const notes = [
      makeNote({ title: "Older", creationDate: "2024-01-01T00:00:00Z" }),
      makeNote({ title: "Newer", creationDate: "2024-06-01T00:00:00Z" }),
    ];
    renderDashboard({ notes });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /sort by/i }), "date-created-oldest");
    const titles = screen.getAllByRole("heading", { level: 1 });
    expect(titles[0]).toHaveTextContent("Older");
    expect(titles[1]).toHaveTextContent("Newer");
  });

  it("sorts by last-edited newest when selected", async () => {
    const notes = [
      makeNote({ title: "Old Edit", lastEdited: "2024-01-01T00:00:00Z" }),
      makeNote({ title: "New Edit", lastEdited: "2024-09-01T00:00:00Z" }),
    ];
    renderDashboard({ notes });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /sort by/i }), "last-edited-newest");
    const titles = screen.getAllByRole("heading", { level: 1 });
    expect(titles[0]).toHaveTextContent("New Edit");
    expect(titles[1]).toHaveTextContent("Old Edit");
  });

  it("sorts by color when selected", async () => {
    // COLOR_SORT_ORDER: red=0, orange=1, yellow=2, ...
    const notes = [
      makeNote({ title: "Yellow Note", color: "yellow" }),
      makeNote({ title: "Red Note", color: "red" }),
    ];
    renderDashboard({ notes });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /sort by/i }), "color");
    const titles = screen.getAllByRole("heading", { level: 1 });
    expect(titles[0]).toHaveTextContent("Red Note");
    expect(titles[1]).toHaveTextContent("Yellow Note");
  });
});
