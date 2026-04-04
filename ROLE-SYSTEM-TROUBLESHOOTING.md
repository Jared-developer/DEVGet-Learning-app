# Role System Troubleshooting Guide

This guide helps you diagnose and fix common issues with the role-based access control system.

## Quick Diagnostics

Run this command first to check system health:
```bash
cd backend
npm run test:roles
```

This will check:
- ✅ Database table exists
- ✅ Helper functions work
- ✅ RLS policies configured
- ✅ User role distribution
- ✅ Users without roles
- ✅ Duplicate assignments
- ✅ Environment variables

---

## Common Issues

### 1. "Table user_roles does not exist"

**Symptoms:**
- Error when signing up
- Cannot access protected routes
- Backend logs show table errors

**Solution:**
```bash
# 1. Open Supabase SQL Editor
# 2. Copy contents of backend/supabase-user-roles-schema.sql
# 3. Paste and run in SQL Editor
# 4. Verify table creation in Supabase Table Editor
# 5. Run verification:
npm run setup:roles
```

**Verification:**
- Table `user_roles` appears in Supabase dashboard
- Setup script shows "✅ User roles table exists"

---

### 2. Users Can Access Both Portals

**Symptoms:**
- Developers can access `/dashboard`
- Students can access `/developer-console`
- No redirects happening

**Solution:**
```bash
# 1. Check if roles are assigned
npm run test:roles

# 2. Migrate existing users
npm run migrate:users

# 3. Clear browser cache
# - Chrome: Ctrl+Shift+Delete
# - Firefox: Ctrl+Shift+Delete
# - Safari: Cmd+Option+E

# 4. Sign out and sign in again

# 5. Check browser console for errors
# - Press F12
# - Look for red errors
```

**Verification:**
- Developer redirected from `/dashboard` to `/developer-console`
- Student redirected from `/developer-console` to `/dashboard`

---

### 3. Users Have No Roles

**Symptoms:**
- Cannot access any protected routes
- Stuck on sign-in page
- "No roles assigned" error

**Solution:**
```bash
# 1. Run migration script
npm run migrate:users

# 2. If specific user needs role:
npm run assign:role user@example.com student

# 3. Verify role assignment:
npm run test:roles
```

**Manual SQL Fix:**
```sql
-- Assign student role to specific user
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'student')
ON CONFLICT (user_id, role) DO NOTHING;
```

---

### 4. Sign-Up Not Assigning Roles

**Symptoms:**
- New users can't access anything
- Role not created during sign-up
- Backend logs show insert errors

**Diagnosis:**
```bash
# Check backend logs for errors
# Look for "Error assigning role" messages
```

**Solution:**

**A. Check Supabase Permissions:**
```sql
-- Run in Supabase SQL Editor
GRANT ALL ON user_roles TO authenticated;
GRANT SELECT ON user_roles TO anon;
```

**B. Verify Service Role Key:**
```bash
# Check backend/.env has correct key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**C. Check RLS Policies:**
```sql
-- Verify service role can insert
SELECT * FROM pg_policies WHERE tablename = 'user_roles';
```

---

### 5. "Invalid Token" or "Unauthorized" Errors

**Symptoms:**
- API calls fail with 401
- Cannot fetch user roles
- Sign-in works but routes fail

**Solution:**
```bash
# 1. Check token in browser
# - Open DevTools (F12)
# - Go to Application > Local Storage
# - Look for Supabase auth token

# 2. Clear auth state
localStorage.clear()
# Then sign in again

# 3. Check backend logs for auth errors

# 4. Verify Supabase URL and keys in .env
```

**Verification:**
```bash
# Test API endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/user-roles/me
```

---

### 6. Redirects Not Working

**Symptoms:**
- Users stay on wrong portal
- No automatic redirects
- Can manually navigate to restricted areas

**Solution:**

**A. Check Frontend Code:**
```bash
# Verify RoleProtectedRoute is imported
grep -r "RoleProtectedRoute" frontend/src/App.jsx

# Should see routes wrapped with RoleProtectedRoute
```

**B. Check Browser Console:**
```javascript
// Open DevTools Console (F12)
// Check for errors related to:
// - useAuth
// - userRoles
// - RoleProtectedRoute
```

**C. Verify Auth Context:**
```bash
# Check that userRoles is populated
# In browser console:
console.log(localStorage.getItem('supabase.auth.token'))
```

---

### 7. Duplicate Role Assignments

**Symptoms:**
- Multiple same roles for one user
- Database constraint errors
- Slow role queries

**Solution:**
```sql
-- Find duplicates
SELECT user_id, role, COUNT(*)
FROM user_roles
GROUP BY user_id, role
HAVING COUNT(*) > 1;

-- Remove duplicates (keep one)
DELETE FROM user_roles a
USING user_roles b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.role = b.role;
```

**Prevention:**
- UNIQUE constraint should prevent this
- Check schema was applied correctly

---

### 8. Performance Issues

**Symptoms:**
- Slow page loads
- Delayed redirects
- High database queries

**Solution:**

**A. Check Indexes:**
```sql
-- Verify indexes exist
SELECT * FROM pg_indexes WHERE tablename = 'user_roles';

-- Should see:
-- - idx_user_roles_user_id
-- - idx_user_roles_role
```

**B. Optimize Queries:**
```javascript
// Cache roles in frontend
// Already implemented in AuthContext
// Roles fetched once per session
```

**C. Monitor Database:**
```bash
# Check Supabase dashboard
# - Database > Performance
# - Look for slow queries
```

---

### 9. Migration Script Fails

**Symptoms:**
- `npm run migrate:users` errors
- Users not getting roles
- Script hangs or crashes

**Solution:**

**A. Check Database Connection:**
```bash
# Test Supabase connection
node scripts/test-supabase.js
```

**B. Run in Batches:**
```javascript
// If many users, modify script to process in batches
// Add delay between operations
await new Promise(resolve => setTimeout(resolve, 100))
```

**C. Manual Migration:**
```sql
-- Assign student role to all users with enrollments
INSERT INTO user_roles (user_id, role)
SELECT DISTINCT user_id, 'student'
FROM enrollments
ON CONFLICT (user_id, role) DO NOTHING;

-- Assign developer role to all users with API keys
INSERT INTO user_roles (user_id, role)
SELECT DISTINCT user_id, 'developer'
FROM api_keys
ON CONFLICT (user_id, role) DO NOTHING;
```

---

### 10. Environment Variables Not Loading

**Symptoms:**
- "SUPABASE_URL is not defined"
- Scripts fail immediately
- Cannot connect to database

**Solution:**
```bash
# 1. Check .env file exists
ls -la backend/.env

# 2. Verify contents
cat backend/.env

# 3. Check format (no spaces around =)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key-here

# 4. Restart terminal/IDE

# 5. Run from correct directory
cd backend
npm run setup:roles
```

---

## Advanced Diagnostics

### Check Database Directly

```sql
-- Count users by role
SELECT role, COUNT(*) as count
FROM user_roles
GROUP BY role;

-- Find users without roles
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.id IS NULL;

-- Check specific user's roles
SELECT ur.role, ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'user@example.com';
```

### Check Backend Logs

```bash
# Start backend with verbose logging
cd backend
NODE_ENV=development npm run dev

# Watch for:
# - "Error assigning role"
# - "Error fetching user roles"
# - Database connection errors
```

### Check Frontend Console

```javascript
// In browser DevTools Console (F12)

// Check auth state
console.log(localStorage.getItem('supabase.auth.token'))

// Check user roles (if signed in)
// This should be available in React DevTools
// Look for AuthContext > userRoles
```

---

## Prevention Best Practices

1. **Always backup before migrations**
   ```bash
   # Backup Supabase database before major changes
   ```

2. **Test in development first**
   ```bash
   # Never run scripts directly in production
   ```

3. **Monitor after deployment**
   ```bash
   # Check logs for first 24 hours
   # Watch for role-related errors
   ```

4. **Keep documentation updated**
   ```bash
   # Document any custom role configurations
   ```

5. **Regular health checks**
   ```bash
   # Run weekly: npm run test:roles
   ```

---

## Getting Help

If issues persist:

1. **Check Documentation:**
   - `USER-ROLES-SETUP.md` - Setup guide
   - `ROLE-BASED-ACCESS-IMPLEMENTATION.md` - Technical details
   - `ROLE-ACCESS-DIAGRAM.md` - Visual guides

2. **Run Diagnostics:**
   ```bash
   npm run test:roles
   ```

3. **Check Logs:**
   - Backend console output
   - Browser DevTools console
   - Supabase logs

4. **Verify Setup:**
   - Database schema applied
   - Environment variables set
   - Dependencies installed

5. **Test Manually:**
   - Sign up as new user
   - Check role assignment
   - Test access restrictions

---

## Quick Reference

### Useful Commands
```bash
# Health check
npm run test:roles

# Setup verification
npm run setup:roles

# Migrate users
npm run migrate:users

# Assign role
npm run assign:role email@example.com student

# Check specific user
# (Use Supabase dashboard or SQL)
```

### Useful SQL Queries
```sql
-- All roles
SELECT * FROM user_roles;

-- User's roles
SELECT * FROM user_roles WHERE user_id = 'uuid';

-- Users without roles
SELECT u.* FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.id IS NULL;

-- Role counts
SELECT role, COUNT(*) FROM user_roles GROUP BY role;
```

### Log Locations
- Backend: Terminal where `npm run dev` is running
- Frontend: Browser DevTools Console (F12)
- Database: Supabase Dashboard > Logs

---

## Still Having Issues?

Create a detailed bug report with:
- Error messages (exact text)
- Steps to reproduce
- Output of `npm run test:roles`
- Browser console errors
- Backend log errors
- Supabase version
- Node.js version
