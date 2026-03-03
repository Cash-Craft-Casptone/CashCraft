# 🚀 Simple Deployment Guide

## Your Setup:
- **Frontend folder** → Vercel
- **Backend folder** → Render
- **Database** → Supabase (PostgreSQL)

---

## 📦 Step 1: Create Database on Supabase (5 minutes)

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub

### 1.2 Create Database
1. Click "New Project"
2. Fill in:
   - **Name**: `cashcraft-db`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes

### 1.3 Get Connection String
1. Go to **Project Settings** (gear icon) → **Database**
2. Scroll down to **Connection string**
3. Select **URI** tab
4. Copy the connection string (looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual password
6. **SAVE THIS** - you'll need it for Render!

### ✅ Database Created!
Your database is ready. It's empty now - the backend will create tables automatically when it first runs.

---

## 📦 Step 2: Deploy Backend to Render (7 minutes)

### 2.1 Sign Up
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub

### 2.2 Connect Your Repository
1. Click "New +" → "Web Service"
2. Click "Connect account" to connect GitHub
3. Find and select your CashCraft repository
4. Click "Connect"

### 2.3 Configure Backend
Fill in these settings:

**Basic Settings:**
- **Name**: `cashcraft-backend` (or any name you want)
- **Region**: Same as Supabase (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `backend/CashCraft.Api`
- **Runtime**: `.NET`

**Build Settings:**
- **Build Command**: 
  ```
  dotnet publish -c Release -o out
  ```
- **Start Command**: 
  ```
  dotnet out/CashCraft.Api.dll
  ```

**Plan:**
- Select **Free**

### 2.4 Add Environment Variables
Scroll down to **Environment Variables** and click "Add Environment Variable"

Add these one by one:

1. **ConnectionStrings__Default**
   ```
   Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require
   ```
   *(Use your Supabase connection string from Step 1.3)*

2. **JwtSettings__SecretKey**
   ```
   your-super-secret-jwt-key-change-this-to-something-random
   ```
   *(Make this random and long)*

3. **JwtSettings__Issuer**
   ```
   https://cashcraft-backend.onrender.com
   ```
   *(Replace with your actual Render URL after deployment)*

4. **JwtSettings__Audience**
   ```
   https://your-app.vercel.app
   ```
   *(You'll update this after deploying frontend)*

5. **JwtSettings__ExpiryMinutes**
   ```
   60
   ```

6. **GoogleApiKey**
   ```
   AIzaSyChwdhrDJL2FR7nUCmOgCxrSxMdU5uqb44
   ```

7. **ASPNETCORE_ENVIRONMENT**
   ```
   Production
   ```

8. **ASPNETCORE_URLS**
   ```
   http://0.0.0.0:10000
   ```

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait 5-7 minutes for deployment
3. Once done, copy your backend URL (e.g., `https://cashcraft-backend.onrender.com`)
4. **SAVE THIS URL** - you'll need it for frontend!

### 2.6 Test Backend
Visit: `https://your-backend-url.onrender.com/health`

You should see: `OK`

### ✅ Backend Deployed!
Your backend is live and connected to the database!

---

## 📦 Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Sign Up
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Find your CashCraft repository
3. Click "Import"

### 3.3 Configure Frontend
Vercel auto-detects Next.js, but verify:

**Framework Preset**: Next.js
**Root Directory**: `./` (leave as default)
**Build Command**: `npm run build` (auto-filled)
**Output Directory**: `.next` (auto-filled)

### 3.4 Add Environment Variables
Click "Environment Variables" and add:

1. **NEXT_PUBLIC_API_URL**
   ```
   https://your-render-backend-url.onrender.com/api
   ```
   *(Use your Render URL from Step 2.5, add `/api` at the end)*

2. **NEXT_PUBLIC_GOOGLE_CLIENT_ID**
   ```
   299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com
   ```

### 3.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Once done, you'll get your app URL (e.g., `https://cashcraft.vercel.app`)
4. **SAVE THIS URL!**

### ✅ Frontend Deployed!
Your frontend is live!

---

## 📦 Step 4: Update Backend CORS (2 minutes)

Now that you have your Vercel URL, update the backend to allow requests from it.

### 4.1 Update Code
In your local project, open `backend/CashCraft.Api/Program.cs`

Find this section (around line 40):
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://localhost:3000")
```

Change it to:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://localhost:3000",
                "https://your-app.vercel.app")  // Add your Vercel URL
```

### 4.2 Push Changes
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy (takes 2-3 minutes).

---

## 📦 Step 5: Update Backend Environment Variables (1 minute)

### 5.1 Update JwtSettings__Audience
1. Go to Render dashboard
2. Click your backend service
3. Go to "Environment" tab
4. Find **JwtSettings__Audience**
5. Update it to your Vercel URL: `https://your-app.vercel.app`
6. Click "Save Changes"

Render will redeploy automatically.

---

## 📦 Step 6: Initialize Your App (2 minutes)

### 6.1 Create Admin User
Visit this URL in your browser:
```
https://your-render-backend-url.onrender.com/api/admin/create-admin
```

You should see: `Admin user created successfully`

### 6.2 Test Login
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Click "Login"
3. Enter:
   - **Email**: `admin@123`
   - **Password**: `admin123`
4. Click "Login"

### ✅ You're In!
If you can log in, everything is working!

---

## 🎉 You're Live!

Your app is now deployed:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: Supabase PostgreSQL

**Total Cost: $0/month** ✅

---

## 📝 Important Notes

### Database Tables
The database tables are created automatically when the backend first runs. You don't need to "upload" the database - it's created from your code!

### Free Tier Limitations
- **Render**: Backend sleeps after 15 minutes of inactivity
  - First request after sleep takes ~30 seconds to wake up
  - Solution: Use [UptimeRobot](https://uptimerobot.com) to ping every 14 minutes (free)

- **Supabase**: 500MB database storage
  - Good for 10,000+ users
  - Upgrade to Pro ($25/month) if you need more

### Monitoring
- **Render Logs**: Dashboard → Your Service → Logs
- **Vercel Logs**: Dashboard → Your Project → Deployments
- **Supabase**: Dashboard → Database → Tables

---

## 🆘 Troubleshooting

### Backend not responding
1. Check Render logs for errors
2. Verify environment variables are correct
3. Make sure database connection string is correct

### Frontend can't connect to backend
1. Check CORS settings in backend
2. Verify `NEXT_PUBLIC_API_URL` in Vercel
3. Make sure backend URL ends with `/api`

### Login not working
1. Make sure you created admin user (Step 6.1)
2. Check backend logs for errors
3. Verify JWT settings are correct

### Database connection failed
1. Check Supabase project is running
2. Verify connection string in Render
3. Make sure password is correct
4. Check `SSL Mode=Require` is in connection string

---

## 💡 Pro Tips

1. **Keep backend awake**: Set up UptimeRobot to ping your backend every 14 minutes

2. **Custom domain**: Add your own domain in Vercel (Settings → Domains)

3. **Monitor usage**: Check Render and Supabase dashboards weekly

4. **Backup database**: Export from Supabase monthly

5. **Update regularly**: Push changes to GitHub, they auto-deploy!

---

## 🔄 Making Updates

### Update Frontend
```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```
Vercel auto-deploys in 2-3 minutes!

### Update Backend
```bash
# Make changes to backend code
git add .
git commit -m "Update API"
git push origin main
```
Render auto-deploys in 5-7 minutes!

---

## 📞 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

## ✅ Checklist

- [ ] Created Supabase database
- [ ] Got database connection string
- [ ] Deployed backend to Render
- [ ] Added all environment variables
- [ ] Backend health check works
- [ ] Deployed frontend to Vercel
- [ ] Updated CORS in backend
- [ ] Updated JwtSettings__Audience
- [ ] Created admin user
- [ ] Tested login
- [ ] App is working!

🎊 Congratulations! Your app is live!
