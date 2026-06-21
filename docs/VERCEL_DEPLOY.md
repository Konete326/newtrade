# Deployment Guide — Trader Desktop

---

## Architecture (Split Deployment)

```
┌─────────────────────┐       ┌─────────────────────────┐       ┌──────────────────┐
│   Frontend (Vercel)  │──────▶│  Backend (Render/Railway)│──────▶│ MongoDB Atlas    │
│   React + Vite       │  API  │  Node.js + Express 5    │       │ (Atlas Free)     │
│   Static hosting     │       │  Always-on server       │       │                  │
└─────────────────────┘       └─────────────────────────┘       └──────────────────┘
```

- **Frontend** → Vercel (static, auto-deploys from GitHub)
- **Backend** → Render or Railway (persistent Node.js server, NOT serverless)
- **Database** → MongoDB Atlas (already configured)

> **Why NOT Vercel for backend?** Express 5 + MongoDB persistent connections don't work well on serverless (cold starts, connection limits, 10s timeout). Use Render/Railway instead.

---

## Step 1 — Deploy Backend (Render)

### 1.1 Push to GitHub
Already done. Your repo: `https://github.com/Konete326/newtrade`

### 1.2 Create Render Account
Go to [render.com](https://render.com) → Sign up with GitHub

### 1.3 Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo: `Konete326/newtrade`
3. Set these options:

| Field | Value |
|---|---|
| **Name** | `trader-desktop-api` |
| **Region** | Singapore or closest |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Starter $7/mo for always-on) |

### 1.4 Add Environment Variables
In Render Dashboard → Environment → Add:

| Variable | Value |
|---|---|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB Atlas URI (from `server/.env`) |
| `JWT_SECRET` | Your existing JWT secret (from `server/.env`) |
| `JWT_REFRESH_SECRET` | Your existing refresh secret |
| `JWT_ACCESS_EXPIRY` | `15m` |
| `JWT_REFRESH_EXPIRY` | `7d` |
| `FIELD_ENCRYPTION_KEY` | Your encryption key (exactly 32 chars) |
| `SUPER_ADMIN_EMAIL` | `admin@traderdesktop.com` |
| `SUPER_ADMIN_PASSWORD` | Your admin password |
| `SUPER_ADMIN_NAME` | `Super Admin` |
| `FRONTEND_URL` | `http://localhost:5173,https://your-vercel-app.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `CLOUDINARY_FOLDER` | `trader-desktop` |

### 1.5 Deploy
Click **Create Web Service**. Render will:
- Clone the repo
- Run `npm install` in the `server/` directory
- Start with `npm start`
- Give you a URL like: `https://trader-desktop-api.onrender.com`

### 1.6 Verify
Visit: `https://trader-desktop-api.onrender.com/health`
Should return: `{"success":true,"message":"Trader Desktop API is running"}`

> **MongoDB Atlas**: Make sure Network Access allows `0.0.0.0/0` (all IPs) so Render can connect.

---

## Step 2 — Deploy Frontend (Vercel)

### 2.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub: `Konete326/newtrade`
3. Vercel will detect the project. Set these:

| Field | Value |
|---|---|
| **Root Directory** | `client` |
| **Framework** | Vite (auto-detected) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 2.2 Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|---|---|---|
| `VITE_API_URL` | `https://trader-desktop-api.onrender.com/api/v1` | Production |
| `VITE_API_URL` | `/api/v1` | Development, Preview |
| `VITE_STORAGE_ENCRYPTION_KEY` | Your encryption key | All |

### 2.3 Deploy
Click **Deploy**. Vercel will:
- Clone repo
- Run `npm run build` in `client/`
- Deploy static files
- Give you a URL like: `https://newtrade.vercel.app`

### 2.4 Update Backend CORS
Go back to **Render** → Environment Variables → Update:

| Variable | Value |
|---|---|
| `FRONTEND_URL` | `http://localhost:5173,https://newtrade.vercel.app` |

Redeploy backend to apply.

---

## Step 3 — Connect & Verify

### Flow:
```
User visits: https://newtrade.vercel.app
       ↓
Frontend calls: https://trader-desktop-api.onrender.com/api/v1/auth/login
       ↓
Backend connects to MongoDB Atlas
       ↓
Returns JWT token
       ↓
Frontend stores token, loads dashboard
```

### First Login:
- URL: `https://newtrade.vercel.app`
- Email: `admin@traderdesktop.com`
- Password: (your `SUPER_ADMIN_PASSWORD`)

---

## Step-by-Step Summary (What YOU Need To Do)

1. **Render** → Create account → New Web Service
   - Root: `server`, Build: `npm install`, Start: `npm start`
   - Add all env vars from the table above
   - Deploy → Copy the URL (e.g. `https://trader-desktop-api.onrender.com`)

2. **Vercel** → Create project → Import GitHub repo
   - Root: `client`, Framework: Vite
   - Add `VITE_API_URL` = your Render URL + `/api/v1`
   - Deploy → Copy the URL (e.g. `https://newtrade.vercel.app`)

3. **Render** → Update `FRONTEND_URL` with Vercel URL → Redeploy

4. **MongoDB Atlas** → Network Access → Add `0.0.0.0/0`

5. **Done** — Visit Vercel URL and login!

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **CORS error in browser console** | Update `FRONTEND_URL` on Render with exact Vercel URL (no trailing slash) |
| **Can't login / 500 error** | Check Render logs. Usually MongoDB connection or missing env var |
| **MongoDB connection timeout** | Atlas → Network Access → Add `0.0.0.0/0` |
| **Render free plan sleeps** | Free plan sleeps after 15min inactivity. First request takes 30-60s to wake up. Upgrade to Starter ($7/mo) for always-on |
| **Build fails on Vercel** | Check that Root Directory is set to `client` |
| **Build fails on Render** | Check that Root Directory is set to `server` |
| **White screen after deploy** | Check `VITE_API_URL` is set correctly (Production only, not Preview/Dev) |

---

## Alternative: Railway for Backend

If you prefer Railway over Render:

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set Root Directory: `server`
3. Add same env vars as Render table above
4. Railway gives you a URL like `https://trader-api.up.railway.app`
5. Use that URL in Vercel's `VITE_API_URL`

Railway has no cold-start/sleep issues on free tier ($5/month credit).
# Vercel Deployment Guide
# Trader Desktop

---

## Architecture on Vercel

- Frontend: React + Vite (Vercel static hosting)
- Backend: Node.js + Express (Vercel serverless functions)
- Database: MongoDB Atlas (external)
- Redis: Optional (features degrade gracefully without it)
- File Uploads: Cloudinary (Vercel filesystem is read-only)

---

## Step 1 — Deploy Backend

1. Go to vercel.com → New Project
2. Import your GitHub repo
3. Set Root Directory: `backend`
4. Framework: Other
5. Build Command: `echo 'No build step'`
6. Output Directory: (leave empty)
7. Install Command: `npm install`

### Required Environment Variables (Backend)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Random 32+ char string |
| `JWT_REFRESH_SECRET` | Random 32+ char string |
| `FIELD_ENCRYPTION_KEY` | Exactly 32 chars |
| `SUPER_ADMIN_EMAIL` | Your admin email |
| `SUPER_ADMIN_PASSWORD` | Strong password |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your frontend Vercel URL (after deploying frontend) |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `CLOUDINARY_FOLDER` | `trader-desktop` |

### Optional Environment Variables (Backend)

| Variable | Purpose |
|---|---|
| `REDIS_URL` | Redis connection (app works without it) |
| `GEMINI_API_KEY` | Jarvis AI assistant |
| `OPENAI_API_KEY` | AI fallback |
| `GROQ_API_KEY` | AI fallback |
| `FIREBASE_PROJECT_ID` | Google login |
| `CORS_ORIGINS` | Extra allowed origins |
| `SMTP_HOST` | Email sending |
| `SMTP_USER` | Email sending |
| `SMTP_PASS` | Email sending |

---

## Step 2 — Deploy Frontend

1. Go to vercel.com → New Project
2. Import same GitHub repo
3. Set Root Directory: `frontend`
4. Framework: Vite (auto-detected)
5. Build Command: `npm run build`
6. Output Directory: `dist`

### Required Environment Variables (Frontend)

| Variable | Value |
|---|---|
| `VITE_STORAGE_ENCRYPTION_KEY` | Random 32+ char string |

### Optional Environment Variables (Frontend)

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_API_KEY` | Google login |
| `VITE_FIREBASE_AUTH_DOMAIN` | Google login |
| `VITE_FIREBASE_PROJECT_ID` | Google login |

---

## Step 3 — Connect Frontend to Backend

After both are deployed:

1. Copy your backend Vercel URL (e.g. `https://trader-backend.vercel.app`)
2. Go to backend project → Settings → Environment Variables
3. Add: `FRONTEND_URL` = your frontend URL
4. Redeploy backend

---

## Step 4 — First Login

After deploy, super admin is auto-created from env vars.

Login at: `https://your-frontend.vercel.app`
- Email: value of `SUPER_ADMIN_EMAIL`
- Password: value of `SUPER_ADMIN_PASSWORD`

---

## Known Limitations on Vercel

| Feature | Status | Reason |
|---|---|---|
| File uploads to disk | ❌ | Vercel read-only filesystem |
| File uploads to Cloudinary | ✅ | Works fine |
| WebSockets (Socket.IO) | ❌ | Serverless has no persistent connections |
| Real-time notifications | ❌ | Needs WebSocket server |
| Redis cache | ⚠️ | Works if REDIS_URL set, degrades gracefully without |
| Offline sync (Realm) | ❌ | Desktop-only feature |
| Scheduled jobs (cron) | ❌ | Serverless functions are stateless |

---

## Troubleshooting

### CORS Error
- Check `FRONTEND_URL` is set correctly in backend env vars
- Make sure it matches exactly (no trailing slash)

### Super Admin Can't Login
- Check `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are set
- Redeploy backend after setting these vars
- Check MongoDB Atlas network access allows Vercel IPs (allow all: 0.0.0.0/0)

### Database Connection Failed
- Check `MONGO_URI` is correct
- Go to MongoDB Atlas → Network Access → Add `0.0.0.0/0`
- Make sure cluster is not paused

### 500 Errors on API
- Check Vercel function logs: Dashboard → Functions tab
- Usually missing env var or MongoDB connection issue

---

## Boneyard Skeleton Generation

Skeletons require pre-generated bone files. Run this locally:

### Steps
1. Start dev server: `npm run dev`
2. In new terminal: `npx boneyard-js build`
3. Commit generated files in `src/bones/`

### Notes
- Must run with dev server active
- Bones are pre-generated JSON files — no runtime cost
- After generating, commit `src/bones/*.bones.json` to git
- `src/bones/*.bones.json` is NOT in .gitignore — bones will be committed
