# Environment Variables Template

Copy this template and fill in your actual values for deployment.

## Backend Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration
JWT_SECRET=your-super-secret-256-bit-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API URL
VITE_API_URL=https://your-backend.onrender.com

# Google Calendar (Optional)
VITE_GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
VITE_GOOGLE_CALENDAR_PUBLIC_URL=https://calendar.google.com/calendar/embed?src=...
```

---

## How to Get These Values

### Supabase Credentials
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Go to "API" section
4. Copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### JWT Secret
Generate a strong random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64

# Using Python
python -c "import secrets; print(secrets.token_hex(64))"
```

### Email Configuration (Gmail)
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password for `EMAIL_PASS`

### Frontend URL
- Development: `http://localhost:5173`
- Production: Your deployed frontend URL (e.g., `https://your-app.vercel.app`)

### Backend API URL
- Development: `http://localhost:5000`
- Production: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)

---

## Platform-Specific Instructions

### Render
1. Go to your service dashboard
2. Click "Environment" tab
3. Click "Add Environment Variable"
4. Add each variable one by one

### Railway
1. Go to your project
2. Click on your service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable

### Vercel
1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable
4. Select environment (Production/Preview/Development)

### Netlify
1. Go to Site settings
2. Click "Environment variables"
3. Click "Add a variable"
4. Add each variable

### Heroku
```bash
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your-url
# ... repeat for each variable
```

---

## Security Checklist

- [ ] Never commit `.env` files to Git
- [ ] Use different values for development and production
- [ ] Keep `SUPABASE_SERVICE_ROLE_KEY` secret (never expose to frontend)
- [ ] Use strong, unique `JWT_SECRET`
- [ ] Use app-specific passwords for email
- [ ] Rotate secrets regularly
- [ ] Use environment variables, never hardcode secrets
- [ ] Verify `.env` is in `.gitignore`

---

## Testing Your Configuration

### Backend Health Check
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "success",
  "message": "DEVGet Learning API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Frontend Check
1. Open your frontend URL in browser
2. Open browser console (F12)
3. Check for errors
4. Try to sign up/login
5. Verify API calls are going to correct backend URL

### Database Connection
```bash
# Run locally with production credentials
cd backend
node -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase.from('courses').select('count');
console.log('Connection:', error ? 'Failed' : 'Success');
"
```

---

## Common Issues

### CORS Errors
- Ensure `FRONTEND_URL` exactly matches your frontend domain
- No trailing slashes
- Include protocol (https://)

### Database Connection Failed
- Verify Supabase URL is correct
- Check if service role key is valid
- Ensure RLS policies allow access

### Authentication Not Working
- Verify both anon keys match
- Check JWT secret is set
- Ensure Supabase Auth is enabled

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2FA is enabled
- Try different SMTP provider if issues persist

---

## Backup Your Configuration

Store your environment variables securely:
1. Use a password manager (1Password, LastPass, Bitwarden)
2. Create a secure note with all values
3. Share with team members securely
4. Never email or message credentials in plain text

---

## Environment Variable Priority

Most platforms load environment variables in this order:
1. Platform environment variables (highest priority)
2. `.env.production` file
3. `.env` file
4. Default values in code (lowest priority)

For production, always use platform environment variables, not `.env` files.
