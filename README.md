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
| Deployment | Vercel |

## QA & Testing

Manual and automated QA for this app — Playwright end-to-end tests and test documentation (test plans, checklists) — live in a companion repo:

**[noto-qa](https://github.com/mangoPixel1/noto-qa)**

Keeping QA in its own repo mirrors how testing is often organized in real teams: independent from application code, with its own tooling and history.

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
└── utils/        # mappers, date formatting
```

Routing and state management conventions are documented in [`CLAUDE.md`](./CLAUDE.md).
