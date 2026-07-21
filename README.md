# Trello Application - Frontend

This is the frontend of a Trello clone I built with React. I started this project to recreate the main Trello workflows and work through problems that usually appear in interactive applications, such as drag and drop, permissions, optimistic updates, and realtime synchronization.

The backend is in the sibling `BE` directory.

## Features

- Email/password and Google authentication
- Workspace, board, list, and card management
- List and card drag and drop with `dnd-kit`
- Workspace and board member permissions
- Card members, due dates, priorities, and labels
- Checklists, comments, and attachments
- Kanban, Table, Calendar, and Analytics views
- Board and card search with direct card URLs
- Notifications, favorites, and activity history
- Realtime updates through Socket.IO
- Dark mode and responsive layouts
- Board templates, with optional AI generation when Gemini is configured on the backend

Some areas are still in progress, mainly authenticated E2E coverage, the complete archive/restore flow, and performance on boards with a large number of cards.

## Tech stack

- React 19 and Vite
- React Router
- TanStack Query
- Zustand and React Context
- Axios and Socket.IO Client
- Tailwind CSS and Radix UI
- React Hook Form and Zod
- dnd-kit
- Vitest, React Testing Library, and Playwright

## Project structure

```text
src/
├── api/          # API clients
├── Components/   # Shared components
├── features/     # Feature-specific code
├── hooks/        # Shared hooks
├── Layouts/      # Application layouts
├── Pages/        # Route pages
├── providers/    # Theme, socket, and toast providers
├── query/        # Shared query keys
├── routes/       # Route guards
├── store/        # Zustand stores
└── utils/        # Helpers and formatters
```

TanStack Query handles server data. Zustand stores small application-wide state such as authentication and UI preferences. Board data is normalized into `lists`, `cards`, and `users` maps because this makes drag-and-drop and realtime updates easier to manage.

## Local setup

Node.js 22 or newer is recommended. The backend also needs to be running for authenticated features.

```bash
npm install
```

Create `.env` from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Set the required environment variables:

```env
VITE_API_URI=http://localhost:5000
VITE_SOCKET_URI=http://localhost:5000
VITE_GOOGLE_CLIENT_API=
VITE_CLOUDINARY_API_URL=
VITE_CLOUDINARY_NAME=
```

Start the development server:

```bash
npm run dev
```

The application runs at `http://localhost:5173` by default.

## Available scripts

- `npm run dev`: start the development server
- `npm run build`: create a production build
- `npm run preview`: preview the production build
- `npm run lint`: run ESLint
- `npm test`: run Vitest in watch mode
- `npm run test:run`: run the unit tests once
- `npm run test:coverage`: generate the coverage report
- `npm run e2e`: run the Playwright tests
- `npm run check`: run lint, unit tests, and the production build

## Testing

The current unit tests cover the board reducer, API error handling, and persisted board filters.

Playwright coverage:
- `e2e/smoke.spec.js` — guest UI (login/register headings, 404, protected redirect) with a mocked unauthenticated session
- `e2e/auth.spec.js` — real login/logout/register against the backend using seeded demo accounts
- `e2e/role-matrix.spec.js` — two isolated owner/viewer sessions verifying read-only enforcement and realtime board updates

Frontend CI runs **smoke only** (`npm run e2e:smoke`) because Actions checks out this repo alone (no sibling `../BE`). Full `npm run e2e` / `e2e:auth` needs a local layout with `FE` and `BE` side by side, MongoDB, and demo seed.

Authenticated E2E needs MongoDB running, the backend dependencies installed, and demo users seeded (the Playwright `globalSetup` runs `npm run seed:demo` in `../BE` automatically unless `E2E_SKIP_SEED=1`). When `../BE` is missing, seed and auth specs are skipped automatically.

Chromium needs to be installed before running Playwright for the first time:

```bash
npx playwright install chromium
npm run e2e
```

Useful scripts:

```bash
npm run e2e:smoke
npm run e2e:auth
npm run e2e:roles
```

Demo credentials (from `BE` seed):

```text
owner@demo.local / Demo123!
```

Before committing, I normally run:

```bash
npm run check
npm run e2e
```

## Notes

- Do not put API secrets or database credentials in `VITE_*` variables. Vite exposes these values in the browser bundle.
- Authentication uses cookies, so the backend `CLIENT_URL`, CORS settings, and cookie configuration must match the frontend URL.
- Client-side permission checks are only used for the interface. The backend remains responsible for enforcing access control.
