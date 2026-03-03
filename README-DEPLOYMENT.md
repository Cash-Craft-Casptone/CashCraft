# 🚀 CashCraft Deployment - Quick Start

## 📦 ONE Repository, THREE Services

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                             │
│                                                              │
│  cashcraft-nextjs/                                          │
│  ├── app/              (Frontend)                           │
│  ├── components/       (Frontend)                           │
│  ├── lib/              (Frontend)                           │
│  ├── backend/                                               │
│  │   └── CashCraft.Api/  (Backend)                         │
│  └── package.json                                           │
│                                                              │
│  git push origin main  ──────────────────────┐              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       GITHUB                                 │
│                                                              │
│  github.com/yourusername/cashcraft                          │
│  ├── app/                                                   │
│  ├── components/                                            │
│  ├── lib/                                                   │
│  ├── backend/                                               │
│  │   └── CashCraft.Api/                                    │
│  └── package.json                                           │
│                                                              │
│  (ONE repository with EVERYTHING)                           │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             │                          │
    ┌────────▼────────┐        ┌───────▼────────┐
    │                 │        │                 │
    │  VERCEL         │        │  RENDER         │
    │                 │        │                 │
    │  Deploys:       │        │  Deploys:       │
    │  Root folder    │        │  backend/       │
    │  (Frontend)     │        │  CashCraft.Api/ │
    │                 │        │  (Backend)      │
    │  Uses:          │        │                 │
    │  - app/         │        │  Uses:          │
    │  - components/  │        │  - Controllers/ │
    │  - lib/         │        │  - Domain/      │
    │  - package.json │        │  - Program.cs   │
    │                 │        │                 │
    │  Ignores:       │        │  Ignores:       │
    │  - backend/     │        │  - app/         │
    │                 │        │  - components/  │
    └────────┬────────┘        └────────┬────────┘
             │                          │
             │                          │
             │                          │
             │                          ▼
             │                 ┌─────────────────┐
             │                 │   SUPABASE      │
             │                 │   (Database)    │
             │                 │                 │
             │                 │   PostgreSQL    │
             │                 └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │     USERS       │
    │  (Your Website) │
    └─────────────────┘
```

---

## 🎯 Simple Answer

### Your Question:
> "Will I upload the code to GitHub front with back or front only to upload to Vercel?"

### Answer:
**Upload EVERYTHING (frontend + backend) to ONE GitHub repository.**

Both Vercel and Render connect to the SAME repository:
- Vercel deploys the root folder (frontend)
- Render deploys the `backend/CashCraft.Api` folder (backend)

---

## 📋 3-Step Deployment

### Step 1: Push to GitHub (5 minutes)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cashcraft.git
git push -u origin main
```

**Result:** All your code is on GitHub in ONE repository

### Step 2: Deploy Frontend to Vercel (5 minutes)
```
1. vercel.com → Import Project
2. Select your GitHub repository
3. Root Directory: ./ (default)
4. Add environment variables
5. Deploy
```

**Result:** Frontend is live at `https://your-app.vercel.app`

### Step 3: Deploy Backend to Render (7 minutes)
```
1. render.com → New Web Service
2. Select the SAME GitHub repository
3. Root Directory: backend/CashCraft.Api
4. Add environment variables
5. Deploy
```

**Result:** Backend is live at `https://your-backend.onrender.com`

---

## 🔑 Key Points

### ✅ DO:
- Upload everything to ONE GitHub repository
- Keep folder structure as-is
- Connect both Vercel and Render to the SAME repository
- Specify different "Root Directory" for each service

### ❌ DON'T:
- Create separate repositories for frontend and backend
- Move files around
- Upload secrets/passwords to GitHub

---

## 📁 Repository Structure

```
github.com/yourusername/cashcraft/
│
├── app/                    ← Vercel uses this
├── components/             ← Vercel uses this
├── lib/                    ← Vercel uses this
├── public/                 ← Vercel uses this
├── contexts/               ← Vercel uses this
├── package.json            ← Vercel uses this
├── next.config.js          ← Vercel uses this
│
└── backend/
    └── CashCraft.Api/     ← Render uses this
        ├── Controllers/
        ├── Domain/
        ├── Infrastructure/
        ├── Migrations/
        └── Program.cs
```

---

## 🎬 Complete Flow

```
1. Your Computer
   └─ All files (frontend + backend)
      └─ git push
         └─ GitHub (ONE repository)
            ├─ Vercel connects → Deploys frontend
            └─ Render connects → Deploys backend
               └─ Connects to Supabase (database)
```

---

## 📚 Read These Guides

1. **[GITHUB-SETUP.md](GITHUB-SETUP.md)** - How to push to GitHub
2. **[SIMPLE-DEPLOY-GUIDE.md](SIMPLE-DEPLOY-GUIDE.md)** - Complete deployment steps
3. **[DEPLOYMENT-FLOW.md](DEPLOYMENT-FLOW.md)** - Visual architecture
4. **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Quick commands

---

## ⏱️ Time & Cost

```
Time:  17 minutes total
Cost:  $0/month

Breakdown:
- GitHub:   Free
- Vercel:   Free (Hobby plan)
- Render:   Free (750 hours/month)
- Supabase: Free (500MB database)
```

---

## 🎉 That's It!

**Simple answer:** Upload everything to ONE GitHub repository. Both Vercel and Render will use it!

Start with: [GITHUB-SETUP.md](GITHUB-SETUP.md)
