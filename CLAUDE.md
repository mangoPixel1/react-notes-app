# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## UI/UX Design
Use a minimal, modern, Apple Glassmorphism-like aesthetic.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build locally
npm run test      # Run all tests once (Vitest)
npm run test:watch  # Re-run tests on file changes
npm run test:ui   # Vitest browser UI
```

## Architecture

**Stack:** React 19 + React Router 7 + Tailwind CSS v4 + Vite + Supabase. No TypeScript. Supabase handles auth, notes, and folders persistence.

### State Management

Three contexts in `src/contexts/`, all provided at the root in `App.jsx`:

- **AuthContext** (`AuthContext.jsx`) — wraps Supabase auth. Exposes `session`, `user`, `isLoading`, `signIn`, `signUp`, `signOut`. `session === undefined` means loading; `null` means signed out.
- **NotesContext** (`NotesContext.jsx`) — `useReducer` managing the `notes` array and `folders` array. All actions are async and hit Supabase before dispatching. The `notesReducer` is exported for unit testing. Note shape: `{ id, title, body, color, pinned, status ('active'|'archived'|'trashed'), folderId, creationDate, lastEdited, deletedAt }`.
- **UIContext** (`UIContext.jsx`) — manages dark mode toggle, grid/list layout preference, search string, and add-note modal visibility.

### Routing

Defined in `src/components/MainContainer.jsx` using React Router v7:

- Public routes render under `LandingLayout`: `/` (Landing), `/login`, `/signup`
- Protected routes render under `AppLayout` (sidebar + header): `/dashboard`, `/note/:id`, `/folders`, `/folders/:id`, `/archived`, `/trash`, `/profile`, `/settings`

### Key Patterns

- **Filtering/sorting** happens inside page components by deriving from `NotesContext` state. Sort options: date created (newest/oldest), last edited (newest/oldest), color.
- **Icons** come from `lucide-react`; the `@iconify-json/solar` icon set is also available.
- **Tailwind v4** is configured via the `@tailwindcss/vite` plugin — there is no separate `tailwind.config.js`; all customization goes through CSS variables in `src/index.css`.
- **Supabase client** is a singleton at `src/lib/supabase.js`. DB row → frontend shape conversion is done in `src/utils/mappers.js` (`toNote`, `toFolder`, `toNoteRow`, `toFolderRow`). Note colors must be one of the keys in `NOTE_COLOR_CLASSES` (`yellow`, `red`, `green`, `orange`, `blue`, `gray`) — there is no `"default"` color.
- **Auth flow:** `ProtectedRoute` (`src/components/ProtectedRoute.jsx`) redirects unauthenticated users to `/login`. `NotesContext` clears all data when the user signs out.
- Folder assignment: a note's `folderId` field links it to a folder; deleting a folder first unassigns its notes in Supabase, then deletes the folder row, then dispatches `DELETE_FOLDER` which nulls `folderId` in local state.

## Testing

```bash
npm run test        # Run all tests once
npm run test:watch  # Re-run on file changes
npm run test:ui     # Vitest browser UI
```

**Stack:** Vitest + React Testing Library + MSW (for Supabase HTTP interception).

**Test file location:** Co-locate with the source file as `ComponentName.test.jsx`.

**Conventions:**
- Pure functions (`notesReducer`, mappers) — unit test directly with no wrappers.
- Context tests (`NotesContext`) — use `renderHook` with a custom wrapper that provides `AuthContext.Provider` directly (avoids real auth) and wraps with `NotesProvider`. MSW intercepts Supabase REST calls.
- Component tests (`NoteCard`, `Dashboard`, etc.) — mock context values directly via `<UIContext.Provider>` / `<NotesContext.Provider>`; wrap with `<MemoryRouter>` for any component that uses `Link` or routing hooks. Action functions are `vi.fn()` mocks.

**MSW setup:**
- Server: `src/test/mocks/server.js`
- Default handlers + shared fixtures (`noteRow`, `folderRow`, `SUPABASE_URL`): `src/test/mocks/handlers.js`
- Global setup (start/reset/close server, import jest-dom matchers): `src/test/setup.js`
- Override a handler for a single test with `server.use(http.patch(...))` — `afterEach` resets to defaults automatically.
- `onUnhandledRequest: "error"` is set — add a handler for any new Supabase endpoint touched by new tests.
