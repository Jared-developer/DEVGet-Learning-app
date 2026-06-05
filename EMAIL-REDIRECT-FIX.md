# Email Confirmation Redirect Fix

## Problem
When users signed up and clicked the email confirmation link, they were being redirected to `localhost` instead of the production website.

## Root Cause
The signup flow in `AuthContext.jsx` was using `window.location.origin` to set the email confirmation redirect URL. This captured the current browser URL at the time of signup. If the app was running on localhost during development or testing, the email would contain `http://localhost:5173` as the redirect URL.

## Solution
Added a new environment variable `VITE_APP_URL` that explicitly sets the production frontend URL. The code now uses this environment variable first, and only falls back to `window.location.origin` for local development.

## Changes Made

### 1. Updated `frontend/src/contexts/AuthContext.jsx`
- Modified `signUp()` function to use `VITE_APP_URL` environment variable
- Modified `signInWithGoogle()` function to use `VITE_APP_URL` environment variable
- Falls back to `window.location.origin` if `VITE_APP_URL` is not set (for local dev)

### 2. Updated `frontend/src/pages/SignIn.jsx`
- Modified `handleForgotPassword()` function to use `VITE_APP_URL` environment variable
- Ensures password reset emails also redirect to production URL

### 3. Updated `frontend/.env`
- Added `VITE_APP_URL` environment variable with placeholder

### 4. Updated `ENV-TEMPLATE.md`
- Added documentation for the new `VITE_APP_URL` variable
- Explained its importance for email redirects

## Setup Instructions

### For Production Deployment

1. **Add the environment variable to your hosting platform:**

   **Vercel:**
   ```
   Settings → Environment Variables → Add New
   Name: VITE_APP_URL
   Value: https://your-production-url.vercel.app
   ```

   **Netlify:**
   ```
   Site settings → Environment variables → Add a variable
   Key: VITE_APP_URL
   Value: https://your-production-url.netlify.app
   ```

   **Railway/Render:**
   ```
   Variables → New Variable
   VITE_APP_URL=https://your-production-url.com
   ```

2. **Redeploy your frontend** after adding the environment variable

### For Local Development

No changes needed! The code automatically uses `window.location.origin` (localhost) when `VITE_APP_URL` is not set.

If you want to test production redirects locally, set it in `frontend/.env`:
```env
VITE_APP_URL=http://localhost:5173
```

## Testing the Fix

### 1. Test Email Confirmation
1. Sign up with a new email address
2. Check your email inbox
3. Click the confirmation link in the email
4. Verify it redirects to your production URL (not localhost)
5. Verify you're logged in automatically after confirmation

### 2. Test Password Reset
1. Click "Forgot password?" on the signin page
2. Enter your email
3. Check your email inbox
4. Click the password reset link
5. Verify it redirects to your production URL
6. Complete the password reset

### 3. Test Google OAuth (if enabled)
1. Click "Sign in with Google"
2. Complete Google authentication
3. Verify you're redirected back to your production URL

## What Existing Users Experience

**Important:** Users who signed up before this fix was deployed may still have email confirmation links with the old localhost URLs. These users have two options:

1. **Request a new confirmation email** through Supabase:
   - Go to Supabase Dashboard → Authentication → Users
   - Find the user
   - Click "Send confirmation email" again

2. **Have an admin manually confirm their email**:
   - In Supabase Dashboard → Authentication → Users
   - Find the user
   - Toggle "Email confirmed" to Yes

## Prevention for Future

To prevent similar issues in the future:

1. **Always set `VITE_APP_URL` before deploying to production**
2. **Test signup flow in production** after deployment
3. **Check email links** in a test account to verify correct redirects
4. **Document all environment variables** in ENV-TEMPLATE.md
5. **Use staging environment** to test email flows before production deployment

## Related Files

- `frontend/src/contexts/AuthContext.jsx` - Auth logic
- `frontend/src/pages/SignIn.jsx` - Signin/signup UI and forgot password
- `frontend/.env` - Environment variables (local)
- `ENV-TEMPLATE.md` - Environment variables documentation
- `frontend/src/lib/supabase.js` - Supabase client configuration

## Additional Notes

### Why Not Hardcode the URL?
Hardcoding the production URL would break local development and staging environments. Using an environment variable provides flexibility while ensuring production works correctly.

### Supabase Configuration
The `detectSessionInUrl: true` setting in `frontend/src/lib/supabase.js` ensures that Supabase can detect and process the authentication tokens in the URL when users click email confirmation links.

### Email Templates
If you customize Supabase email templates, ensure the redirect URL uses the `{{ .ConfirmationURL }}` variable, which will automatically use the `emailRedirectTo` value set in the code.

## Rollback Plan

If this change causes issues:

1. Remove `VITE_APP_URL` from your environment variables
2. The code will fall back to `window.location.origin`
3. Redeploy the frontend

However, this will revert to the original problem where email links contain the URL active at signup time.

---

**Fixed by:** Kiro
**Date:** 2026-06-05
**Status:** ✅ Resolved
