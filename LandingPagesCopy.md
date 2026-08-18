# Landing & Public Pages — Content Draft

Simple copy draft for the unauthenticated pages (Home, Features, Pricing, About, Contact). Grounded in what's actually built per `ProductOverview.md` and `src/contexts/NotesContext.jsx` — no tags, no sharing/collaboration, no markdown, no version history, no real-time multi-device push (data just persists to the account via Supabase).

Note: the current `featuresList` in `src/pages/Landing.jsx` mentions tags, collaboration/sharing, version history, and Markdown — none of these exist in the app. Copy below replaces those claims with real features.

---

## Home (`/`)

**Hero headline:** Capture what's on your mind

**Subhead:** A simple place to write, organize, and find your notes — saved to your account, available whenever you sign in.

**Primary CTA:** Sign up
**Secondary CTA:** Log in

**How it works (3 steps):**
1. Create an account
2. Write a note — give it a title, a color, and a body
3. Organize with folders, pins, and colors, then find it again with search

**Feature highlights (short, for the home page):**
- Quick note-taking with color and pinning
- Folders to keep related notes together
- Fast search across your notes
- Light and dark mode, grid or list view

---

## Features (`/features`)

**Headline:** Everything you need, nothing you don't

**Intro:** Noto keeps note-taking simple — no clutter, no learning curve.

**Note creation & editing**
Give every note a title, a body, and a color. Edits are explicit — save or cancel, nothing is auto-saved as you type.

**Colors & pinning**
Choose from six colors to visually group notes at a glance. Pin the notes that matter most so they stay at the top.

**Folders**
Group related notes into folders. Removing a folder never deletes its notes — they simply become unfiled.

**Archive & trash**
Set notes aside without deleting them, or send them to trash. Restore anytime, or delete permanently when you're sure.

**Search**
Find any note instantly by title or body as you type.

**Grid or list view**
Browse your notes the way you prefer — your choice is remembered between visits.

**Light & dark mode**
Switch themes to match your preference, remembered across sessions.

**Your notes, your account**
Everything is tied to your account and persists across devices and sessions — sign in anywhere to see the same notes.

---

## Pricing (`/pricing`)

**Headline:** Free to use

**Body:** Noto is free — create an account and start taking notes. There are no paid plans or usage limits today.

*(Simple one-tier layout: "Free" card listing note-taking, folders, search, archive/trash, light & dark mode, sign-up CTA. No pricing table needed since there's only one tier.)*

---

## About (`/about`)

**Headline:** Why Noto

**Body:** Noto is built to be a fast, distraction-free place to jot things down — a quick thought, a list, a reminder — and find it again later. No formatting to fuss over, no extra steps between having an idea and writing it down.

It's a single-user app: your notes are yours, with no sharing or visibility into anyone else's notes.

*(Keep this short — there's no team, company history, or founder story in the product today, so avoid inventing one. If a real "our story" section is wanted later, that content needs to come from the actual team.)*

---

## Contact (`/contact`)

**Headline:** Get in touch

**Body:** Questions or feedback? Reach out at **[support email — needs a real address]**.

*(There's currently no backend to receive a contact form submission, so a simple `mailto:` link is the honest option until a form + email service is wired up. Don't ship a contact form that doesn't actually send anywhere.)*

---

## Open items before implementing

- Pick a real support/contact email address.
- Decide if Features/Pricing/About/Contact are separate routes or sections on the single Landing page (currently only `/`, `/login`, `/signup` exist under `LandingLayout`).
- Update or remove `featuresList` in `src/pages/Landing.jsx` — it currently advertises tags, sharing, version history, and Markdown, none of which are implemented.
- "Completely Free" is accurate today (no billing exists), but revisit if pricing tiers are ever added.
