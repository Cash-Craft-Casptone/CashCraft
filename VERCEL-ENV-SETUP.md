# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### 1. Backend API URL
```
NEXT_PUBLIC_API_URL=https://cashcraft.runasp.net/api
```

### 2. Google OAuth Client ID
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com
```

## How to Add Environment Variables on Vercel

### Option 1: Via Vercel Dashboard
1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://cashcraft.runasp.net/api`
   - Environment: Select **Production**, **Preview**, and **Development**
4. Repeat for `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. Click **Save**
6. **Redeploy** your project for changes to take effect

### Option 2: Via Vercel CLI
```bash
# Add API URL
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://cashcraft.runasp.net/api

# Add Google Client ID
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production
# When prompted, enter: 299400316195-iejs67lerrrsjv4gplmjhmlf0eaphtp7.apps.googleusercontent.com

# Redeploy
vercel --prod
```

## Verification

After adding the environment variables and redeploying:

1. Open your deployed app on Vercel
2. Open browser DevTools (F12) → Console
3. Check the API requests - they should now point to `https://cashcraft.runasp.net/api`
4. If you still see `localhost:5005`, clear your browser cache and hard refresh (Ctrl+Shift+R)

## Troubleshooting

### Still seeing "Failed to fetch" errors?

1. **Clear Browser Cache**: The browser might be caching the old code
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Or use Incognito/Private mode

2. **Check Vercel Build Logs**: Make sure the environment variables were included in the build
   - Go to Deployments → Click on latest deployment → View Build Logs
   - Search for "NEXT_PUBLIC_API_URL" to confirm it was set

3. **Verify CORS on Backend**: Make sure your backend allows requests from `*.vercel.app`
   - Check your backend CORS configuration
   - Should include: `https://*.vercel.app` or your specific domain

4. **Check Network Tab**: 
   - Open DevTools → Network tab
   - Try to login
   - Check the request URL - should be `https://cashcraft.runasp.net/api/Auth/login`
   - If it's still `localhost`, the environment variable wasn't applied

## Google OAuth Callback URL

Make sure your Google Cloud Console has this callback URL registered:
```
https://cashcraft-capstone.vercel.app
```

Or if using a custom domain:
```
https://yourdomain.com
```

Note: Google OAuth with `@react-oauth/google` handles the callback automatically, so you don't need a specific `/api/auth/callback/google` endpoint.
