# 🆓 100% FREE Deployment Guide

Deploy CashCraft completely FREE with these platforms:

> **Note:** This guide uses PostgreSQL (free). Your app currently uses SQL Server but supports both! See [DATABASE-MIGRATION.md](DATABASE-MIGRATION.md) for details. The app auto-detects which database to use.

## 🎯 Free Stack Overview

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| **Frontend** | Vercel | Unlimited (100GB bandwidth) |
| **Backend** | Render.com | Free tier (sleeps after 15min) |
| **Database** | Supabase | 500MB PostgreSQL free |
| **Domain** | Vercel | Free subdomain |

**Total Cost: $0/month** ✅

### Alternative: Railway (Low Cost)
Railway offers a **Free plan with $1/month credit** or **Hobby plan at $5/month** (includes $5 usage credit). For small apps, the Free plan can work, but Hobby is recommended for production.

---

## 📋 Step-by-Step Guide (20 minutes)

### Step 1: Deploy Database (Supabase) - 5 minutes

#### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub

#### 1.2 Create New Project
1. Click "New Project"
2. Enter project details:
   - Name: `cashcraft-db`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users
3. Click "Create new project"
4. Wait 2-3 minutes for setup

#### 1.3 Get Connection String
1. Go to Project Settings → Database
2. Copy the connection string (URI format)
3. Replace `[YOUR-PASSWORD]` with your database password
4. Save this - you'll need it for backend

---

### Step 2: Deploy Backend (Render.com) - 7 minutes

#### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub

#### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your CashCraft repo
4. Configure:
   - **Name**: `cashcraft-backend`
   - **Region**: Same as Supabase
   - **Branch**: `main`
   - **Root Directory**: `backend/CashCraft.Api`
   - **Runtime**: `.NET`
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `dotnet out/CashCraft.Api.dll`
   - **Plan**: Free

#### 2.3 Add Environment Variables
Click "Environment" and add:

```env
ConnectionStrings__DefaultConnection=<your-supabase-connection-string>

JwtSettings__SecretKey=<generate with: openssl rand -base64 32>
JwtSettings__Issuer=https://cashcraft-backend.onrender.com
JwtSettings__Audience=https://your-app.vercel.app
JwtSettings__ExpiryMinutes=60

GoogleApiKey=AIzaSyChwdhrDJL2FR7nUCmOgCxrSxMdU5uqb44

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:10000
```

#### 2.4 Deploy
1. Click "Create Web Service"
2. Wait 5-7 minutes for build
3. Copy your backend URL (e.g., `https://cashcraft-backend.onrender.com`)

**Note**: Free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

---

### Step 3: Deploy Frontend (Vercel) - 5 minutes

#### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"

#### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel auto-detects Next.js

#### 2.3 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

#### 3.4 Add Environment Variables
Click "Environment Variables" and add:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com
```

#### 3.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app is live! (e.g., `https://cashcraft.vercel.app`)

---

### Step 4: Update Backend CORS - 2 minutes

#### 3.1 Update CORS in Backend
In `backend/CashCraft.Api/Program.cs`, update CORS:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://cashcraft.vercel.app",  // Your Vercel URL
            "https://your-custom-domain.com" // If you add custom domain
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

#### 4.2 Commit and Push
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the changes.

---

### Step 5: Initialize App - 1 minute

#### 5.1 Create Admin User
Visit: `https://your-render-url.onrender.com/api/admin/create-admin`

#### 5.2 Test Login
1. Go to your Vercel URL
2. Click "Login"
3. Use credentials:
   - Email: `admin@123`
   - Password: `admin123`
4. **Change password immediately!**

---

## 🎉 You're Live!

Your app is now deployed at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Database**: Supabase PostgreSQL

---

## 🌐 Add Custom Domain (Optional - FREE)

### Option 1: Free Subdomain (Freenom)
1. Go to [freenom.com](https://freenom.com)
2. Search for available domain (e.g., `cashcraft.tk`)
3. Register for free (12 months)
4. Add to Vercel:
   - Vercel Dashboard → Domains → Add
   - Follow DNS instructions

### Option 2: Cloudflare Pages (Alternative)
- Free subdomain: `your-app.pages.dev`
- Free SSL
- Global CDN

### Option 3: Use Vercel Subdomain
- Already included: `your-app.vercel.app`
- Free SSL
- No setup needed

---

## 📊 Free Tier Limits

### Render.com (Backend)
- ✅ 750 hours/month free
- ✅ 512MB RAM
- ✅ Shared CPU
- ⚠️ Sleeps after 15 min inactivity (wakes in ~30 seconds)
- ⚠️ 100GB bandwidth/month

**Good for:**
- 500-1000 users/month
- 10,000-50,000 requests/month
- Development & testing
- Small production apps

### Supabase (Database)
- ✅ 500MB database storage
- ✅ 2GB file storage
- ✅ 50,000 monthly active users
- ✅ 500MB egress
- ✅ No sleep/downtime

**Good for:**
- Small to medium apps
- Up to 10,000 rows
- Development & production

### Vercel (Frontend)
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ No sleep/downtime
- ✅ Serverless functions

**Good for:**
- Unlimited users
- 100,000+ page views/month
- Production apps

---

## 🔄 Alternative FREE Options

### Option A: Railway (Low Cost - Not Free)
**Pricing:**
- Free plan: $1/month credit (very limited)
- Hobby plan: $5/month (includes $5 usage credit)

**Pros:**
- Backend + Database in one place
- Easy to use
- No sleep on Hobby plan

**Cons:**
- Not truly free (Hobby plan recommended)
- Free plan has only $1 credit

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Create Web Service (Backend)
3. Add PostgreSQL database
4. Deploy frontend to Vercel

### Option B: Fly.io (Backend)
**Pros:**
- 3 shared-cpu VMs free
- 3GB persistent volume storage
- 160GB outbound data transfer

**Cons:**
- Requires credit card
- More complex setup

### Option C: PlanetScale (Database)
**Pros:**
- 5GB storage free
- 1 billion row reads/month
- 10 million row writes/month

**Cons:**
- Need separate backend hosting

---

## 🚀 Upgrade Path (When You Grow)

### When to Upgrade?
- More than 1000 active users
- Need faster response times (no sleep)
- Want more storage
- Need better performance

### Upgrade Options:

**Render Standard** ($7/month)
- No sleep
- 512MB RAM
- Better performance

**Railway Hobby** ($5/month)
- No sleep
- More resources
- Includes $5 usage credit

**Supabase Pro** ($25/month)
- 8GB database
- 100GB file storage
- Better performance

**Vercel Pro** ($20/month)
- More bandwidth
- Team features
- Analytics

**Total: $12-52/month for production-ready**

---

## 🛠️ Maintenance

### Update Application
```bash
# 1. Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# 2. Auto-deploys to:
# - Render (backend)
# - Vercel (frontend)
```

### View Logs
**Render:**
1. Go to dashboard
2. Click your service
3. View "Logs" tab

**Vercel:**
1. Go to project
2. Click "Deployments"
3. View logs

### Database Backup
**Supabase:**
1. Go to Database → Backups
2. Download backup
3. Or use pg_dump:
```bash
pg_dump <connection-string> > backup.sql
```

---

## ⚡ Performance Tips

### 1. Enable Caching
Add to `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Enable SWC minification
  swcMinify: true,
}
```

### 2. Optimize Images
Use Next.js Image component:
```jsx
import Image from 'next/image'
<Image src="/logo.png" width={200} height={200} />
```

### 3. Add Loading States
Prevent blank screens during API calls

### 4. Use CDN
Vercel automatically uses global CDN

---

## 🔒 Security Checklist

- [x] HTTPS enabled (automatic)
- [x] Environment variables secured
- [ ] Change default admin password
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Regular backups
- [ ] Monitor logs

---

## 📱 Mobile Optimization

Your app is already mobile-responsive, but test on:
- iPhone Safari
- Android Chrome
- iPad
- Different screen sizes

---

## 🎯 Next Steps

1. ✅ Deploy to Railway + Vercel
2. ✅ Test all features
3. ✅ Change admin password
4. ✅ Add custom domain (optional)
5. ✅ Share with users
6. ✅ Monitor usage
7. ✅ Collect feedback
8. ✅ Iterate and improve

---

## 💡 Pro Tips

1. **Keep Render awake**: Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) or [Cron-job.org](https://cron-job.org) to ping your backend every 14 minutes (prevents sleep)

2. **Optimize cold starts**: Render wakes up in ~30 seconds. Show loading state to users.

3. **Monitor usage**: Check Render and Supabase dashboards to see if you're approaching limits

4. **Backup regularly**: Export database weekly from Supabase

5. **Use Git branches**: Test changes on preview deployments before production

---

## 🆘 Troubleshooting

### Backend not responding
```bash
# Check Render logs
# Go to Render Dashboard → Your Service → Logs

# Check health endpoint
curl https://your-backend.onrender.com/health
```

### Frontend errors
```bash
# Check Vercel logs
vercel logs

# Check browser console
F12 → Console tab
```

### Database connection failed
1. Check Supabase project is running
2. Verify connection string in Render environment variables
3. Check firewall rules in Supabase settings

### CORS errors
1. Update backend CORS settings
2. Verify frontend URL is allowed
3. Check browser console for exact error

### Backend sleeping too often
1. Set up UptimeRobot to ping every 14 minutes
2. Or upgrade to Render Standard ($7/month) for no sleep

---

## 📞 Support Resources

- **Render**: [render.com/docs](https://render.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: Render Discord, Supabase Discord, Vercel Discord

---

## 🎊 Congratulations!

You now have a fully functional, production-ready app deployed for FREE!

**Your app is:**
- ✅ Live on the internet
- ✅ Accessible worldwide
- ✅ Secured with HTTPS
- ✅ Automatically backed up
- ✅ Ready for users

Share your app and start getting users! 🚀

---

## 📈 Growth Strategy

1. **Week 1**: Test with friends/family
2. **Week 2**: Share on social media
3. **Week 3**: Collect feedback
4. **Week 4**: Iterate and improve
5. **Month 2**: Consider monetization
6. **Month 3**: Upgrade if needed

Good luck! 🍀
