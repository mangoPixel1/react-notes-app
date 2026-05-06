import { http, HttpResponse } from "msw";

export const SUPABASE_URL = "https://eyjrjmzivkgrjcaxpurw.supabase.co";

// Reusable Supabase row fixtures
export const noteRow = {
  id: "note-1",
  title: "Test Note",
  body: "Test body",
  color: "default",
  pinned: false,
  status: "active",
  folder_id: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
  user_id: "user-1",
};

export const folderRow = {
  id: "folder-1",
  name: "Test Folder",
  created_at: "2024-01-01T00:00:00Z",
  user_id: "user-1",
};

export const handlers = [
  // GET notes
  http.get(`${SUPABASE_URL}/rest/v1/notes`, () =>
    HttpResponse.json([noteRow])
  ),

  // GET folders
  http.get(`${SUPABASE_URL}/rest/v1/folders`, () =>
    HttpResponse.json([folderRow])
  ),

  // POST notes (insert)
  http.post(`${SUPABASE_URL}/rest/v1/notes`, () =>
    HttpResponse.json(noteRow, { status: 201 })
  ),

  // PATCH notes (update)
  http.patch(`${SUPABASE_URL}/rest/v1/notes`, () =>
    HttpResponse.json(noteRow)
  ),

  // DELETE notes
  http.delete(`${SUPABASE_URL}/rest/v1/notes`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  // POST folders (insert)
  http.post(`${SUPABASE_URL}/rest/v1/folders`, () =>
    HttpResponse.json(folderRow, { status: 201 })
  ),

  // PATCH folders (update)
  http.patch(`${SUPABASE_URL}/rest/v1/folders`, () =>
    HttpResponse.json(folderRow)
  ),

  // DELETE folders
  http.delete(`${SUPABASE_URL}/rest/v1/folders`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  // Auth: getSession
  http.get(`${SUPABASE_URL}/auth/v1/user`, () =>
    HttpResponse.json({ id: "user-1", email: "test@test.com" })
  ),
];
