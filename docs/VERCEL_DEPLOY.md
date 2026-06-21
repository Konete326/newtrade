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
