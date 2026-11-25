# Node.js — TechCall Student Management

A small Express and MySQL demo application for user login and admin-only student management.

## အကျဉ်း — ဒီ project က ဘာလဲ? (At a glance)

| | |
| --- | --- |
| **Project** | Node.js — TechCall Student Management |
| **အမျိုးအစား** | Express + MySQL learning demo — login နဲ့ admin-only student CRUD |
| **ဘာလုပ်ပေးလဲ** | Register/login (session), `scrypt` password hashing, admin ကပဲ student ထည့်/ကြည့်/ပြင်/ဖျက်, ကျန်တဲ့ user က welcome page ပဲ မြင်ရပါတယ် |
| **Tech** | Node.js + Express 5 + `express-session` · MySQL (`mysql2`) · `crypto.scrypt` · plain HTML/CSS/JS |
| **Ports** | `http://localhost:8000` · MySQL `3306` |
| **Admin account** | `admin` username ရှိသူကပဲ dashboard နဲ့ student page ဖွင့်လို့ရပါတယ် — register လုပ်ပြီး စမ်းလို့ရပါတယ် |
| **အခြေအနေ** | `.env.example` ပါပါတယ်။ မသတ်မှတ်ရင် dev-only defaults (`root` / empty password / `techcall`) သုံးပါတယ်။ Schema file မပါပါ။ |

**In short (English):** A learning demo with Express and MySQL: session-based registration/login, `scrypt` password hashing and student CRUD restricted to the `admin` user. Plain HTML pages with `fetch`, no build step; `project/second.js` is a separate in-memory sample API.

## Overview

This repository contains a learning project built with Express and MySQL. The active application is `project/server.js`. It serves plain HTML pages from `project/public`, uses `express-session` for login state, and stores users and students in a MySQL database. Users logged in as `admin` can add, list, edit, and delete students; other users only see a welcome message. `project/second.js` is a separate, self-contained sample API backed by an in-memory list.

## Visual guide — what the diagram shows

<img src="docs/images/overview.svg" alt="Schematic request flow of the Node.js project" width="700">

This is a **schematic diagram, not a screenshot**. It shows a browser request reaching the Express server in `project/server.js`, the `scrypt` password helper in `project/password.js`, and the MySQL connection configured in `project/db.js`. No full-page screenshots are committed to this repository.

## Features

- Registration and login pages with session-based authentication
- Passwords hashed with Node's built-in `crypto.scrypt` (legacy plaintext rows are still accepted for compatibility)
- Admin guard: only the `admin` user can open the dashboard and student pages
- Student CRUD backed by MySQL: create, list, read one, update, delete
- Plain HTML/CSS pages with client-side `fetch` calls, served as static files
- Optional standalone demo API (`project/second.js`) with an in-memory list

## Tech stack

| Layer | Technologies |
| --- | --- |
| Runtime | Node.js |
| Server | Express 5, `express-session` |
| Database | MySQL via `mysql2` |
| Security | Node.js built-in `crypto.scrypt` for password hashing |
| Front end | Plain HTML, CSS, and browser JavaScript (no build step) |

## Prerequisites

- Node.js and npm
- A running MySQL server

## Installation

```bash
git clone https://github.com/thwinthwin-spec/Node.js.git
cd Node.js
npm install
```

Create a MySQL database named `techcall` with `users` and `students` tables matching the queries in `project/server.js` (`users`: `id`, `username`, `password`; `students`: `id`, `name`, `age`, `grade`). No schema or migration file is included in this repository.

Database connection settings come from environment variables (see `.env.example` at the repository root). With no variables set, clearly labelled development-only defaults (`localhost`, `root`, empty password, `techcall`) are used.

## Usage

There is no npm start script; run the files directly. Run the commands below from the `project/` directory, because `express.static("public")` resolves relative to the current working directory:

```bash
cd project
node server.js
```

To use a `.env` file, copy the root `.env.example` to `.env` and start the app with Node's built-in env-file support (Node 20+, no extra package):

```bash
cd project
node --env-file=../.env server.js
```

You can also export the variables in your shell before starting the server. The app listens on `http://localhost:8000`.

To try the separate in-memory demo instead, run `node second.js` from the same directory. It also uses port 8000, so do not run both files at the same time.

### Routes

`project/server.js`:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Registration page |
| GET | `/login` | Login page |
| GET | `/dashboard` | Dashboard (admin only) |
| GET | `/student` | Add-student page (admin only) |
| GET | `/edit-student/:id` | Edit-student page (admin only) |
| POST | `/register` | Create user |
| POST | `/login` | Log in and create session |
| GET | `/logout` | Destroy session |
| POST | `/add-student` | Create student (admin only) |
| GET | `/students` | List all students as JSON (admin only) |
| GET | `/student/:id` | Get one student as JSON (admin only) |
| POST | `/update-student/:id` | Update student (admin only) |
| GET | `/delete-student/:id` | Delete student (admin only) |

`project/second.js` (only when run directly):

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Plain-text welcome message |
| GET | `/list` | In-memory list of sample people |

### Environment variables

Copy `.env.example` to `.env` at the repository root and adjust it as needed. `.env` is git-ignored.

| Variable | Default in code | Purpose |
| --- | --- | --- |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_USER` | `root` | MySQL user |
| `DB_PASS` | *(empty)* | MySQL password |
| `DB_NAME` | `techcall` | MySQL database |
| `NODE_ENV` | *(unset)* | Set to `production` to require a real session secret |
| `SESSION_SECRET` | development-only fallback | Secret used by `express-session` |

The database defaults are for local development only and should be overridden elsewhere. `SESSION_SECRET` is required when `NODE_ENV=production`; the app throws a clear error at startup if it is missing. Otherwise a clearly labelled development-only fallback is used and a warning is logged.

### Security caveats

- New registrations are stored as `scrypt$salt$hash` using a random 16-byte salt and a 64-byte derived key (`project/password.js`). Login verifies new rows with `scrypt` and still accepts existing plaintext rows using a constant-time comparison, so older accounts are not locked out.
- Existing plaintext rows are **not** automatically upgraded. Re-create affected accounts or migrate them to the `scrypt$salt$hash` format.
- Admin access is still determined by the hardcoded username `admin`, and this demo has no rate limiting, CSRF protection, or hardened session-cookie settings. Do not expose it publicly without addressing these.
- `project/second.js` is an unrelated demo and does not use any of these settings.

## Project structure

```text
Node.js/
├── package.json
├── .env.example           # Configuration template (copy to .env)
├── config/
│   └── secrets.js         # Secret resolution helper (production requires env)
├── project/
│   ├── server.js          # Active Express application
│   ├── db.js              # MySQL connection (environment-driven)
│   ├── password.js        # scrypt hashing and legacy verification
│   ├── second.js          # Standalone in-memory demo API
│   └── public/            # Static HTML pages
│       ├── register.html
│       ├── login.html
│       ├── addstudent.html
│       ├── dashboard.html
│       ├── editstudent.html
│       └── home.html
```

## License

Released under the [MIT License](LICENSE).

## Author

Thwin Htoo Aung
