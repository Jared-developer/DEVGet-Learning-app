# User Roles System Setup Guide

This guide explains how to set up and use the role-based access control system that separates developer and student access.

## Overview

The system now enforces role-based access control:
- **Students**: Can only access the student dashboard and courses
- **Developers**: Can only access the developer console and API keys
- **Instructors**: Can access instructor features
- **Admins**: Have full system access

Users who sign up as developers cannot access the student dashboard with the same credentials, and vice versa.

## Setup Steps

### 1. Run the Database Schema

Execute the user roles schema in your Supabase SQL editor:

```bash
# The schema file is located at:
backend/supabase-user-roles-schema.sql
```

This creates:
- `user_roles` table to track user roles
- Helper functions `has_role()` and `get_user_roles()`
- Row Level Security policies

### 2. Verify the Setup

Run the setup script to verify everything is working:

```bash
cd backend
node scripts/setup-user-roles.js
```

### 3. Restart Your Backend Server

```bash
cd backend
npm run dev
```

## How It Works

### Sign Up Process

1. **Student Sign Up** (via `/signin` page):
   - Users are automatically assigned the `student` role
   - Can access `/dashboard` and `/course/:id`
   - Cannot access `/developer-console`

2. **Developer Sign Up** (via `/developer-signup` page):
   - Users are automatically assigned the `developer` role
   - Can access `/developer-console`
   - Cannot access `/dashboard` or student features

### Authentication Flow

1. User signs in with email/password
2. System fetches user's roles from `user_roles` table
3. Protected routes check if user has required role
4. If user lacks required role, they're redirected to appropriate portal

### Role Assignment

Roles are automatically assigned during sign-up:
- Student registration → `student` role
- Developer registration → `developer` role

Admins can manually assign additional roles using the API:

```javascript
POST /api/user-roles/assign
{
  "userId": "user-uuid",
  "role": "instructor"
}
```

## API Endpoints

### Get Current User's Roles
```
GET /api/user-roles/me
Authorization: Bearer <token>

Response:
{
  "roles": ["student", "developer"]
}
```

### Assign Role (Admin Only)
```
POST /api/user-roles/assign
Authorization: Bearer <admin-token>
{
  "userId": "user-uuid",
  "role": "instructor"
}
```

### Remove Role (Admin Only)
```
DELETE /api/user-roles/remove
Authorization: Bearer <admin-token>
{
  "userId": "user-uuid",
  "role": "instructor"
}
```

## Frontend Components

### RoleProtectedRoute

Protects routes based on user roles:

```jsx
<Route
  path="/dashboard"
  element={
    <RoleProtectedRoute requiredRole="student" redirectTo="/signin">
      <Dashboard />
    </RoleProtectedRoute>
  }
/>
```

### useAuth Hook

Now includes role checking:

```jsx
const { user, userRoles, hasRole } = useAuth()

// Check if user has a specific role
if (hasRole('developer')) {
  // Show developer features
}
```

## Migration for Existing Users

If you have existing users, you'll need to assign them roles:

1. **For existing students** (users who have enrollments):
```sql
INSERT INTO user_roles (user_id, role)
SELECT DISTINCT user_id, 'student'
FROM enrollments
ON CONFLICT (user_id, role) DO NOTHING;
```

2. **For existing developers** (users who have API keys):
```sql
INSERT INTO user_roles (user_id, role)
SELECT DISTINCT user_id, 'developer'
FROM api_keys
ON CONFLICT (user_id, role) DO NOTHING;
```

## Testing

1. **Test Developer Access**:
   - Sign up at `/developer-signup`
   - Verify you can access `/developer-console`
   - Try to access `/dashboard` - should redirect to `/developer-console`

2. **Test Student Access**:
   - Sign up at `/signin` (or register as student)
   - Verify you can access `/dashboard`
   - Try to access `/developer-console` - should redirect to `/dashboard`

3. **Test Cross-Access Prevention**:
   - Sign in as developer
   - Navigate to `/dashboard` - should be redirected
   - Sign out and sign in as student
   - Navigate to `/developer-console` - should be redirected

## Troubleshooting

### Users can still access both portals

- Verify the `user_roles` table exists in Supabase
- Check that roles are being assigned during sign-up
- Ensure the backend route `/api/user-roles` is working
- Check browser console for any errors

### Role not being assigned during sign-up

- Check Supabase logs for errors
- Verify the `user_roles` table has proper permissions
- Ensure the service role key is set in backend `.env`

### "Table user_roles does not exist" error

- Run the SQL schema in Supabase SQL editor
- Verify the table was created successfully
- Check Supabase table editor

## Security Notes

- Roles are stored in a separate table with RLS enabled
- Users can only view their own roles
- Only admins can assign/remove roles
- Role checks happen on both frontend (UX) and backend (security)
- Always verify roles on the backend for sensitive operations

## Future Enhancements

Potential improvements:
- Multiple roles per user (e.g., student + developer)
- Role hierarchy (admin inherits all permissions)
- Custom permissions per role
- Role-based UI customization
- Audit log for role changes
