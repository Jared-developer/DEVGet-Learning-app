# Deployment Guide - DEVGet Learning Platform

This guide covers deploying the DEVGet Learning Platform to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project set up
- Domain name (optional but recommended)
- Hosting platform account (Vercel, Netlify, Railway, Render, etc.)

## Architecture Overview

- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js + Express API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend)
**Recommended for ease of use**

### Option 2: Netlify (Frontend) + Render (Backend)
**Good free tier options**

### Option 3: Single Platform (Railway or Render)
**Simplest setup, everything in one place**

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and keys

### 1.2 Run Database Migrations
Execute the SQL files in this order:
1. `backend/supabase-schema.sql` (main schema)
2. `backend/supabase-instructors-schema.sql`
3. `backend/supabase-announcements-schema.sql`
4. `backend/supabase-admissions-schema.sql`
5. `backend/supabase-api-keys-schema.sql`
6. `backend/supabase-assignments-schema.sql`
7. `backend/supabase-certificates-schema.sql`
8. `backend/supabase-community-schema.sql`

Run in Supabase Dashboard → SQL Editor

### 1.3 Configure Authentication
1. Enable Email authentication in Supabase Dashboard
2. Configure email templates (optional)
3. Set up OAuth providers if needed (Google, GitHub, etc.)

### 1.4 Set Row Level Security (RLS)
All tables have RLS policies defined in the SQL files. Verify they're enabled.

---

## Step 2: Backend Deployment

### Option A: Deploy to Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `backend` directory as root

2. **Configure Build Settings**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   Add all variables from `backend/.env.example`:
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=generate-strong-secret
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-domain.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   MAX_FILE_SIZE=5242880
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Note your backend URL (e.g., `https://your-app.onrender.com`)

### Option B: Deploy to Railway

1. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - Set root directory to `backend`
   - Railway auto-detects Node.js

3. **Add Environment Variables**
   Same as Render (see above)

4. **Deploy**
   - Railway automatically deploys
   - Note your backend URL

### Option C: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=your-url
   # ... set all other variables
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## Step 3: Frontend Deployment

### Option A: Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option B: Deploy to Netlify

1. **Deploy via Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

2. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

3. **Environment Variables**
   Same as Vercel (see above)

4. **Configure Redirects**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

5. **Deploy**
   - Click "Deploy site"

### Option C: Deploy to GitHub Pages

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Add Deploy Script to package.json**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## Step 4: Environment Configuration

### Backend Environment Variables

Create these in your hosting platform:

```env
# Required
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...
JWT_SECRET=your-256-bit-secret
FRONTEND_URL=https://your-frontend.com

# Email (Optional but recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Optional
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_URL=https://your-backend.com
```

---

## Step 5: Post-Deployment Setup

### 5.1 Update CORS Settings
In your backend, ensure `FRONTEND_URL` environment variable matches your deployed frontend URL.

### 5.2 Test the Deployment
1. Visit your frontend URL
2. Test user registration
3. Test login
4. Test course access
5. Test API endpoints: `https://your-backend.com/health`

### 5.3 Set Up Admin User
Run the admin setup script:
```bash
# Locally with production credentials
cd backend
node scripts/set-admin-role.js your-admin-email@example.com
```

### 5.4 Populate Initial Data
Run setup scripts:
```bash
node scripts/setup-instructors.js
node scripts/setup-assignments.js
node scripts/add-mern-to-supabase.js
node scripts/add-agentic-ai-to-supabase.js
```

---

## Step 6: Domain Configuration (Optional)

### Custom Domain for Frontend
**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Netlify:**
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

### Custom Domain for Backend
**Render:**
1. Go to Settings → Custom Domain
2. Add domain and configure DNS

**Railway:**
1. Go to Settings → Domains
2. Add custom domain

---

## Step 7: Monitoring & Maintenance

### Set Up Monitoring
1. **Supabase**: Monitor database usage in dashboard
2. **Backend**: Use platform logs (Render/Railway/Vercel)
3. **Frontend**: Set up error tracking (Sentry, LogRocket)

### Regular Maintenance
- Monitor database size and performance
- Review error logs weekly
- Update dependencies monthly
- Backup database regularly (Supabase has automatic backups)

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your frontend domain
- Check CORS configuration in `backend/server.js`

### Database Connection Issues
- Verify Supabase credentials
- Check if RLS policies are blocking requests
- Review Supabase logs

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs for specific errors

### Authentication Issues
- Verify Supabase Auth is enabled
- Check JWT secret configuration
- Review Supabase Auth logs

---

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] JWT_SECRET is strong and unique
- [ ] RLS policies are enabled on all tables
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on most platforms)
- [ ] Email credentials use app-specific passwords
- [ ] Service role key is never exposed to frontend
- [ ] Admin accounts are secured

---

## Cost Estimates

### Free Tier Options
- **Supabase**: Free tier (500MB database, 50,000 monthly active users)
- **Vercel**: Free tier (100GB bandwidth)
- **Netlify**: Free tier (100GB bandwidth)
- **Render**: Free tier (750 hours/month)
- **Railway**: $5 credit/month

### Recommended Paid Setup (Small Scale)
- Supabase Pro: $25/month
- Render/Railway: $7-20/month
- Vercel Pro: $20/month (optional)
- **Total**: ~$32-65/month

---

## Quick Deploy Commands

### Deploy Everything Locally First
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
# Backend - no build needed, runs directly
cd backend
npm install --production

# Frontend
cd frontend
npm install
npm run build
# Output in frontend/dist
```

---

## Support

For issues:
1. Check logs in your hosting platform
2. Review Supabase logs
3. Check browser console for frontend errors
4. Verify all environment variables are set

---

## Next Steps After Deployment

1. Set up custom domain
2. Configure email templates in Supabase
3. Add course content
4. Set up monitoring and alerts
5. Create backup strategy
6. Document API endpoints
7. Set up CI/CD pipeline (optional)

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Frontend URL**: _____________
**Backend URL**: _____________
**Supabase Project**: _____________
