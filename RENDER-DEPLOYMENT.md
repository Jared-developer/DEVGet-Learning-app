# Render Deployment Guide

## Backend Deployment on Render

### Step 1: Set Environment Variables

In your Render dashboard, go to your backend service and add these environment variables:

**Required Variables:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

**Optional Variables (if using):**
```
OPENAI_API_KEY=your-openai-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL_2=https://another-frontend-domain.com
FRONTEND_URL_3=https://yet-another-domain.com
```

### Important: Frontend URL Configuration

The `FRONTEND_URL` variable is **critical** for CORS to work properly. Set it to your deployed frontend URL:
- Netlify: `https://your-app.netlify.app`
- Vercel: `https://your-app.vercel.app`
- Custom domain: `https://yourdomain.com`

**Without this, the frontend won't be able to communicate with the backend!**

### Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Go to "API" section
4. Copy the following:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon/public key** → Use as `SUPABASE_ANON_KEY`
   - **service_role key** → Use as `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Build Settings

Make sure your Render service has these settings:

- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Node Version:** 22.x (or latest LTS)

### Step 4: Deploy

After setting the environment variables, trigger a new deploy from the Render dashboard.

## Troubleshooting

### Error: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"

**Cause:** The `SUPABASE_URL` environment variable is not set or is empty.

**Solution:**
1. Go to Render dashboard → Your service → Environment
2. Add `SUPABASE_URL` with your Supabase project URL
3. Make sure it starts with `https://`
4. Example: `https://abcdefghijklmnop.supabase.co`
5. Save and redeploy

### Error: "Missing Supabase environment variables"

**Cause:** Required environment variables are not set.

**Solution:**
1. Check that both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
2. Make sure there are no extra spaces or quotes
3. Redeploy after adding variables

### Checking Logs

To see detailed error messages:
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for the error messages with ❌ or ✅ symbols

## Frontend Deployment

The frontend should be deployed separately (e.g., on Netlify or Vercel) with its own environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-backend.onrender.com
```
