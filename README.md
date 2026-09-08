# Soumik Adhikary — Full Stack MERN Developer Portfolio

A complete, production-ready **MERN stack portfolio** with a premium public site and a
protected **Admin Panel** that lets you update *everything* — profile, photo, resume,
skills, experience, projects, education, certifications and contact messages — **without
touching the source code**.

> All portfolio content is seeded from the real resume of Soumik Adhikary.
> Nothing on the site is invented.

---

## ✨ Overview

| Piece     | Tech                                                      |
| --------- | --------------------------------------------------------- |
| Frontend  | React (Create React App), React Router DOM 6, Context API, plain CSS3 (design system, dark/light themes) |
| Backend   | Node.js, Express.js REST API, JWT auth, Bcrypt, Helmet, CORS, express-validator, Multer |
| Database  | MongoDB + Mongoose (Atlas-ready)                          |
| Files     | Cloudinary (production) with automatic local-disk fallback (`server/uploads`) |
| Deploy    | Frontend → Vercel · Backend → Render · DB → MongoDB Atlas  |

### Public portfolio (`/`)

- Hero with your professional photo, MERN stack chips and a **BUILD → SHIP → SCALE** strip
- About, categorized Skills, Experience timeline, **featured FoodyGo project** + more projects,
  Education & Certifications, Contact form (stored in MongoDB), resume download buttons
  (navbar, hero, footer)
- Dark/light theme (persisted in `localStorage`), subtle scroll-reveal animations,
  `prefers-reduced-motion` support, responsive from 1920px down to 375px
- SEO: semantic HTML, meta/Open-Graph/Twitter tags, `robots.txt`, `sitemap.xml`
- Custom 404 page, loading states, API error banner with retry

### Admin panel (`/admin`)

- JWT login (`/admin/login`) with bcrypt-hashed credentials (never stored in frontend code)
- Dashboard overview (projects / skills / messages / resume / profile status)
- Full CRUD: Skills (+ reorder, + categories), Experience, Projects (+ featured toggle),
  Education, Certifications
- **Profile photo upload** — click or drag & drop, JPG/JPEG/PNG/WEBP, live preview before saving
- **Resume management** — preview / download / **replace** / delete the PDF; every public
  “Download Resume” button automatically serves the latest upload
- Contact message inbox with Unread / Read / Replied statuses and delete
- Site settings: SEO title/description, footer note, hero strip steps
- Change admin password (bcrypt)

---

## 📁 Folder structure

```
portfolio/
├── client/                        # React frontend (Create React App)
│   ├── public/
│   │   ├── index.html             # SEO + Open Graph metadata
│   │   ├── images/profile.jpg     # bundled fallback portrait
│   │   ├── robots.txt · sitemap.xml · favicon
│   └── src/
│       ├── components/            # Navbar, Footer, icons, shared UI
│       │   └── admin/kit.js       # admin form primitives (toast, fields, …)
│       ├── sections/              # Hero, About, Skills, Experience, Projects, …
│       ├── pages/                 # HomePage, NotFoundPage
│       │   └── admin/             # Login, Layout, Dashboard + 10 admin pages
│       ├── context/               # ThemeContext, AuthContext, PortfolioContext
│       ├── services/api.js        # single axios layer (public / admin)
│       ├── styles/                # global.css (design system) + admin.css
│       ├── utils/                 # formatting helpers
│       ├── App.js · index.js
│   └── package.json               # CRA — dev proxy → http://localhost:5000
│
├── server/                        # Express REST API
│   ├── config/                    # db.js, cloudinary.js (optional)
│   ├── controllers/               # auth, profile, CRUD, contact, upload, overview
│   ├── middleware/                # JWT auth, error handler, multer, validation, rate-limit
│   ├── models/                    # Admin, Profile, Skill, Experience, Project,
│   │                              # Education, Certification, ContactMessage, SiteSettings
│   ├── routes/                    # /api/auth /api/profile /api/skills … /api/upload
│   ├── services/storageService.js # Cloudinary OR local disk (automatic)
│   ├── seed-assets/               # initial profile.jpg + resume PDF (committed)
│   ├── uploads/                   # local file storage (gitignored)
│   ├── utils/                     # seed.js (npm run seed), seedData.js, crudFactory
│   ├── server.js
│   └── .env.example
└── README.md
```

---

## 🚀 Quick start (local)

**Prerequisites:** Node.js ≥ 18 and a MongoDB instance (local or Atlas).

```bash
# 1. Install API dependencies
cd server
npm install

# 2. Configure the API
cp .env.example .env
#   → set MONGO_URI, JWT_SECRET (any long random string),
#     ADMIN_EMAIL + ADMIN_PASSWORD for your admin account

# 3. Seed the database with the portfolio content (from the resume)
npm run seed

# 4. Start the API → http://localhost:5000
npm run dev        # (or: npm start)

# 5. In a second terminal — install & start the frontend
cd ../client
npm install
npm start          # → http://localhost:3000
```

Then open:

- **Portfolio:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login
  (use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env` — defaults to
  `admin@soumik.dev` / `Admin@12345` if you didn't set them; **change the password after
  first login** from *Admin → Settings*)

> The CRA dev server proxies `/api/*` and `/uploads/*` to `http://localhost:5000`
> (see `"proxy"` in `client/package.json`) — no CORS setup needed locally.

### Seeding options

| Command             | Behaviour                                                        |
| ------------------- | ---------------------------------------------------------------- |
| `npm run seed`      | Idempotent — fills only collections that are still empty         |
| `npm run seed:fresh`| Wipes content collections (skills, projects, messages…) & reseeds. Admin account is never touched. |

Seeding also installs the bundled `server/seed-assets/` profile photo and resume PDF into
the active storage provider, so the site is fully populated on first run.

---

## 🍃 MongoDB setup

**Option A — local:** install MongoDB Community and use:

```
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
```

**Option B — MongoDB Atlas (free tier works):**

1. Create a cluster at <https://cloud.mongodb.com>
2. Add a database user and allow your IP (or `0.0.0.0/0` for Render)
3. Copy the connection string:

```
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

## ☁️ Cloudinary setup (optional but recommended for production)

If the three `CLOUDINARY_*` variables are set, photos and resumes are stored in Cloudinary.
If they are left empty, the API automatically falls back to disk storage under
`server/uploads` — perfect for local development. No code changes either way.

1. Create a free account at <https://cloudinary.com> → Dashboard
2. Copy the Cloud name, API key and API secret into `server/.env`

## 🔐 Admin setup

The admin account is created automatically on first boot (and by `npm run seed`) from:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-strong-password
```

The password is **hashed with bcrypt before storage** — the plaintext is never saved and
never appears in any API response. Change it anytime from **Admin → Settings → Change
admin password**, or by setting new env values and running `npm run seed:fresh`
(the admin document is only created when no admin exists).

---

## 🔑 Environment variables

### `server/.env` (see `server/.env.example`)

| Variable                 | Required | Description                                            |
| ------------------------ | -------- | ------------------------------------------------------ |
| `MONGO_URI`              | ✔        | MongoDB connection string                              |
| `JWT_SECRET`             | ✔        | Long random string used to sign JWTs                   |
| `JWT_EXPIRES_IN`         |          | Token lifetime (default `7d`)                          |
| `ADMIN_EMAIL`            | ✔        | Initial admin login email (first boot only)            |
| `ADMIN_PASSWORD`         | ✔        | Initial admin password (bcrypt-hashed before storage)  |
| `CLIENT_URL`             | ✔        | Frontend origin(s), comma-separated, for CORS          |
| `PORT`                   |          | API port (default `5000`)                              |
| `NODE_ENV`               |          | `development` / `production`                           |
| `CLOUDINARY_CLOUD_NAME`  |          | Optional — enables Cloudinary storage                  |
| `CLOUDINARY_API_KEY`     |          | Optional                                               |
| `CLOUDINARY_API_SECRET`  |          | Optional                                               |

### `client/.env` (see `client/.env.example`)

| Variable             | Required | Description                                                                 |
| -------------------- | -------- | --------------------------------------------------------------------------- |
| `REACT_APP_API_URL`  |          | Empty locally (dev proxy handles it). In production set to your API root, e.g. `https://your-api.onrender.com` |

**Never commit real `.env` files.** Only `.env.example` placeholders are committed.

---

## 🔌 API reference (summary)

Public:

```
GET  /api/health
GET  /api/profile            GET  /api/skills
GET  /api/experience         GET  /api/projects
GET  /api/education          GET  /api/certifications
GET  /api/settings           GET  /api/resume
GET  /api/resume/download    POST /api/contact
```

Admin (Bearer JWT):

```
POST /api/auth/login        GET  /api/auth/me        PUT /api/auth/change-password
GET  /api/overview
PUT  /api/profile           GET/PUT /api/settings
CRUD /api/skills | /api/experience | /api/projects | /api/education | /api/certifications
     (GET /  GET /:id  POST /  PUT /:id  DELETE /:id  PUT /reorder)
GET  /api/contact           PUT /api/contact/:id/status   DELETE /api/contact/:id
POST /api/upload/photo      DELETE /api/upload/photo
POST /api/upload/resume     DELETE /api/upload/resume
```

Public GET routes expose only non-sensitive fields; all write routes require a valid JWT
with the `admin` role.

---

## 🖼️ How to replace the profile photo

1. Log in at `/admin/login` → **Profile Photo**
2. Click / drag a new JPG, JPEG, PNG or WEBP (≤ 2 MB)
3. Check the preview → **Save new photo**

The public site shows the new photo immediately. You can also delete the photo (the site
then falls back to the bundled portrait). Photos are stored in Cloudinary when configured,
otherwise on the server disk.

## 📄 How to replace the resume

1. Log in at `/admin/login` → **Resume**
2. **Replace resume** → choose a new PDF (≤ 5 MB) → **Save new resume**
3. Done — the navbar, hero and footer **Download Resume** buttons now serve the new file.
   (Preview and Download buttons let you verify it.)

No React code ever needs to change. The old PDF is removed from storage automatically.

---

## 📦 Deployment

### 1. Database — MongoDB Atlas
Create a free cluster, get `MONGO_URI` (see above).

### 2. Backend — Render (or Railway)
- New **Web Service** from your Git repo, root directory `server`
- Build: `npm install` · Start: `npm start`
- Environment: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
  `CLIENT_URL=https://your-frontend.vercel.app`, `NODE_ENV=production`,
  and Cloudinary keys (recommended — Render's disk is ephemeral)
- After the first deploy, run the seed once (Render Shell or locally against Atlas):
  `MONGO_URI=<atlas-uri> npm run seed`

### 3. Frontend — Vercel
- Import the repo, root directory `client` (Vercel auto-detects Create React App)
- Environment: `REACT_APP_API_URL=https://your-api.onrender.com`
- Deploy — then open `https://your-frontend.vercel.app/admin/login` and you're done

### Custom domain / SEO
Point your domain at Vercel, then update `public/sitemap.xml` and the `Sitemap:` line in
`public/robots.txt` with the final URL. SEO title/description can also be edited live from
**Admin → Settings**.

---

## 🛡️ Security notes

- JWT auth with expiry; passwords hashed with bcrypt (12 rounds)
- Protected admin routes + role-based authorization on every write endpoint
- Input validation via express-validator; consistent error envelope
- Helmet security headers; CORS restricted to `CLIENT_URL` origins
- Multer file-type & size limits (images ≤ 2 MB, PDF ≤ 5 MB)
- Login & contact rate limiting; no secrets in the repo or the React bundle
- Public API responses never contain password hashes or storage internal IDs

## 🧰 Useful scripts

| Location | Command           | Purpose                          |
| -------- | ----------------- | -------------------------------- |
| server   | `npm run dev`     | API with nodemon reload          |
| server   | `npm start`       | API for production               |
| server   | `npm run seed`    | Seed empty collections           |
| server   | `npm run seed:fresh` | Reset & reseed content        |
| client   | `npm start`       | CRA dev server (port 3000)       |
| client   | `npm run build`   | Optimized production bundle      |

---

MIT © Soumik Adhikary
