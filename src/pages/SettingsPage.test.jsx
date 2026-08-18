import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";

import SettingsPage from "./SettingsPage";
import { AuthContext } from "../contexts/AuthContext";
import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";

vi.mock("../lib/supabase", () => {
  const builder = {
    delete: vi.fn(() => builder),
    eq: vi.fn(() => Promise.resolve({ error: null })),
  };
  return { supabase: { from: vi.fn(() => builder) } };
});

function renderSettings({
  user = { id: "user-1", email: "test@example.com" },
  updatePassword = vi.fn().mockResolvedValue(),
  signOut = vi.fn().mockResolvedValue(),
  notes = [],
  folders = [],
  addNote = vi.fn().mockResolvedValue(),
  uiOverrides = {},
} = {}) {
  const setNotesLayout = vi.fn();
  const setDefaultNoteColor = vi.fn();
  const setDefaultSortOrder = vi.fn();
  const setTheme = vi.fn();
  const addToast = vi.fn();
  const setConfirmAction = vi.fn();

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, updatePassword, signOut }}>
        <NotesContext.Provider value={{ notes, folders, addNote }}>
          <UIContext.Provider
            value={{
              theme: "system",
              setTheme,
              notesLayout: "grid",
              setNotesLayout,
              defaultNoteColor: "yellow",
              setDefaultNoteColor,
              defaultSortOrder: "date-created-newest",
              setDefaultSortOrder,
              addToast,
              setConfirmAction,
              ...uiOverrides,
            }}
          >
            <SettingsPage />
          </UIContext.Provider>
        </NotesContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

  return { setNotesLayout, setDefaultNoteColor, setDefaultSortOrder, setTheme, addToast, setConfirmAction, updatePassword, signOut, addNote };
}

describe("SettingsPage", () => {
  it("renders account email and all sections", () => {
    renderSettings();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Notes defaults")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Danger zone")).toBeInTheDocument();
  });

  it("updates the theme via the theme toggle", async () => {
    const user = userEvent.setup();
    const { setTheme } = renderSettings();
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("updates the default note view", async () => {
    const user = userEvent.setup();
    const { setNotesLayout } = renderSettings();
    await user.click(screen.getByRole("radio", { name: "List" }));
    expect(setNotesLayout).toHaveBeenCalledWith("list");
  });

  it("updates the default note color", async () => {
    const user = userEvent.setup();
    const { setDefaultNoteColor } = renderSettings();
    await user.click(screen.getByRole("button", { name: "red" }));
    expect(setDefaultNoteColor).toHaveBeenCalledWith("red");
  });

  it("updates the default sort order", async () => {
    const user = userEvent.setup();
    const { setDefaultSortOrder } = renderSettings();
    await user.selectOptions(screen.getByDisplayValue("Date Created (Newest)"), "color");
    expect(setDefaultSortOrder).toHaveBeenCalledWith("color");
  });

  it("changes the password when the form is valid", async () => {
    const user = userEvent.setup();
    const { updatePassword, addToast } = renderSettings();

    await user.click(screen.getByRole("button", { name: /change/i }));
    await user.type(screen.getByPlaceholderText("New password"), "newpass123");
    await user.type(screen.getByPlaceholderText("Confirm new password"), "newpass123");
    await user.click(screen.getByRole("button", { name: /save password/i }));

    expect(updatePassword).toHaveBeenCalledWith("newpass123");
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ message: "Password updated" }));
  });

  it("shows an error when password confirmation doesn't match", async () => {
    const user = userEvent.setup();
    const { updatePassword } = renderSettings();

    await user.click(screen.getByRole("button", { name: /change/i }));
    await user.type(screen.getByPlaceholderText("New password"), "newpass123");
    await user.type(screen.getByPlaceholderText("Confirm new password"), "different");
    await user.click(screen.getByRole("button", { name: /save password/i }));

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(updatePassword).not.toHaveBeenCalled();
  });

  it("exports notes as a downloaded file", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => "blob:mock");
    const revokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const { addToast } = renderSettings({ notes: [{ id: "n1", title: "T", body: "B" }] });
    await user.click(screen.getByRole("button", { name: /^export$/i }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ message: "Notes exported" }));

    clickSpy.mockRestore();
  });

  it("asks for confirmation before deleting the account, then deletes data and signs out", async () => {
    const user = userEvent.setup();
    const { setConfirmAction, signOut, addToast } = renderSettings();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(setConfirmAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: "deleteAccount", onConfirm: expect.any(Function) }),
    );

    const { onConfirm } = setConfirmAction.mock.calls[0][0];
    await onConfirm();

    expect(signOut).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Your notes and folders have been deleted." }),
    );
  });
});
