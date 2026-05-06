import { describe, it, expect } from "vitest";
import { toNote, toFolder, toNoteRow, toFolderRow } from "./mappers";

const baseRow = {
  id: "abc",
  title: "My Note",
  body: "Some content",
  color: "yellow",
  pinned: true,
  status: "active",
  folder_id: "folder-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-02-01T00:00:00Z",
  deleted_at: null,
};

describe("toNote", () => {
  it("maps all fields from a Supabase row to the frontend shape", () => {
    const note = toNote(baseRow);
    expect(note).toEqual({
      id: "abc",
      title: "My Note",
      body: "Some content",
      color: "yellow",
      pinned: true,
      status: "active",
      folderId: "folder-1",
      creationDate: "2024-01-01T00:00:00Z",
      lastEdited: "2024-02-01T00:00:00Z",
      deletedAt: null,
    });
  });

  it("defaults pinned to false when null", () => {
    expect(toNote({ ...baseRow, pinned: null }).pinned).toBe(false);
  });

  it("defaults status to 'active' when null", () => {
    expect(toNote({ ...baseRow, status: null }).status).toBe("active");
  });

  it("passes through null folderId", () => {
    expect(toNote({ ...baseRow, folder_id: null }).folderId).toBeNull();
  });
});

describe("toFolder", () => {
  it("maps id and name", () => {
    expect(toFolder({ id: "f1", name: "Work", created_at: "2024-01-01T00:00:00Z" })).toEqual({
      id: "f1",
      name: "Work",
    });
  });
});

describe("toNoteRow", () => {
  it("maps frontend note to Supabase insert shape", () => {
    const note = {
      title: "Title",
      body: "Body",
      color: "red",
      pinned: false,
      status: "active",
      folderId: "folder-2",
      deletedAt: null,
    };
    expect(toNoteRow(note)).toEqual({
      title: "Title",
      body: "Body",
      color: "red",
      pinned: false,
      status: "active",
      folder_id: "folder-2",
      deleted_at: null,
    });
  });

  it("converts undefined folderId to null", () => {
    const note = { title: "", body: "", color: "gray", pinned: false, status: "active" };
    expect(toNoteRow(note).folder_id).toBeNull();
  });
});

describe("toFolderRow", () => {
  it("returns only the name", () => {
    expect(toFolderRow({ id: "x", name: "Personal" })).toEqual({ name: "Personal" });
  });
});
