# 📦 GitHub Setup Guide

## ✅ Upload EVERYTHING to ONE Repository

You upload your ENTIRE project (frontend + backend) to GitHub in ONE repository. Both Vercel and Render will connect to the SAME repository but deploy different parts.

---

## 📁 Your Project Structure on GitHub

```
your-github-repo/
├── app/                    ← Vercel uses this
├── components/             ← Vercel uses this
├── lib/                    ← Vercel uses this
├── public/                 ← Vercel uses this
├── contexts/               ← Vercel uses this
├── backend/
│   └── CashCraft.Api/     ← Render uses this
├── package.json            ← Vercel uses this
├── next.config.js          ← Vercel uses this
├── .gitignore
└── README.md
```

**Important:** 
- ✅ Upload EVERYTHING (frontend + backend)
- ✅ Keep the folder structure as-is
- ✅ Both services connect to the SAME repository

---

## 🚀 Step-by-Step: Upload to GitHub

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Fill in:
   - **Repository name**: `cashcraft` (or any name)
   - **Description**: "CashCraft - Budget Planning App"
   - **Visibility**: Public or Private (both work)
   - **DON'T** check "Add README" (you already have files)
4. Click "Create repository"

### Step 2: Push Your Code

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - CashCraft app"

# Add GitHub as remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR-USERNAME/cashcraft.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME` with your GitHub username!**

### ✅ Done! Your code is on GitHub

Visit your repository: `https://github.com/YOUR-USERNAME/cashcraft`

You should see ALL your files (frontend + backend).

---

## 🔗 How Vercel and Render Use the SAME Repository

### Vercel (Frontend)
```
1. Connect to: github.com/YOUR-USERNAME/cashcraft
2. Root Directory: ./ (default - uses root folder)
3. Vercel deploys:
   ├── app/
   ├── components/
   ├── lib/
   ├── public/
   └── package.json
4. Vercel IGNORES: backend/ folder
```

### Render (Backend)
```
1. Connect to: github.com/YOUR-USERNAME/cashcraft
2. Root Directory: backend/CashCraft.Api (you specify this!)
3. Render deploys:
   └── backend/CashCraft.Api/
       ├── Controllers/
       ├── Domain/
       ├── Program.cs
       └── *.csproj
4. Render IGNORES: everything else
```

### Visual Explanation

```
GitHub Repository (ONE repo with everything)
│
├─── Vercel connects here
│    └─── Deploys: Root folder (frontend)
│         Ignores: backend/
│
└─── Render connects here
     └─── Deploys: backend/CashCraft.Api/
          Ignores: everything else
```

---

## 🎯 Deployment Flow

```
1. You push code to GitHub
   └─ git push origin main

2. GitHub receives your code
   └─ Stores everything in one repository

3. Vercel detects changes
   └─ Automatically deploys frontend
   └─ Takes 2-3 minutes

4. Render detects changes
   └─ Automatically deploys backend
   └─ Takes 5-7 minutes

5. Both are live!
   └─ Frontend: https://your-app.vercel.app
   └─ Backend: https://your-backend.onrender.com
```

---

## 📝 Important Files to Check

### .gitignore (Already in your project)

Make sure these are in `.gitignore`:

```
# Frontend
node_modules/
.next/
.env.local
.env.production

# Backend
backend/CashCraft.Api/bin/
backend/CashCraft.Api/obj/
backend/CashCraft.Api/appsettings.Development.json

# OS
.DS_Store
Thumbs.db
```

This prevents uploading unnecessary files to GitHub.

---

## 🔐 Security: Don't Upload Secrets!

### ❌ DON'T Upload These:
- Database passwords
- API keys (except the ones already in code)
- JWT secret keys
- Connection strings

### ✅ DO Upload These:
- All code files
- Configuration templates
- README files
- .gitignore

### How to Handle Secrets:

**In your code:**
```csharp
// ✅ Good - reads from environment variable
var secret = builder.Configuration["JwtSettings:SecretKey"];
```

**NOT in your code:**
```csharp
// ❌ Bad - hardcoded secret
var secret = "my-super-secret-key-12345";
```

**Set secrets in:**
- Vercel: Dashboard → Environment Variables
- Render: Dashboard → Environment Variables

---

## 🔄 Making Updates After Deployment

### Update Frontend
```bash
# Make changes to frontend files
# (app/, components/, etc.)

git add .
git commit -m "Update frontend feature"
git push origin main

# Vercel auto-deploys in 2-3 minutes
```

### Update Backend
```bash
# Make changes to backend files
# (backend/CashCraft.Api/)

git add .
git commit -m "Update backend API"
git push origin main

# Render auto-deploys in 5-7 minutes
```

### Update Both
```bash
# Make changes to both frontend and backend

git add .
git commit -m "Update frontend and backend"
git push origin main

# Both Vercel and Render auto-deploy
```

---

## 🎯 Complete Example

### Your Current Folder
```
D:\Capstone Project\cashcraft-nextjs\
├── app/
├── components/
├── backend/
│   └── CashCraft.Api/
└── package.json
```

### Step 1: Create GitHub Repo
```
Repository name: cashcraft
URL: https://github.com/yourusername/cashcraft
```

### Step 2: Push Code
```bash
cd "D:\Capstone Project\cashcraft-nextjs"

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cashcraft.git
git push -u origin main
```

### Step 3: Connect Vercel
```
1. vercel.com → Import Project
2. Select: yourusername/cashcraft
3. Root Directory: ./ (default)
4. Deploy
```

### Step 4: Connect Render
```
1. render.com → New Web Service
2. Select: yourusername/cashcraft
3. Root Directory: backend/CashCraft.Api
4. Deploy
```

### ✅ Result
```
GitHub:  https://github.com/yourusername/cashcraft
         (Contains everything)

Vercel:  https://cashcraft.vercel.app
         (Deploys frontend from root)

Render:  https://cashcraft-backend.onrender.com
         (Deploys backend from backend/CashCraft.Api)
```

---

## 🐛 Troubleshooting

### "Git not found"
```bash
# Install Git
# Windows: https://git-scm.com/download/win
# Or use: winget install Git.Git
```

### "Permission denied"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/yourusername/cashcraft.git
```

### "Repository not found"
```bash
# Check repository URL
git remote -v

# Update if wrong
git remote set-url origin https://github.com/yourusername/cashcraft.git
```

### "Files too large"
```bash
# Check .gitignore includes:
node_modules/
.next/
bin/
obj/

# Remove if already tracked
git rm -r --cached node_modules
git rm -r --cached .next
git commit -m "Remove large files"
```

---

## 💡 Pro Tips

### 1. Use Branches for Testing
```bash
# Create test branch
git checkout -b test-feature

# Make changes and push
git push origin test-feature

# Vercel creates preview deployment automatically!
# Test at: https://cashcraft-git-test-feature.vercel.app
```

### 2. Protect Main Branch
```
GitHub → Settings → Branches → Add rule
- Branch name: main
- Require pull request reviews
```

### 3. Add README
Create `README.md` in root:
```markdown
# CashCraft

Budget planning app with AI assistance.

## Tech Stack
- Frontend: Next.js + React
- Backend: .NET 9
- Database: PostgreSQL

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: Supabase
```

---

## ✅ Checklist

```
□ Created GitHub repository
□ Checked .gitignore is correct
□ Initialized git in project folder
□ Added all files (git add .)
□ Committed files (git commit)
□ Added remote (git remote add origin)
□ Pushed to GitHub (git push)
□ Verified files on GitHub
□ Connected Vercel to repository
□ Connected Render to repository
□ Both services deployed successfully
```

---

## 🎉 Summary

**Answer to your question:**

✅ Upload EVERYTHING (frontend + backend) to ONE GitHub repository

❌ DON'T create separate repositories for frontend and backend

**Why?**
- Easier to manage
- Single source of truth
- Both services can deploy from same repo
- Vercel and Render just use different folders

**How it works:**
1. Push everything to GitHub
2. Vercel deploys root folder (frontend)
3. Render deploys backend/CashCraft.Api folder (backend)
4. Both use the SAME repository!

Simple! 🚀
