# Quick Deploy Guide

Get your app deployed in under 30 minutes.

## Prerequisites
- GitHub account
- Supabase account
- Vercel/Netlify account (for frontend)
- Render/Railway account (for backend)

---

## 5-Step Deployment

### Step 1: Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project to initialize
3. Go to SQL Editor and run these files in order:
   - `backend/supabase-schema.sql`
   - `backend/supabase-instructors-schema.sql`
   - `backend/supabase-announcements-schema.sql`
   - `backend/supabase-admissions-schema.sql`
   - `backend/supabase-api-keys-schema.sql`
   - `backend/supabase-assignments-schema.sql`
   - `backend/supabase-certificates-schema.sql`
   - `backend/supabase-community-schema.sql`

4. Copy your credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → anon/public key
   - Service Role Key: Settings → API → service_role key (keep secret!)

### Step 2: Deploy Backend to Render (10 minutes)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `devget-learning-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   SUPABASE_ANON_KEY=<your-anon-key>
   JWT_SECRET=<generate-random-string-256-chars>
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   MAX_FILE_SIZE=5242880
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

6. Click "Create Web Service"
7. Wait for deployment (3-5 minutes)
8. Copy your backend URL (e.g., `https://devget-learning-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   VITE_API_URL=<your-backend-url-from-step-2>
   ```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update Backend CORS (2 minutes)

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your actual Vercel URL
5. Save changes (service will redeploy automatically)

### Step 5: Initialize Data (5 minutes)

Run these commands locally with production credentials:

```bash
# Set environment variables temporarily
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run setup scripts
cd backend
node scripts/setup-instructors.js
node scripts/add-mern-to-supabase.js
node scripts/add-agentic-ai-to-supabase.js
node scripts/setup-assignments.js

# Create admin user
node scripts/set-admin-role.js your-admin-email@example.com
```

---

## Verify Deployment

1. Visit your frontend URL
2. Click "Sign Up" and create an account
3. Check email for verification
4. Log in
5. Browse courses
6. Test enrollment

Check backend health:
```
https://your-backend-url.onrender.com/health
```

Should return:
```json
{
  "status": "success",
  "message": "DEVGet Learning API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check browser console for specific error
- Ensure no trailing slash in URLs

### Database Connection Issues
- Verify Supabase credentials are correct
- Check if RLS policies are enabled
- Review Supabase logs in dashboard

### Build Failures
**Backend:**
- Check Render logs for specific error
- Verify all dependencies in package.json
- Ensure Node.js version compatibility

**Frontend:**
- Check Vercel logs
- Verify environment variables are set
- Test build locally: `npm run build`

### Authentication Not Working
- Verify Supabase Auth is enabled
- Check email settings in Supabase
- Review browser console for errors

---

## Alternative: Deploy to Railway (Backend)

If you prefer Railway over Render:

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Add variables" and add all environment variables
5. Railway auto-detects Node.js and deploys
6. Copy your Railway URL

---

## Alternative: Deploy to Netlify (Frontend)

If you prefer Netlify over Vercel:

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add environment variables
6. Deploy

---

## Cost Estimate

**Free Tier (Recommended for Testing):**
- Supabase: Free (500MB database)
- Render: Free (750 hours/month)
- Vercel: Free (100GB bandwidth)
- **Total: $0/month**

**Production (Small Scale):**
- Supabase Pro: $25/month
- Render Starter: $7/month
- Vercel Pro: $20/month (optional)
- **Total: $32-52/month**

---

## Next Steps

1. Set up custom domain (optional)
2. Configure email templates in Supabase
3. Add course content
4. Set up monitoring
5. Review PRODUCTION-CHECKLIST.md

---

## Support

- Render: [render.com/docs](https://render.com/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)

---

**Deployment Time:** ~30 minutes
**Difficulty:** Beginner-friendly
**Cost:** Free tier available
