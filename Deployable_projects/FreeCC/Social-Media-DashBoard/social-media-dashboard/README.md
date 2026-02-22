# Social Media Dashboard (React + Vite)

A frontend-only React dashboard project with:
- Routing (`react-router-dom`)
- Global state management (`redux` + `react-redux`)
- Context for auth and theme
- Tailwind CSS v4 styling
- Static mock data (CSS joke posts and stories)

No backend is used in this project.

## Tech Stack
- React 19
- Vite 8
- Redux + React Redux
- React Router DOM
- Tailwind CSS v4 with `@tailwindcss/vite`

## Project Structure
Key folders in `src/`:
- `components/` reusable UI pieces (`Navbar`, `Post`, `ProfileCard`, etc.)
- `contexts/` app-wide context providers (`AuthContext`, `ThemeContext`)
- `hooks/` reusable logic (`usePosts`)
- `pages/` route-level pages (`Feed`, `Profile`, `Settings`, `Login`)
- `store/` Redux store, actions, reducers
- `data/` static mock content (`mockSocialData.js`)

## Run Locally
From `social-media-dashboard/`:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## App Flow
1. `index.html` loads the app shell.
2. `src/main.jsx` mounts React into `<div id="root">`.
3. `src/App.jsx` wraps the app with:
   - Redux `Provider`
   - `ThemeProvider`
   - `AuthProvider`
   - `BrowserRouter`
4. Routes render pages based on URL.

## Authentication (Demo)
- Login is frontend-only and accepts any non-empty username/password.
- Protected routes (`/feed`, `/profile`, `/settings`) require a logged-in user.
- Redirects to `/login` when unauthenticated.

## Theme Toggle
- Theme state is stored in `src/contexts/ThemeContext.jsx`.
- Toggling theme adds/removes the `dark` class on `document.documentElement`.
- Tailwind dark variants are configured in `src/index.css`.

## Data
- Posts and users are static mock data from `src/data/mockSocialData.js`.
- Redux actions/reducers in `src/store/index.js` handle:
  - adding posts
  - liking posts
  - adding comments
  - following users

## Notes
- This is a learning/demo project focused on React concepts and architecture.
- Since data is static, refreshing the app resets runtime changes.
