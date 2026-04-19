# Community Authentication & RLS Fixes

## Issues Fixed

### 1. 401 Unauthorized Errors on Community Endpoints
**Problem**: Backend community routes returning 401 errors
**Cause**: Auth token not being properly retrieved or expired
**Fix**: 
- Added better error handling in `getAuthToken()` function
- Added null checks before making API calls
- Added Content-Type headers to all requests

### 2. 406 Not Acceptable Errors on Supabase Queries
**Problem**: Direct Supabase queries from frontend failing with 406
**Cause**: RLS policies + `.single()` method causing content negotiation issues
**Fix**: 
- Changed `.single()` to `.maybeSingle()` in enrollment checks
- Added proper error handling for enrollment queries

### 3. Auth Lock Timeout Warnings
**Problem**: Supabase auth lock held for >5000ms
**Cause**: Multiple concurrent auth calls, React Strict Mode double renders
**Fix**: 
- Added `isFetchingRoles` flag to prevent concurrent role fetches
- Configured Supabase client with shorter lock timeout (3000ms)
- Added retry interval configuration

### 4. Role Fetch Timeouts
**Problem**: User roles timing out during fetch
**Cause**: Slow Supabase queries or network issues
**Fix**: 
- Already had 5-second timeout, now with better concurrency control
- Defaults to 'student' role on timeout

## Files Modified

1. `frontend/src/components/CourseCommunity.jsx`
   - Enhanced `getAuthToken()` with error handling
   - Added token validation before API calls
   - Added Content-Type headers

2. `frontend/src/pages/CoursePage.jsx`
   - Changed `.single()` to `.maybeSingle()` for enrollment checks
   - Added error handling for enrollment queries

3. `frontend/src/contexts/AuthContext.jsx`
   - Added `isFetchingRoles` flag to prevent concurrent fetches
   - Better error handling in role fetch

4. `frontend/src/lib/supabase.js`
   - Added auth configuration with lock timeout settings
   - Enabled PKCE flow for better security

5. `backend/fix-enrollment-rls.sql` (NEW)
   - SQL script to fix RLS policies
   - Adds service role bypass for backend queries

## How to Apply Fixes

### Step 1: Restart Development Servers
The code fixes have already been applied. Just restart your servers:

```bash
# Backend
cd backend
npm start

# Frontend (in new terminal)
cd frontend
npm run dev
```

### Step 2: Clear Browser Cache
- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"
- Or use Ctrl+Shift+Delete to clear all cache

### Step 3: Test
1. Sign in to your account
2. Navigate to a course page
3. Check the Community tab
4. Verify no 401/406 errors in console
5. Try sending a message

**Note**: You don't need to run the SQL script. The backend uses a service role key which automatically bypasses RLS policies. The fixes were all in the frontend JavaScript code.

## Verification Checklist

- [ ] No 401 errors in console
- [ ] No 406 errors in console
- [ ] No auth lock timeout warnings
- [ ] Role fetch completes successfully
- [ ] Community messages load
- [ ] Can send messages
- [ ] Member count displays
- [ ] Enrollment status shows correctly

## Additional Notes

### Why .maybeSingle() instead of .single()?
- `.single()` throws an error if no rows found or multiple rows found
- `.maybeSingle()` returns null if no rows, handles gracefully
- Better for RLS scenarios where access might be denied

### Why the Lock Configuration?
- Supabase uses locks to prevent race conditions in auth
- React Strict Mode can cause double renders
- Shorter timeout prevents hanging
- Retry interval helps recover from transient issues

### Service Role vs Anon Key
- Frontend uses anon key (limited by RLS)
- Backend uses service role key (bypasses RLS)
- This is why backend queries work but frontend direct queries might fail

## Troubleshooting

### Still Getting 401 Errors?
1. Check if user is actually logged in: `console.log(user)` in component
2. Verify token exists: Check Network tab > Request Headers > Authorization
3. Check token expiry: Tokens expire after 1 hour by default
4. Try signing out and back in

### Still Getting 406 Errors?
1. Verify RLS policies are correct in Supabase Dashboard
2. Check if using `.maybeSingle()` instead of `.single()`
3. Ensure user has proper permissions
4. Check Supabase logs for detailed error

### Lock Timeout Still Happening?
1. Check if React Strict Mode is enabled (it's normal in dev)
2. Verify only one auth call happening at a time
3. Consider disabling Strict Mode temporarily for testing
4. Check for memory leaks or unmounted component issues

## Prevention

To prevent these issues in the future:

1. Always use `.maybeSingle()` for queries that might return 0 or 1 row
2. Always check for null tokens before making authenticated requests
3. Add proper error handling to all Supabase queries
4. Use backend API routes for complex queries instead of direct Supabase calls
5. Test with React Strict Mode enabled to catch concurrency issues
6. Monitor Supabase logs regularly
