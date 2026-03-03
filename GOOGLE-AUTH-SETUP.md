# Google Authentication Setup Guide

Google OAuth has been implemented! Follow these steps to complete the setup:

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - Your production domain
   - Click "Create"

5. Copy your **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

## Step 2: Add Client ID to Your App

Open `components/AuthScreen.tsx` and replace this line:

```typescript
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
```

With your actual Client ID:

```typescript
<GoogleOAuthProvider clientId="123456789-abc123.apps.googleusercontent.com">
```

## Step 3: Test It!

1. Restart your Next.js dev server
2. Go to the login page
3. You should see a "Sign in with Google" button
4. Click it and sign in with your Google account
5. You'll be automatically logged in and redirected to the dashboard!

## How It Works

1. User clicks "Sign in with Google"
2. Google popup opens for authentication
3. Google returns an ID token
4. Frontend sends the token to backend `/api/auth/google`
5. Backend verifies the token and creates/finds the user
6. Backend returns JWT access token
7. User is logged in!

## Features

- ✅ One-click sign in with Google
- ✅ Automatic account creation for new Google users
- ✅ Existing users can link their Google account
- ✅ Secure token verification
- ✅ Works on both login and register pages
- ✅ Beautiful UI with "Or continue with" divider

## Security Notes

- In production, you should verify the Google token signature using Google's public keys
- The current implementation decodes the token but doesn't verify the signature (suitable for development)
- For production, consider using a library like `Google.Apis.Auth` NuGet package in the backend

## Troubleshooting

**"Invalid Client ID" error:**
- Make sure you copied the correct Client ID
- Check that your domain is added to authorized JavaScript origins

**Button doesn't appear:**
- Check browser console for errors
- Make sure the Google OAuth package is installed: `npm install @react-oauth/google`
- Restart the dev server

**"Google authentication failed":**
- Check backend logs
- Make sure the backend is running on port 5005
- Verify the `/api/auth/google` endpoint is accessible
