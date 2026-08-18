import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import Trash from "./Trash";
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
    status: "trashed",
    creationDate: "2024-01-15T00:00:00Z",
    lastEdited: "2024-01-15T00:00:00Z",
    folderId: null,
    deletedAt: "2024-01-20T00:00:00Z",
    ...overrides,
  };
}

function renderTrash({ notes = [], restoreNotesFromTrash = vi.fn(), setConfirmAction = vi.fn() } = {}) {
  return {
    restoreNotesFromTrash,
    setConfirmAction,
    ...render(
      <MemoryRouter>
        <UIContext.Provider
          value={{
            notesLayout: "grid",
            isDark: false,
            setConfirmAction,
          }}
        >
          <NotesContext.Provider
            value={{
              notes,
              restoreNotesFromTrash,
              restoreNoteFromTrash: vi.fn(),
              deleteNote: vi.fn(),
              archiveNote: vi.fn(),
              unarchiveNote: vi.fn(),
              pinNote: vi.fn(),
              unpinNote: vi.fn(),
            }}
          >
            <Trash />
          </NotesContext.Provider>
        </UIContext.Provider>
      </MemoryRouter>
    ),
  };
}

async function enterSelectMode(user) {
  await user.click(screen.getByRole("button", { name: /^select$/i }));
}

describe("Trash — select mode", () => {
  it("shows no Select button when there are no notes", () => {
    renderTrash({ notes: [] });
    expect(screen.queryByRole("button", { name: /^select$/i })).not.toBeInTheDocument();
  });

  it("shows a Select button and no checkboxes initially", () => {
    const notes = [makeNote(), makeNote()];
    renderTrash({ notes });

    expect(screen.getByRole("button", { name: /^select$/i })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /restore all/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete all/i })).not.toBeInTheDocument();
  });

  it("entering select mode shows checkboxes and a way to exit", async () => {
    const user = userEvent.setup();
    const notes = [makeNote(), makeNote()];
    renderTrash({ notes });

    await enterSelectMode(user);

    expect(screen.getAllByRole("checkbox")).toHaveLength(3); // 2 notes + select-all
    expect(screen.queryByRole("button", { name: /^select$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("exiting select mode clears the selection and hides checkboxes", async () => {
    const user = userEvent.setup();
    const notes = [makeNote(), makeNote()];
    renderTrash({ notes });

    await enterSelectMode(user);
    await user.click(screen.getByLabelText(/select all/i));
    expect(screen.getByText("2 selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select$/i })).toBeInTheDocument();
  });

  it("reveals Restore All / Delete All once a note is checked", async () => {
    const user = userEvent.setup();
    const notes = [makeNote(), makeNote()];
    renderTrash({ notes });

    await enterSelectMode(user);
    const noteCheckboxes = screen.getAllByRole("checkbox").filter(
      (cb) => cb.title === "Select"
    );
    await user.click(noteCheckboxes[0]);

    expect(screen.getByText("1 selected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /restore all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete all/i })).toBeInTheDocument();
  });

  it("selects every note when Select all is checked", async () => {
    const user = userEvent.setup();
    const notes = [makeNote(), makeNote(), makeNote()];
    renderTrash({ notes });

    await enterSelectMode(user);
    await user.click(screen.getByLabelText(/select all/i));

    expect(screen.getByText("3 selected")).toBeInTheDocument();
  });

  it("calls restoreNotesFromTrash with the selected ids and exits select mode", async () => {
    const user = userEvent.setup();
    const notes = [makeNote({ id: "n1" }), makeNote({ id: "n2" })];
    const restoreNotesFromTrash = vi.fn();
    renderTrash({ notes, restoreNotesFromTrash });

    await enterSelectMode(user);
    await user.click(screen.getByLabelText(/select all/i));
    await user.click(screen.getByRole("button", { name: /restore all/i }));

    expect(restoreNotesFromTrash).toHaveBeenCalledWith(["n1", "n2"]);
    expect(screen.queryByRole("button", { name: /restore all/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select$/i })).toBeInTheDocument();
  });

  it("asks for confirmation with the selected ids when Delete All is clicked", async () => {
    const user = userEvent.setup();
    const notes = [makeNote({ id: "n1" }), makeNote({ id: "n2" })];
    const setConfirmAction = vi.fn();
    renderTrash({ notes, setConfirmAction });

    await enterSelectMode(user);
    await user.click(screen.getByLabelText(/select all/i));
    await user.click(screen.getByRole("button", { name: /delete all/i }));

    expect(setConfirmAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: "deleteMany", noteIds: ["n1", "n2"] })
    );
  });
});
