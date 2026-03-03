# ⚡ Quick Reference Card

## 🎯 Deployment in 3 Steps

### 1️⃣ Database (Supabase) - 5 min
```
1. supabase.com → New Project
2. Copy connection string
3. Done!
```

### 2️⃣ Backend (Render) - 7 min
```
1. render.com → New Web Service
2. Root: backend/CashCraft.Api
3. Add connection string
4. Deploy
```

### 3️⃣ Frontend (Vercel) - 5 min
```
1. vercel.com → Import Project
2. Add backend URL
3. Deploy
```

**Total: 17 minutes | Cost: $0/month**

---

## 📋 Environment Variables Cheat Sheet

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com
```

### Render (Backend)
```env
ConnectionStrings__Default=Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require

JwtSettings__SecretKey=your-super-secret-key-make-it-long-and-random
JwtSettings__Issuer=https://cashcraft-backend.onrender.com
JwtSettings__Audience=https://your-app.vercel.app
JwtSettings__ExpiryMinutes=60

GoogleApiKey=AIzaSyChwdhrDJL2FR7nUCmOgCxrSxMdU5uqb44

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:10000
```

---

## 🔧 Render Build Settings

```
Name: cashcraft-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend/CashCraft.Api
Runtime: .NET

Build Command:
dotnet publish -c Release -o out

Start Command:
dotnet out/CashCraft.Api.dll

Plan: Free
```

---

## 🔧 Vercel Build Settings

```
Framework: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install

Plan: Hobby (Free)
```

---

## 📁 What Goes Where

```
Frontend (Vercel):
├── app/
├── components/
├── lib/
├── public/
└── package.json

Backend (Render):
└── backend/CashCraft.Api/
    ├── Controllers/
    ├── Domain/
    ├── Infrastructure/
    └── Program.cs

Database (Supabase):
Empty database → Backend creates tables automatically
```

---

## 🔗 Important URLs

### After Deployment
```
Frontend:     https://your-app.vercel.app
Backend:      https://cashcraft-backend.onrender.com
Health Check: https://cashcraft-backend.onrender.com/health
Create Admin: https://cashcraft-backend.onrender.com/api/admin/create-admin
```

### Dashboards
```
Supabase:  https://supabase.com/dashboard
Render:    https://dashboard.render.com
Vercel:    https://vercel.com/dashboard
```

---

## 🔑 Default Credentials

```
Email:    admin@123
Password: admin123

⚠️ Change these immediately after first login!
```

---

## 🐛 Quick Troubleshooting

### Backend not responding
```bash
# Check health endpoint
curl https://your-backend.onrender.com/health

# Check Render logs
Dashboard → Your Service → Logs
```

### Frontend can't connect
```
1. Check NEXT_PUBLIC_API_URL in Vercel
2. Verify CORS in backend (Program.cs)
3. Make sure backend URL ends with /api
```

### Database connection failed
```
1. Check connection string in Render
2. Verify password is correct
3. Ensure "SSL Mode=Require" is present
4. Check Supabase project is running
```

### Login not working
```
1. Create admin: /api/admin/create-admin
2. Check backend logs for errors
3. Verify JWT settings are correct
```

---

## 🔄 Making Updates

### Update Code
```bash
git add .
git commit -m "Your message"
git push origin main
```

**Auto-deploys:**
- Vercel: 2-3 minutes
- Render: 5-7 minutes

---

## 💡 Pro Tips

### Keep Backend Awake (Free)
```
1. Go to uptimerobot.com
2. Add monitor
3. URL: https://your-backend.onrender.com/health
4. Interval: 14 minutes
5. Done! Backend never sleeps
```

### Custom Domain (Free)
```
1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Follow DNS instructions
```

### Monitor Usage
```
Render:   Dashboard → Usage
Supabase: Dashboard → Database → Usage
Vercel:   Dashboard → Analytics
```

---

## 📊 Free Tier Limits

```
Vercel:
✅ 100GB bandwidth/month
✅ Unlimited deployments
✅ No sleep

Render:
✅ 750 hours/month
⚠️ Sleeps after 15min inactivity
✅ 512MB RAM

Supabase:
✅ 500MB database
✅ 50K monthly active users
✅ No sleep
```

---

## 🆘 Need Help?

### Documentation
- [SIMPLE-DEPLOY-GUIDE.md](SIMPLE-DEPLOY-GUIDE.md) - Step-by-step guide
- [DEPLOYMENT-FLOW.md](DEPLOYMENT-FLOW.md) - Visual architecture
- [DATABASE-MIGRATION.md](DATABASE-MIGRATION.md) - Database guide

### Support
- Render: [render.com/docs](https://render.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)

---

## ✅ Deployment Checklist

```
□ Created Supabase database
□ Copied connection string
□ Deployed backend to Render
□ Added all environment variables
□ Backend health check works (returns "OK")
□ Deployed frontend to Vercel
□ Updated CORS in backend code
□ Pushed CORS changes to GitHub
□ Updated JwtSettings__Audience in Render
□ Created admin user (/api/admin/create-admin)
□ Tested login (admin@123 / admin123)
□ Changed admin password
□ Set up UptimeRobot (optional)
□ Added custom domain (optional)
```

---

## 🎉 You're Done!

Your app is live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Supabase PostgreSQL

**Cost: $0/month**
**Setup time: 17 minutes**

Happy deploying! 🚀
