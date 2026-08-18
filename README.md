# Noto

A full-stack notes app — folders, archiving, trash with restore, pinning, search, and dark mode — built with React and Supabase.

**Live demo:** https://react-notes-app-pink-rho.vercel.app/

> **Why this project exists:** This is a personal learning project, built to practice full-stack React development and to get hands-on with manual and automated QA. Code was written through a mix of hand-written implementation and AI-assisted pair programming (Claude Code); every AI-generated change was reviewed, tested, and iterated on rather than accepted blindly.

---

## Features

- **Notes** — create, edit, color-tag, and pin notes; move to archive or trash
- **Trash & Archive** — soft-delete flow with restore and permanent delete, including bulk select
- **Folders** — organize notes into folders
- **Search** — global search modal across notes
- **Auth** — email/password sign up, login, forgot/reset password, "remember me" sessions (via Supabase Auth)
- **Settings** — theme (light/dark/system), default note color/sort/view, change password, export/import notes as JSON, delete account data
- **Responsive UI** — collapsible sidebar, mobile-friendly layout, toast notifications
- **Row-level security** — Supabase Postgres with RLS so each user only ever sees their own data

## Tech stack

| Layer      | Choice |
|------------|--------|
| Frontend   | React 19, React Router 7, Vite |
| Styling    | Tailwind CSS v4 |
| Backend    | Supabase (Postgres, Auth) |
| Icons      | lucide-react |
| Testing    | Vitest, React Testing Library, MSW (mocked Supabase HTTP calls) |
| Deployment | Vercel |

## Testing

This project doubles as practice for manual and automated QA — the test suite covers reducers, contexts, and components:

```bash
npm run test        # run all tests once
npm run test:watch  # re-run on file changes
npm run test:ui     # open the Vitest browser UI
```

- **Unit tests** — pure functions like the notes reducer and Supabase row/frontend mappers
- **Context tests** — `NotesContext`/`UIContext` behavior via `renderHook`, with MSW intercepting Supabase REST calls instead of hitting a real database
- **Component tests** — pages and components rendered with mocked context, verifying user interactions (e.g. selecting/restoring/deleting notes, changing settings) rather than implementation details

Manual QA passes (auth edge cases, responsive breakpoints, cross-browser checks) are done directly against the deployed preview on each change.

## Getting started

```bash
npm install
npm run dev       # start the dev server with HMR
```

Other scripts:

```bash
npm run build     # production build
npm run lint      # ESLint check
npm run preview   # preview the production build locally
```

You'll need a Supabase project (Postgres tables for `notes` and `folders`, with RLS policies scoping rows to `auth.uid()`) and to point `src/lib/supabase.js` at your own project URL and anon key.

## Project structure

```
src/
├── components/   # reusable UI (NoteCard, Sidebar, modals, toggles, ...)
├── contexts/     # AuthContext, NotesContext, UIContext (state management)
├── layouts/      # AppLayout (authenticated shell), LandingLayout
├── lib/          # Supabase client
├── pages/        # route-level views (Dashboard, Folders, Trash, Settings, ...)
├── utils/        # mappers, date formatting
└── test/         # MSW mock server and shared test setup
```

Routing, state management, and testing conventions are documented in [`CLAUDE.md`](./CLAUDE.md).
