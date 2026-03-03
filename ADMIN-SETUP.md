# Admin Account Setup

## Creating the Admin Account

### Option 1: Using the Script (Recommended)

1. **Start the backend server:**
   ```bash
   cd backend/CashCraft.Api
   dotnet run
   ```

2. **In a new terminal, run the admin creation script:**
   ```bash
   node create-admin.js
   ```

3. **Login credentials:**
   - Email: `admin@123`
   - Password: `admin123`
   - Role: `Admin`

### Option 2: Manual Registration

1. Start the backend server
2. Go to the registration page in your app
3. Register with:
   - Email: `admin@123`
   - Username: `admin`
   - Display Name: `Admin User`
   - Phone: `1234567890`
   - Password: `admin123`

4. **Manually update the role in the database:**
   
   Using SQL Server Management Studio or any SQL client:
   ```sql
   UPDATE Users 
   SET Role = 'Admin' 
   WHERE Email = 'admin@123';
   ```

### Option 3: Using API Directly

Send a POST request to `http://localhost:5005/api/auth/register`:

```json
{
  "email": "admin@123",
  "username": "admin",
  "displayName": "Admin User",
  "phoneNumber": "1234567890",
  "password": "admin123",
  "role": "Admin"
}
```

## Accessing the Admin Panel

1. Login with the admin credentials
2. Navigate to `/admin` in your browser
3. You should see the Admin Dashboard with full access to:
   - Create, Update, Delete Articles
   - Create, Update, Delete Videos
   - Create, Update, Delete Quizzes

## Roles

The system supports three roles:
- **User** (default) - Regular users
- **Editor** - Can access admin panel
- **Admin** - Full access to admin panel

## Security Note

⚠️ **Important:** Change the default admin password after first login in a production environment!
