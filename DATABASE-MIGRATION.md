# 🔄 Database Migration Guide

## Switching from SQL Server to PostgreSQL

Your CashCraft app now supports **both SQL Server and PostgreSQL**! The app automatically detects which database to use based on the connection string.

---

## ✅ What Changed

1. Added PostgreSQL support package (`Npgsql.EntityFrameworkCore.PostgreSQL`)
2. Updated `Program.cs` to auto-detect database provider
3. Kept SQL Server support for local development

**You can now use:**
- SQL Server (local development)
- PostgreSQL (production - free hosting)
- Switch between them without code changes!

---

## 🚀 Quick Start

### Option 1: Keep SQL Server (Local Development)
No changes needed! Your current setup works as-is.

```json
// appsettings.json
{
  "ConnectionStrings": {
    "Default": "Server=(localdb)\\MSSQLLocalDB;Database=CashCraft;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### Option 2: Use PostgreSQL (Production)
Update your connection string to PostgreSQL format:

```json
// appsettings.json or Environment Variable
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=cashcraft;Username=postgres;Password=yourpassword"
  }
}
```

The app automatically detects `Host=` in the connection string and uses PostgreSQL!

---

## 📦 Installation Steps

### 1. Install PostgreSQL Package
```bash
cd backend/CashCraft.Api
dotnet restore
```

This installs the `Npgsql.EntityFrameworkCore.PostgreSQL` package.

### 2. Create PostgreSQL Migrations (Optional)
If you want separate migrations for PostgreSQL:

```bash
# Delete old SQL Server migrations (optional)
rm -rf Migrations/

# Create new PostgreSQL migrations
dotnet ef migrations add InitialCreate --context ApplicationDbContext

# Apply migrations
dotnet ef database update
```

**Note:** Your existing migrations should work fine with PostgreSQL! Entity Framework Core handles most differences automatically.

---

## 🌐 Production Deployment

### Using Supabase (Free PostgreSQL)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings → Database

2. **Connection String Format**
   ```
   Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require
   ```

3. **Set Environment Variable**
   ```bash
   # On Render.com
   ConnectionStrings__Default=Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require
   ```

### Using Render PostgreSQL (Free)

1. **Create Database on Render**
   - Go to [render.com](https://render.com)
   - New → PostgreSQL
   - Copy "Internal Database URL"

2. **Connection String Format**
   ```
   Host=dpg-xxxxx-a.oregon-postgres.render.com;Port=5432;Database=cashcraft_db;Username=cashcraft_user;Password=xxxxx;SSL Mode=Require
   ```

3. **Set Environment Variable**
   ```bash
   ConnectionStrings__Default=<your-render-postgres-url>
   ```

---

## 🔧 Local PostgreSQL Setup (Optional)

### Windows
```bash
# Install PostgreSQL
winget install PostgreSQL.PostgreSQL

# Or download from: https://www.postgresql.org/download/windows/
```

### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cashcraft;

# Create user (optional)
CREATE USER cashcraft_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cashcraft TO cashcraft_user;

# Exit
\q
```

### Update Connection String
```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=cashcraft;Username=postgres;Password=your_password"
  }
}
```

---

## 🔄 Migration Commands

### Create New Migration
```bash
dotnet ef migrations add MigrationName
```

### Apply Migrations
```bash
dotnet ef database update
```

### Rollback Migration
```bash
dotnet ef database update PreviousMigrationName
```

### Remove Last Migration
```bash
dotnet ef migrations remove
```

---

## 📊 Database Comparison

| Feature | SQL Server | PostgreSQL |
|---------|-----------|------------|
| **Cost** | Paid (Azure) | Free (Supabase/Render) |
| **Local Dev** | ✅ LocalDB included | ⚠️ Requires install |
| **Production** | 💰 $5-50/month | ✅ Free tier available |
| **Performance** | Excellent | Excellent |
| **EF Core Support** | ✅ Full | ✅ Full |
| **Cloud Hosting** | Azure SQL | Supabase, Render, AWS RDS |

---

## 🎯 Recommended Setup

### Development (Local)
- **Use SQL Server LocalDB** (already installed with Visual Studio)
- No extra setup needed
- Fast and easy

### Production (Deployment)
- **Use PostgreSQL** (Supabase or Render)
- 100% free tier available
- Better for cloud hosting

---

## 🐛 Troubleshooting

### Error: "Npgsql not found"
```bash
cd backend/CashCraft.Api
dotnet restore
dotnet build
```

### Error: "Could not connect to PostgreSQL"
1. Check connection string format
2. Verify PostgreSQL is running
3. Check firewall settings
4. Ensure SSL Mode is set correctly

### Error: "Migration failed"
```bash
# Delete migrations and recreate
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Connection String Issues
**SQL Server format:**
```
Server=localhost;Database=CashCraft;Trusted_Connection=True
```

**PostgreSQL format:**
```
Host=localhost;Port=5432;Database=cashcraft;Username=postgres;Password=pass
```

---

## 📝 Connection String Examples

### SQL Server (Local)
```
Server=(localdb)\\MSSQLLocalDB;Database=CashCraft;Trusted_Connection=True;MultipleActiveResultSets=true
```

### SQL Server (Azure)
```
Server=tcp:yourserver.database.windows.net,1433;Database=CashCraft;User ID=admin;Password=yourpassword;Encrypt=True
```

### PostgreSQL (Local)
```
Host=localhost;Port=5432;Database=cashcraft;Username=postgres;Password=yourpassword
```

### PostgreSQL (Supabase)
```
Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=yourpassword;SSL Mode=Require
```

### PostgreSQL (Render)
```
Host=dpg-xxxxx.oregon-postgres.render.com;Port=5432;Database=cashcraft_db;Username=cashcraft_user;Password=xxxxx;SSL Mode=Require
```

---

## ✅ Testing Your Setup

### 1. Test Connection
```bash
cd backend/CashCraft.Api
dotnet run
```

Visit: `http://localhost:5000/health`

### 2. Test Database
```bash
# Check if tables were created
dotnet ef database update

# Or use database client
# SQL Server: SQL Server Management Studio
# PostgreSQL: pgAdmin, DBeaver, or psql
```

### 3. Test API
```bash
# Create admin user
curl http://localhost:5000/api/admin/create-admin

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@123","password":"admin123"}'
```

---

## 🎉 You're Done!

Your app now supports both databases:
- ✅ SQL Server for local development
- ✅ PostgreSQL for free production hosting
- ✅ Automatic detection based on connection string
- ✅ No code changes needed to switch

Deploy to Render + Supabase for 100% free hosting! 🚀
