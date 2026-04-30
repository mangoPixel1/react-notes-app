# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

No test framework is configured.

## Architecture

**Stack:** React 19 + React Router 7 + Tailwind CSS v4 + Vite. No TypeScript, no backend — all state is in-memory (no persistence layer yet).

### State Management

Two contexts in `src/contexts/`, both provided at the root in `App.jsx`:

- **NotesContext** (`NotesContext.jsx`) — `useReducer` managing the `notes` array and `folders` array. Actions cover: add/edit/pin/archive/trash/restore/delete notes, and add/delete folders. Note shape: `{ id, title, body, color, pinned, status ('active'|'archived'|'trashed'), folderId, creationDate, lastEdited, deletedAt }`.
- **UIContext** (`UIContext.jsx`) — manages dark mode toggle, grid/list layout preference, search string, and add-note modal visibility.

### Routing

Defined in `src/components/MainContainer.jsx` using React Router v7:

- Public routes render under `LandingLayout`: `/` (Landing), `/login`, `/signup`
- Protected routes render under `AppLayout` (sidebar + header): `/dashboard`, `/note/:id`, `/folders`, `/folders/:id`, `/archived`, `/trash`, `/profile`, `/settings`

### Key Patterns

- **Filtering/sorting** happens inside page components by deriving from `NotesContext` state. Sort options: date created (newest/oldest), last edited (newest/oldest), color.
- **Icons** come from `lucide-react`; the `@iconify-json/solar` icon set is also available.
- **Tailwind v4** is configured via the `@tailwindcss/vite` plugin — there is no separate `tailwind.config.js`; all customization goes through CSS variables in `src/index.css`.
- Folder assignment: a note's `folderId` field links it to a folder; deleting a folder unassigns its notes (sets `folderId` to `null`).
