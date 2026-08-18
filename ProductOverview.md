# Product Overview

## Project Summary

**Noto** is a web-based note-taking application. Signed-in users can create, edit, organize, and search personal notes through a clean, responsive interface with light and dark modes.

Notes and folders are saved to a real account, not just the browser — so a user's data is the same whether they log in from their laptop or phone.

---

# Purpose

The goal of Noto is to give users a fast, simple way to capture short notes, organize them, and find them again later.

The application emphasizes:

- A simple, distraction-free note editor
- Lightweight organization through color, pinning, and folders
- Fast search
- A layout that works well on both mobile and desktop
- Reliable saving tied to a user's account

---

# Target Users

Noto is intended for individual users who want to:

- Jot down quick notes
- Visually group notes by color
- Group related notes into folders
- Set notes aside (archive) or discard them (trash) without losing them right away
- Search their own notes by keyword

This is a **single-user** app — there is no sharing, collaboration, or visibility into another user's notes.

---

# Technology Stack

| Area              | Technology                          |
| ----------------- | ------------------------------------ |
| Frontend          | React                                 |
| Styling           | Tailwind CSS                          |
| Build Tool        | Vite                                   |
| Language          | JavaScript                            |
| Backend / Storage | Supabase (handles accounts, notes, and folders) |
| Testing           | Automated tests (Vitest + React Testing Library) |

---

# Core Features

## Accounts & Sign-in

- Sign up and log in with email and password.
- New accounts require confirming via an emailed link before use.
- Only signed-in users can access notes; signed-out users are sent to the login page.
- A profile page and a settings page exist but are placeholders today — they don't yet support editing account details or app preferences.

## Note Management

- Create a note with a title, body, and color (all three are required).
- Edit a note's title and body, with explicit Save/Cancel actions — edits are not auto-saved as you type.
- Pin or unpin a note so it stands out at the top of the list.
- Archive a note to set it aside, or unarchive it.
- Move a note to Trash, restore it, or permanently delete it (permanent deletion asks for confirmation first).
- Assign a note to a folder, or remove it from one.
- Notes are plain text — no rich formatting, checklists, or attachments.

## Organization

- **Folders** — a single level of folders (no folders-within-folders). Deleting a folder does not delete its notes; the notes simply become unfiled.
- **Colors** — each note has one color, chosen from a fixed set of six.
- **Pinning** — any note can be pinned independent of its folder or color.
- There are currently no tags, categories, or favorites — organization is by folder, color, and pin only.

## Search

- A search box (opened from the header) matches a typed keyword against a note's title and body.
- Results update live as the user types and only include notes that are active (not archived or trashed).

## Interface

- Grid or list view for notes, remembered between visits.
- Dark mode / light mode, remembered between visits.
- Responsive layout that adapts from mobile to desktop.

---

# User Workflow

Typical flow for a signed-in user:

1. Sign up or log in.
2. Land on the dashboard, seeing pinned notes and all active notes.
3. Create a note, choosing a title, body, color, and optional folder.
4. Open a note to view, edit, pin, move to a folder, archive, or trash it.
5. Organize notes into folders from the Folders page.
6. Use search to find a note by keyword.
7. Review archived notes and restore or trash them.
8. Review trashed notes and restore them or delete them permanently.

---

# Functional Requirements

- A signed-up, confirmed user can log in and see only their own notes and folders.
- A note can only be created when title, body, and color are all provided.
- Edits to a note's title/body are only saved when the user confirms; canceling discards changes.
- Notes can be pinned/unpinned, archived/unarchived, and trashed/restored.
- Permanently deleting a note requires confirmation and cannot be undone.
- Notes and folders persist across page refreshes and across devices.
- Search results update as the user types and only include active notes.
- Deleting a folder unfiles its notes rather than deleting them.
- Archived and trashed notes are excluded from the main dashboard view.

---

# Non-Functional Requirements

## Performance

- The app shows loading placeholders while notes are first fetched.
- Searching and sorting feel instant since they happen against notes already loaded in the app.

## Accessibility

- Not yet verified against accessibility standards — a good area for dedicated testing.

## Responsiveness

- Designed to work across desktop, tablet, and mobile screen sizes.

## Reliability

- Note and folder changes are saved directly to the account as they happen.

---

# Assumptions

- Users have a modern browser with JavaScript enabled.
- An internet connection is required — the app is not designed to work offline.
- Each user only ever sees and interacts with their own notes.

---

# Constraints

- All notes and folders require an account — there's no guest or local-only mode.
- Note color must be chosen from a fixed set of six options.
- No collaboration or note sharing between accounts.

---

# Future Enhancements

Potential future features:

- Rich text or markdown support
- Password reset
- A functional profile and settings experience
- Tags in addition to folders and colors
- Attachments

---

# Testing Impact

This document reflects how the application actually behaves today and is meant as a foundation for:

- Test Strategy
- Test Plan
- Manual Test Cases
- Exploratory Testing
- Automated End-to-End Tests
- Regression Testing

The project already has an automated test suite covering core note behavior, which can help inform where to focus additional manual and exploratory testing.
