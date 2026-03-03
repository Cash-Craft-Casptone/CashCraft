# CashCraft Deployment Guide

## Overview
This guide will help you deploy CashCraft to production with:
- Frontend: Next.js on Vercel
- Backend: .NET API on Azure/Railway/Render
- Database: PostgreSQL/SQL Server

## Prerequisites
- Domain name (e.g., cashcraft.com)
- GitHub account
- Vercel account (free)
- Backend hosting account (Azure/Railway/Render)
- Database hosting (Azure SQL/Supabase/Railway)

---

## Part 1: Backend Deployment (.NET API)

### Step 1: Prepare Backend for Production

1. **Update appsettings.json for production**
   - Already configured with environment variables
   - JWT settings will use production secrets

2. **Database Setup Options:**

   **Option A: Azure SQL Database (Recommended)**
   - Create Azure SQL Database
   - Get connection string
   - Update environment variable

   **Option B: Railway PostgreSQL (Free tier available)**
   - Create Railway account
   - Create new project
   - Add PostgreSQL database
   - Get connection string

   **Option C: Supabase PostgreSQL (Free tier)**
   - Create Supabase project
   - Get connection string from settings

### Step 2: Deploy Backend

**Option A: Azure App Service**
```bash
# 1. Install Azure CLI
# 2. Login
az login

# 3. Create resource group
az group create --name cashcraft-rg --location eastus

# 4. Create app service plan
az appservice plan create --name cashcraft-plan --resource-group cashcraft-rg --sku B1 --is-linux

# 5. Create web app
az webapp create --resource-group cashcraft-rg --plan cashcraft-plan --name cashcraft-api --runtime "DOTNETCORE:9.0"

# 6. Configure environment variables
az webapp config appsettings set --resource-group cashcraft-rg --name cashcraft-api --settings \
  ConnectionStrings__DefaultConnection="YOUR_CONNECTION_STRING" \
  JwtSettings__SecretKey="YOUR_SECURE_SECRET_KEY_MIN_32_CHARS" \
  JwtSettings__Issuer="https://api.cashcraft.com" \
  JwtSettings__Audience="https://cashcraft.com" \
  GoogleApiKey="YOUR_GOOGLE_API_KEY"

# 7. Deploy
cd backend/CashCraft.Api
dotnet publish -c Release
az webapp deployment source config-zip --resource-group cashcraft-rg --name cashcraft-api --src publish.zip
```

**Option B: Railway (Easier, Free Tier)**
1. Go to railway.app
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub:
   - Connect your GitHub repo
   - Select backend folder
   - Railway will auto-detect .NET
5. Add environment variables in Railway dashboard:
   ```
   ConnectionStrings__DefaultConnection=<from Railway PostgreSQL>
   JwtSettings__SecretKey=<generate secure 32+ char key>
   JwtSettings__Issuer=https://api.yourdomain.com
   JwtSettings__Audience=https://yourdomain.com
   GoogleApiKey=<your key>
   ```
6. Get your API URL (e.g., https://cashcraft-api.railway.app)

**Option C: Render**
1. Go to render.com
2. Create new Web Service
3. Connect GitHub repo
4. Configure:
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/CashCraft.Api.dll`
5. Add environment variables
6. Deploy

### Step 3: Run Database Migrations

After backend is deployed:
```bash
# Update connection string in appsettings.json temporarily
# Or use environment variable
dotnet ef database update --project backend/CashCraft.Api
```

Or use Railway/Render console to run migrations.

---

## Part 2: Frontend Deployment (Next.js)

### Step 1: Update API URL

Create `.env.production` file:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Step 2: Deploy to Vercel

**Method 1: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Method 2: Vercel Dashboard (Recommended)**
1. Go to vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./` (or your frontend folder)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```
6. Click Deploy

### Step 3: Configure Custom Domain

1. In Vercel Dashboard:
   - Go to Project Settings > Domains
   - Add your domain (e.g., cashcraft.com)
2. Update DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
3. Wait for DNS propagation (5-30 minutes)

---

## Part 3: Environment Variables Summary

### Backend Environment Variables
```
ConnectionStrings__DefaultConnection=<database-connection-string>
JwtSettings__SecretKey=<min-32-char-secure-random-string>
JwtSettings__Issuer=https://api.yourdomain.com
JwtSettings__Audience=https://yourdomain.com
JwtSettings__ExpiryMinutes=60
GoogleApiKey=<your-google-gemini-api-key>
ASPNETCORE_ENVIRONMENT=Production
```

### Frontend Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

---

## Part 4: Post-Deployment Setup

### 1. Create Admin User
Run this endpoint once:
```bash
curl -X POST https://api.yourdomain.com/api/admin/create-admin
```

### 2. Test Authentication
```bash
# Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@123","password":"admin123"}'
```

### 3. Update CORS Settings
In backend `Program.cs`, update CORS to allow your domain:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://yourdomain.com", "https://www.yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

---

## Part 5: SSL/HTTPS

- **Vercel**: Automatic SSL (Let's Encrypt)
- **Railway**: Automatic SSL
- **Azure**: Configure in Azure Portal
- **Render**: Automatic SSL

---

## Part 6: Monitoring & Maintenance

### Backend Monitoring
- Azure: Application Insights
- Railway: Built-in logs
- Render: Built-in logs

### Frontend Monitoring
- Vercel Analytics (built-in)
- Google Analytics (optional)

### Database Backups
- Azure SQL: Automatic backups
- Railway: Manual backups
- Supabase: Automatic backups

---

## Troubleshooting

### Issue: CORS Errors
- Check backend CORS configuration
- Verify frontend URL is allowed
- Check browser console for exact error

### Issue: 401 Unauthorized
- Verify JWT secret matches between environments
- Check token expiry
- Verify API URL is correct

### Issue: Database Connection Failed
- Check connection string format
- Verify database is accessible from backend host
- Check firewall rules

### Issue: Google OAuth Not Working
- Update Google OAuth redirect URIs
- Add production domain to authorized domains
- Verify client ID in frontend env

---

## Cost Estimate

### Free Tier Option:
- Frontend: Vercel (Free)
- Backend: Railway (Free tier: $5 credit/month)
- Database: Railway PostgreSQL (Free tier)
- **Total: $0-5/month**

### Production Option:
- Frontend: Vercel Pro ($20/month)
- Backend: Azure App Service B1 ($13/month)
- Database: Azure SQL Basic ($5/month)
- **Total: ~$38/month**

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Set up monitoring/alerts
- [ ] Regular security updates

---

## Quick Start Commands

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Test backend health
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com

# View backend logs (Railway)
railway logs

# View frontend logs (Vercel)
vercel logs
```

---

## Support

For issues:
1. Check logs in hosting dashboard
2. Verify environment variables
3. Test API endpoints with Postman
4. Check database connectivity

---

## Next Steps After Deployment

1. Test all features thoroughly
2. Set up monitoring
3. Configure backups
4. Add custom domain email
5. Set up analytics
6. Create user documentation
7. Plan for scaling

Good luck with your deployment! 🚀
