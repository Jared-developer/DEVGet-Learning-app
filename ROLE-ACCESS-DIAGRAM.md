# Role-Based Access Control - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Registration                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────┬──────────────┐
                              ▼                 ▼              ▼
                    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                    │   Student    │  │  Developer   │  │  Instructor  │
                    │   Sign Up    │  │   Sign Up    │  │   (Admin)    │
                    └──────────────┘  └──────────────┘  └──────────────┘
                              │                 │              │
                              ▼                 ▼              ▼
                    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                    │ Assigned:    │  │ Assigned:    │  │ Assigned:    │
                    │ 'student'    │  │ 'developer'  │  │ 'instructor' │
                    │ role         │  │ role         │  │ role         │
                    └──────────────┘  └──────────────┘  └──────────────┘
```

## Access Matrix

```
┌──────────────┬─────────────┬──────────────────┬─────────────┬─────────┐
│ Role         │ Dashboard   │ Developer        │ Courses     │ Admin   │
│              │ /dashboard  │ Console          │ /course/:id │ Panel   │
├──────────────┼─────────────┼──────────────────┼─────────────┼─────────┤
│ Student      │     ✅      │       ❌         │     ✅      │   ❌    │
├──────────────┼─────────────┼──────────────────┼─────────────┼─────────┤
│ Developer    │     ❌      │       ✅         │     ❌      │   ❌    │
├──────────────┼─────────────┼──────────────────┼─────────────┼─────────┤
│ Instructor   │     ✅      │       ❌         │     ✅      │   ✅    │
├──────────────┼─────────────┼──────────────────┼─────────────┼─────────┤
│ Admin        │     ✅      │       ✅         │     ✅      │   ✅    │
└──────────────┴─────────────┴──────────────────┴─────────────┴─────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Attempts Access                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Is Authenticated?│
                    └──────────────────┘
                         │         │
                    NO   │         │   YES
                         ▼         ▼
              ┌──────────────┐  ┌──────────────────┐
              │ Redirect to  │  │ Check User Roles │
              │  Sign In     │  └──────────────────┘
              └──────────────┘           │
                                         ▼
                              ┌──────────────────────┐
                              │ Has Required Role?   │
                              └──────────────────────┘
                                    │         │
                               YES  │         │   NO
                                    ▼         ▼
                         ┌──────────────┐  ┌──────────────────┐
                         │ Grant Access │  │ Redirect to      │
                         └──────────────┘  │ Appropriate      │
                                           │ Portal           │
                                           └──────────────────┘
```

## Role Assignment During Sign-Up

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Submits Sign-Up Form                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Create Auth User │
                    │  (Supabase Auth) │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Insert into      │
                    │ user_roles table │
                    │ with role        │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Send Verification│
                    │ Email            │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Verifies    │
                    │ Email            │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Can Sign In │
                    │ with Role Access │
                    └──────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         auth.users                               │
│  (Supabase Auth - Built-in)                                     │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID)                                                        │
│ email                                                            │
│ encrypted_password                                               │
│ email_confirmed_at                                               │
│ user_metadata (JSONB)                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Foreign Key
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         user_roles                               │
│  (Custom Table)                                                  │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID)                                                        │
│ user_id (UUID) → auth.users.id                                  │
│ role (TEXT) CHECK IN ('student', 'developer', 'instructor',     │
│                       'admin')                                   │
│ created_at (TIMESTAMP)                                           │
│ updated_at (TIMESTAMP)                                           │
│ UNIQUE(user_id, role)                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
│
├── AuthProvider (Context)
│   ├── user (state)
│   ├── userRoles (state)
│   ├── hasRole() (function)
│   └── fetchUserRoles() (function)
│
└── Router
    │
    ├── Public Routes
    │   ├── /
    │   ├── /signin
    │   ├── /developer-signin
    │   └── /developer-signup
    │
    └── Protected Routes
        │
        ├── RoleProtectedRoute (requiredRole="student")
        │   ├── /dashboard
        │   └── /course/:id
        │
        ├── RoleProtectedRoute (requiredRole="developer")
        │   └── /developer-console
        │
        └── RoleProtectedRoute (requiredRole="instructor")
            └── /instructor/dashboard
```

## Example User Journey

### Developer Journey
```
1. Visit /developer-signup
   ↓
2. Fill form with email/password
   ↓
3. Submit → Creates user with 'developer' role
   ↓
4. Verify email
   ↓
5. Sign in at /developer-signin
   ↓
6. Redirected to /developer-console ✅
   ↓
7. Try to visit /dashboard
   ↓
8. Redirected back to /developer-console ❌
```

### Student Journey
```
1. Visit /signin (or student registration)
   ↓
2. Fill form with email/password
   ↓
3. Submit → Creates user with 'student' role
   ↓
4. Verify email
   ↓
5. Sign in at /signin
   ↓
6. Redirected to /dashboard ✅
   ↓
7. Try to visit /developer-console
   ↓
8. Redirected back to /dashboard ❌
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Layer 1: Frontend                           │
│  RoleProtectedRoute - Prevents navigation, improves UX          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Layer 2: Backend API                        │
│  Route handlers verify user roles before processing             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Layer 3: Database                           │
│  Row Level Security (RLS) policies enforce data access          │
└─────────────────────────────────────────────────────────────────┘
```

## Role Management Commands

```bash
# Setup the role system
node scripts/setup-user-roles.js

# Migrate existing users
node scripts/migrate-existing-users.js

# Assign a role to a user
node scripts/assign-role.js user@example.com student

# Check user roles (via API)
curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/user-roles/me
```

## Quick Reference

### Available Roles
- `student` - Access to learning dashboard and courses
- `developer` - Access to developer console and API keys
- `instructor` - Access to instructor features
- `admin` - Full system access

### Key Files
- Schema: `backend/supabase-user-roles-schema.sql`
- API Routes: `backend/routes/user-roles.js`
- Auth Context: `frontend/src/contexts/AuthContext.jsx`
- Route Protection: `frontend/src/components/RoleProtectedRoute.jsx`
- App Routes: `frontend/src/App.jsx`

### Important Functions
- `hasRole(role)` - Check if user has specific role
- `fetchUserRoles(user)` - Load user's roles from database
- `signUp(email, password, details, role)` - Register with role
