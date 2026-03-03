# Quick Deployment Steps

## 🚀 Fastest Way to Deploy (Railway + Vercel)

### Step 1: Deploy Backend (5 minutes)

1. **Go to [railway.app](https://railway.app)**
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will create a PostgreSQL database automatically
6. Add these environment variables in Railway dashboard:
   ```
   JwtSettings__SecretKey=<run: openssl rand -base64 32>
   JwtSettings__Issuer=https://cashcraft-production.up.railway.app
   JwtSettings__Audience=https://yourcashcraft.vercel.app
   GoogleApiKey=AIzaSyChwdhrDJL2FR7nUCmOgCxrSxMdU5uqb44
   ```
7. Copy your Railway API URL (e.g., `https://cashcraft-production.up.railway.app`)

### Step 2: Deploy Frontend (3 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com
   ```
6. Click "Deploy"
7. Wait 2-3 minutes
8. Your site is live! (e.g., `https://cashcraft.vercel.app`)

### Step 3: Add Custom Domain (Optional)

**In Vercel:**
1. Go to Project Settings → Domains
2. Add your domain (e.g., `cashcraft.com`)
3. Follow DNS instructions

**Update your domain DNS:**
- Add CNAME record: `www` → `cname.vercel-dns.com`
- Add A record: `@` → `76.76.21.21`

### Step 4: Initialize Database

1. In Railway, open your backend service
2. Click "Deploy Logs"
3. Database migrations should run automatically
4. If not, run: `dotnet ef database update`

### Step 5: Create Admin Account

Visit: `https://your-railway-url.up.railway.app/api/admin/create-admin`

Login with:
- Email: `admin@123`
- Password: `admin123`

**⚠️ IMPORTANT: Change this password immediately after first login!**

---

## 🔧 Update Backend CORS

After deployment, update `backend/CashCraft.Api/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://cashcraft.vercel.app",  // Your Vercel URL
            "https://www.yourdomain.com",     // Your custom domain
            "https://yourdomain.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

Commit and push - Railway will auto-deploy.

---

## ✅ Verification Checklist

- [ ] Backend is accessible (visit `/health` endpoint)
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Can create budget plan
- [ ] Can add categories
- [ ] Can add expenses
- [ ] Google OAuth works
- [ ] AI chat works
- [ ] Admin panel accessible
- [ ] Arabic language works
- [ ] Dark mode works

---

## 🆘 Common Issues

**Issue: "Failed to fetch" errors**
- Solution: Check CORS settings in backend
- Verify API URL in frontend env variables

**Issue: "401 Unauthorized"**
- Solution: Check JWT secret is same in backend
- Verify token is being sent in requests

**Issue: Database connection failed**
- Solution: Check connection string in Railway
- Verify database is running

**Issue: Google OAuth not working**
- Solution: Add production URLs to Google Console
- Update redirect URIs

---

## 📊 Free Tier Limits

**Railway:**
- $5 credit/month (free)
- ~500 hours/month
- 1GB RAM
- 1GB storage

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Global CDN

**This is enough for:**
- ~1000 users/month
- ~10,000 page views/month
- Development and testing

---

## 💰 When to Upgrade

Upgrade when you reach:
- 500+ active users
- 50,000+ page views/month
- Need more database storage
- Need better performance

---

## 🎉 You're Done!

Your app is now live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`

Share it with the world! 🌍
