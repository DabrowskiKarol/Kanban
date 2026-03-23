# Editorial Boards

Editorial Boards is a frontend-only collaborative Kanban web app built with React, TypeScript, Vite, Tailwind CSS, React Router, and Firebase. It follows the provided premium editorial design direction: spacious composition, tonal surfaces, floating work areas, and refined interaction patterns instead of generic boxed dashboard UI.

## Architecture

- `React + TypeScript + Vite` for the app shell and production build
- `HashRouter` for GitHub Pages-friendly SPA routing
- `Tailwind CSS v4` plus custom design tokens in [`src/index.css`](./src/index.css)
- `Firebase Auth` for sign up, login, logout, password reset, and persistent sessions
- `Firestore` for profiles, shared boards, columns, tasks, and membership metadata
- `Firebase Storage` for profile photo uploads
- `React Context` for auth/profile session state
- `dnd-kit` for Kanban drag and drop
- `react-hook-form + zod` for form validation
- `framer-motion` and soft glass modals for subtle motion

## Features

- Full authentication flow:
  - register with first name, last name, email, password, and profile photo
  - login
  - logout
  - forgot password
  - persistent session
- User profile management:
  - update first and last name
  - change profile photo with preview
  - view email
  - change password
- Collaborative boards:
  - create shared boards
  - invite members by email
  - auto-resolve pending invites when invited users sign up or log in
  - board access is scoped to members
- Kanban experience:
  - multiple columns
  - create, edit, and delete columns
  - create, edit, delete, assign, and reprioritize tasks
  - drag tasks across columns
  - due dates and assignees
- Editorial dashboard:
  - board list
  - overview hero
  - quick stats
  - empty states and loading states
- Production extras:
  - toast feedback
  - protected routes
  - sample Firestore and Storage rules
  - GitHub Pages deployment workflow

## Folder Structure

```text
src/
  components/
  context/
  firebase/
  hooks/
  layouts/
  lib/
  pages/
  types/
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

```bash
cp .env.example .env.local
```

3. Fill in your Firebase values in `.env.local`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_BASE_PATH=./
```

4. Start the app:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Firebase Setup

Create a Firebase project and enable:

- Authentication
  - Email/Password provider
- Firestore Database
- Storage

Recommended collections and paths used by the app:

- `users/{uid}`
- `boards/{boardId}`
- `boards/{boardId}/columns/{columnId}`
- `boards/{boardId}/tasks/{taskId}`
- `boards/{boardId}/activity/{activityId}`
- `users/{uid}/...` in Storage for profile photos

## Firestore Notes

- Board membership is tracked by both `memberIds` and `memberEmails`
- Email-based membership lets invited users gain access after creating an account
- The dashboard query uses `memberEmails` for access filtering
- Depending on your Firebase project, Firestore may ask you to create an index for:
  - `memberEmails array-contains`
  - `updatedAt desc`

If Firebase prompts for an index, create it once in the console and the query will work normally after that.

## Security Rules

Example rules are included in:

- [`firestore.rules`](./firestore.rules)
- [`storage.rules`](./storage.rules)

These are a starting point. Review them carefully before using the app with real collaborators.

## GitHub Pages Deployment

This project is configured for static deployment on GitHub Pages.

### Why HashRouter

GitHub Pages does not provide server-side route rewrites for SPA paths like `/boards/:id`. This app uses `HashRouter`, so routes resolve as:

- `/#/app`
- `/#/boards/<id>`
- `/#/profile`

That avoids refresh-routing issues on static hosting.

### Option A: GitHub Actions

The workflow file is included at:

- [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

To use it:

1. Push the repo to GitHub.
2. In your repo settings, enable GitHub Pages and set the source to GitHub Actions.
3. Add these repository secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Push to `main`.

### Option B: gh-pages package

The project also includes deploy scripts:

```bash
npm run deploy
```

That publishes the `dist` folder using the `gh-pages` package.

## GitHub Pages Limitations

- Hash-based URLs are used intentionally for compatibility.
- Firebase must allow your GitHub Pages domain in Authentication authorized domains.
- Storage and Firestore rules still determine real access, even though the frontend is static.

## Design Source of Truth

The UI implementation follows the premium editorial system described in `S:/DESIGN.md`:

- dark navy instead of pure black
- tonal layering over hard borders
- Manrope for headings, Inter for body copy
- soft ambient shadowing
- matte-glass modals
- spacious asymmetrical layout

## Verification

Build verified locally with:

```bash
npm run build
```

The current production build succeeds. Vite reports a large bundle warning because Firebase and the current route graph are bundled together; functionality is unaffected, but route-level code splitting would be a sensible next optimization.
