# 🎯 Deployment Flow - Visual Guide

## Your Project Structure

```
cashcraft-nextjs/
├── app/                    → Frontend (Next.js)
├── components/             → Frontend
├── lib/                    → Frontend
├── public/                 → Frontend
├── backend/
│   └── CashCraft.Api/     → Backend (.NET)
└── package.json           → Frontend
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                    (Your Website Visitors)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Next.js App (React)                               │     │
│  │  - UI Components                                   │     │
│  │  - Pages (Dashboard, Articles, etc.)               │     │
│  │  - Static Assets                                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Deploys from: Root folder (/)                              │
│  URL: https://your-app.vercel.app                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │ (NEXT_PUBLIC_API_URL)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDER (Backend)                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  .NET API                                          │     │
│  │  - Controllers (Auth, Budget, Articles, etc.)     │     │
│  │  - Business Logic                                 │     │
│  │  - JWT Authentication                             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Deploys from: backend/CashCraft.Api/                       │
│  URL: https://cashcraft-backend.onrender.com                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Database Queries
                         │ (ConnectionStrings__Default)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE (Database)                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  PostgreSQL Database                               │     │
│  │  - Users Table                                     │     │
│  │  - BudgetPlans Table                              │     │
│  │  - Categories Table                               │     │
│  │  - Articles, Videos, Quizzes Tables               │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Created on: supabase.com                                   │
│  Connection: PostgreSQL connection string                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Visits Website
```
User Browser → Vercel (Frontend) → Loads React App
```

### 2. User Logs In
```
User enters credentials
    ↓
Frontend sends to: https://backend.onrender.com/api/auth/login
    ↓
Backend checks database (Supabase)
    ↓
Backend returns JWT token
    ↓
Frontend stores token
```

### 3. User Creates Budget
```
User fills budget form
    ↓
Frontend sends to: https://backend.onrender.com/api/budgets
    ↓
Backend validates & saves to database (Supabase)
    ↓
Backend returns success
    ↓
Frontend updates UI
```

---

## Database Creation Flow

### ❌ You DON'T Upload Database Files
You don't need to export/import SQL files!

### ✅ Database is Created Automatically

```
1. You create empty database on Supabase
   └─ Just click "New Project"
   └─ Database is empty (no tables)

2. You deploy backend to Render
   └─ Backend has Entity Framework migrations
   └─ Migrations are in: backend/CashCraft.Api/Migrations/

3. Backend runs for first time
   └─ Entity Framework detects empty database
   └─ Automatically creates all tables:
       - Users
       - BudgetPlans
       - BudgetCategories
       - Articles
       - Videos
       - Quizzes
       - etc.

4. Backend runs startup code
   └─ Creates admin user
   └─ Adds sample content
   └─ Database is ready!
```

### How It Works

Your backend has this code in `Program.cs`:
```csharp
// This runs automatically when backend starts
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Create tables if they don't exist
    context.Database.EnsureCreated();
    
    // Create admin user
    await AddAdminUser.CreateAdminAccount(context);
    
    // Add sample content
    await AddSampleContent.AddSampleEducationalContent(context);
}
```

So you just:
1. Create empty database on Supabase
2. Give connection string to Render
3. Backend creates everything automatically!

---

## Folder Deployment

### Frontend → Vercel

**What Vercel Deploys:**
```
cashcraft-nextjs/
├── app/              ✅ Deployed
├── components/       ✅ Deployed
├── lib/              ✅ Deployed
├── public/           ✅ Deployed
├── contexts/         ✅ Deployed
├── package.json      ✅ Deployed
├── next.config.js    ✅ Deployed
└── backend/          ❌ NOT deployed (ignored)
```

**Settings:**
- Root Directory: `./` (default)
- Build Command: `npm run build`
- Output Directory: `.next`

### Backend → Render

**What Render Deploys:**
```
cashcraft-nextjs/
└── backend/
    └── CashCraft.Api/    ✅ Deployed
        ├── Controllers/   ✅ Deployed
        ├── Domain/        ✅ Deployed
        ├── Infrastructure/✅ Deployed
        ├── Migrations/    ✅ Deployed
        ├── Program.cs     ✅ Deployed
        └── *.csproj       ✅ Deployed
```

**Settings:**
- Root Directory: `backend/CashCraft.Api`
- Build Command: `dotnet publish -c Release -o out`
- Start Command: `dotnet out/CashCraft.Api.dll`

---

## Environment Variables Flow

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL → Points to Render backend
    ↓
Used in: lib/api.ts
    ↓
Example: https://cashcraft-backend.onrender.com/api
```

### Backend (Render)
```
ConnectionStrings__Default → Points to Supabase
    ↓
Used in: Program.cs
    ↓
Example: Host=db.xxxxx.supabase.co;Port=5432;...

JwtSettings__* → JWT configuration
    ↓
Used in: Program.cs & Controllers
    ↓
For authentication tokens
```

---

## Complete Deployment Steps

### Step 1: Database (Supabase)
```
1. Go to supabase.com
2. Create new project
3. Copy connection string
4. Done! (Database is empty, backend will fill it)
```

### Step 2: Backend (Render)
```
1. Go to render.com
2. New Web Service
3. Connect GitHub repo
4. Root Directory: backend/CashCraft.Api
5. Add environment variables:
   - ConnectionStrings__Default (from Supabase)
   - JwtSettings__*
   - GoogleApiKey
6. Deploy
7. Copy backend URL
```

### Step 3: Frontend (Vercel)
```
1. Go to vercel.com
2. Import project
3. Connect GitHub repo
4. Root Directory: ./ (default)
5. Add environment variables:
   - NEXT_PUBLIC_API_URL (from Render)
   - NEXT_PUBLIC_GOOGLE_CLIENT_ID
6. Deploy
7. Copy frontend URL
```

### Step 4: Update CORS
```
1. Update backend code (Program.cs)
2. Add Vercel URL to CORS
3. Push to GitHub
4. Render auto-redeploys
```

### Step 5: Initialize
```
1. Visit: backend-url/api/admin/create-admin
2. Go to frontend URL
3. Login with admin@123 / admin123
4. Done!
```

---

## Cost Breakdown

```
┌─────────────┬──────────┬─────────────────────────┐
│ Service     │ Cost     │ What You Get            │
├─────────────┼──────────┼─────────────────────────┤
│ Vercel      │ $0       │ Unlimited deployments   │
│             │          │ 100GB bandwidth         │
│             │          │ Global CDN              │
├─────────────┼──────────┼─────────────────────────┤
│ Render      │ $0       │ 750 hours/month         │
│             │          │ 512MB RAM               │
│             │          │ Sleeps after 15min      │
├─────────────┼──────────┼─────────────────────────┤
│ Supabase    │ $0       │ 500MB database          │
│             │          │ 50K monthly users       │
│             │          │ No sleep                │
├─────────────┼──────────┼─────────────────────────┤
│ TOTAL       │ $0/month │ Good for 500-1000 users │
└─────────────┴──────────┴─────────────────────────┘
```

---

## Quick Reference

### URLs You'll Need

```
Supabase Dashboard:  https://supabase.com/dashboard
Render Dashboard:    https://dashboard.render.com
Vercel Dashboard:    https://vercel.com/dashboard

Your Frontend:       https://your-app.vercel.app
Your Backend:        https://cashcraft-backend.onrender.com
Backend Health:      https://cashcraft-backend.onrender.com/health
Create Admin:        https://cashcraft-backend.onrender.com/api/admin/create-admin
```

### Connection Strings

```
Supabase PostgreSQL:
Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require

Local SQL Server:
Server=(localdb)\\MSSQLLocalDB;Database=CashCraft;Trusted_Connection=True;MultipleActiveResultSets=true
```

---

## 🎉 That's It!

You now understand:
- ✅ Where each part is deployed
- ✅ How they connect to each other
- ✅ How the database is created (automatically!)
- ✅ What folders go where
- ✅ How data flows through your app

Follow [SIMPLE-DEPLOY-GUIDE.md](SIMPLE-DEPLOY-GUIDE.md) for step-by-step instructions!
