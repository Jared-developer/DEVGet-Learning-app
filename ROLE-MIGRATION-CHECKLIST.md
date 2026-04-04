# Role-Based Access Control - Migration Checklist

Use this checklist to ensure a smooth migration to the role-based access control system.

## Pre-Migration Checklist

- [ ] Backup your Supabase database
- [ ] Review current user list and their intended roles
- [ ] Test in development environment first
- [ ] Notify users of upcoming changes (if applicable)
- [ ] Schedule maintenance window (if needed)

## Migration Steps

### 1. Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Run `backend/supabase-user-roles-schema.sql`
- [ ] Verify table creation in Supabase Table Editor
- [ ] Check that `user_roles` table exists
- [ ] Verify RLS policies are enabled

### 2. Backend Setup
- [ ] Pull latest code changes
- [ ] Install dependencies: `cd backend && npm install`
- [ ] Verify `.env` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Run setup verification: `npm run setup:roles`
- [ ] Verify no errors in setup output

### 3. Migrate Existing Users
- [ ] Run migration script: `npm run migrate:users`
- [ ] Review migration output
- [ ] Check for users without roles
- [ ] Manually assign roles if needed: `npm run assign:role email@example.com role`

### 4. Frontend Deployment
- [ ] Pull latest frontend code
- [ ] Install dependencies: `cd frontend && npm install`
- [ ] Test build: `npm run build`
- [ ] Verify no build errors

### 5. Backend Deployment
- [ ] Restart backend server: `npm run dev` (or deploy to production)
- [ ] Verify server starts without errors
- [ ] Check `/health` endpoint responds
- [ ] Test `/api/user-roles/me` endpoint

### 6. Testing

#### Test Developer Flow
- [ ] Navigate to `/developer-signup`
- [ ] Create new developer account
- [ ] Verify email confirmation
- [ ] Sign in at `/developer-signin`
- [ ] Verify redirect to `/developer-console`
- [ ] Verify can generate API key
- [ ] Try to access `/dashboard` - should redirect
- [ ] Sign out successfully

#### Test Student Flow
- [ ] Navigate to `/signin` or student registration
- [ ] Create new student account
- [ ] Verify email confirmation
- [ ] Sign in at `/signin`
- [ ] Verify redirect to `/dashboard`
- [ ] Verify can enroll in courses
- [ ] Try to access `/developer-console` - should redirect
- [ ] Sign out successfully

#### Test Existing Users
- [ ] Sign in as existing student
- [ ] Verify access to dashboard
- [ ] Verify cannot access developer console
- [ ] Sign in as existing developer (if any)
- [ ] Verify access to developer console
- [ ] Verify cannot access student dashboard

### 7. Admin Setup (Optional)
- [ ] Identify admin users
- [ ] Assign admin role: `npm run assign:role admin@example.com admin`
- [ ] Test admin can access all areas
- [ ] Verify admin can assign roles via API

### 8. Instructor Setup (Optional)
- [ ] Identify instructor users
- [ ] Assign instructor role: `npm run assign:role instructor@example.com instructor`
- [ ] Test instructor access
- [ ] Verify instructor dashboard works

## Post-Migration Verification

### Database Checks
- [ ] All users have at least one role
- [ ] No duplicate role assignments
- [ ] RLS policies are working
- [ ] Query performance is acceptable

### API Checks
- [ ] `/api/user-roles/me` returns correct roles
- [ ] Role assignment API works (admin only)
- [ ] Role removal API works (admin only)
- [ ] Unauthorized access is blocked

### Frontend Checks
- [ ] Role-based redirects work correctly
- [ ] No console errors
- [ ] Loading states display properly
- [ ] Sign-up flows assign correct roles
- [ ] Sign-out clears role state

### User Experience Checks
- [ ] Developers see only developer features
- [ ] Students see only student features
- [ ] No broken links or 404 errors
- [ ] Error messages are user-friendly
- [ ] Navigation is intuitive

## Rollback Plan (If Needed)

If issues occur, follow these steps:

1. **Immediate Rollback**
   - [ ] Revert to previous code version
   - [ ] Restart servers
   - [ ] Notify users

2. **Database Rollback**
   - [ ] Drop `user_roles` table (if needed)
   ```sql
   DROP TABLE IF EXISTS user_roles CASCADE;
   ```
   - [ ] Remove helper functions
   ```sql
   DROP FUNCTION IF EXISTS has_role(UUID, TEXT);
   DROP FUNCTION IF EXISTS get_user_roles(UUID);
   ```

3. **Code Rollback**
   - [ ] Git revert to previous commit
   - [ ] Redeploy previous version
   - [ ] Test basic functionality

## Common Issues & Solutions

### Issue: Users can't sign in
**Solution**: 
- Check Supabase auth is working
- Verify email confirmation is enabled
- Check for errors in browser console

### Issue: Users see "no roles" error
**Solution**:
- Run migration script: `npm run migrate:users`
- Manually assign roles: `npm run assign:role email role`

### Issue: Redirects not working
**Solution**:
- Clear browser cache
- Check `RoleProtectedRoute` is imported correctly
- Verify `userRoles` state is populated

### Issue: API endpoints return 401
**Solution**:
- Check authorization header is sent
- Verify token is valid
- Check Supabase service role key

## Success Criteria

✅ All existing users have appropriate roles
✅ New sign-ups automatically get correct roles
✅ Developers cannot access student dashboard
✅ Students cannot access developer console
✅ No authentication errors
✅ All tests pass
✅ User experience is smooth
✅ Performance is acceptable

## Documentation Updates

- [ ] Update main README with role system info
- [ ] Add role system to onboarding docs
- [ ] Update API documentation
- [ ] Create user guide for role management
- [ ] Document admin procedures

## Team Communication

- [ ] Notify team of migration completion
- [ ] Share documentation links
- [ ] Schedule training session (if needed)
- [ ] Set up support channel for questions
- [ ] Document lessons learned

## Monitoring

After migration, monitor:
- [ ] Error rates in logs
- [ ] User sign-up success rates
- [ ] Authentication failures
- [ ] Role assignment errors
- [ ] User feedback and support tickets

## Timeline

Estimated time for each phase:
- Database setup: 5 minutes
- Backend setup: 10 minutes
- User migration: 5-15 minutes (depends on user count)
- Testing: 30 minutes
- Deployment: 15 minutes
- Verification: 30 minutes

**Total estimated time: 1.5 - 2 hours**

## Sign-Off

- [ ] Database migration completed by: _________________ Date: _______
- [ ] Backend deployment completed by: _________________ Date: _______
- [ ] Frontend deployment completed by: _________________ Date: _______
- [ ] Testing completed by: _________________ Date: _______
- [ ] Production verification by: _________________ Date: _______

---

**Migration Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Notes**:
_Add any migration-specific notes or issues here_
