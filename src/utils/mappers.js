// Supabase row → frontend shape
export function toNote(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    color: row.color,
    pinned: row.pinned ?? false,
    status: row.status ?? "active",
    folderId: row.folder_id,
    creationDate: row.created_at,
    lastEdited: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function toFolder(row) {
  return {
    id: row.id,
    name: row.name,
  };
}

// Frontend shape → Supabase row (for inserts/updates)
export function toNoteRow(note) {
  return {
    title: note.title,
    body: note.body,
    color: note.color,
    pinned: note.pinned,
    status: note.status,
    folder_id: note.folderId ?? null,
    deleted_at: note.deletedAt ?? null,
  };
}

export function toFolderRow(folder) {
  return {
    name: folder.name,
  };
}
