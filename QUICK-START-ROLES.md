# Quick Start: Role-Based Access Control

This is a quick 5-minute setup guide to enable role-based access control that separates developer and student access.

## ⚡ Quick Setup (5 minutes)

### Step 1: Run Database Schema (2 min)
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `backend/supabase-user-roles-schema.sql`
4. Click "Run" to execute

### Step 2: Verify Setup (1 min)
```bash
cd backend
npm run setup:roles
```

You should see:
```
✅ User roles table exists and is accessible
```

### Step 3: Migrate Existing Users (1 min) - Optional
If you have existing users, run:
```bash
npm run migrate:users
```

### Step 4: Restart Backend (1 min)
```bash
npm run dev
```

## ✅ That's It!

Your system now has role-based access control enabled.

## 🧪 Test It

### Test 1: Developer Access
1. Go to `http://localhost:5173/developer-signup`
2. Create a developer account
3. Verify email and sign in
4. You should land on `/developer-console`
5. Try navigating to `/dashboard` - you'll be redirected back

### Test 2: Student Access
1. Go to `http://localhost:5173/signin`
2. Create a student account (or use student registration)
3. Verify email and sign in
4. You should land on `/dashboard`
5. Try navigating to `/developer-console` - you'll be redirected back

## 🔧 Common Commands

```bash
# Verify role system is working
npm run setup:roles

# Migrate existing users to role system
npm run migrate:users

# Manually assign a role to a user
npm run assign:role user@example.com student

# Available roles: student, developer, instructor, admin
```

## 📚 Need More Details?

- Full setup guide: `USER-ROLES-SETUP.md`
- Implementation details: `ROLE-BASED-ACCESS-IMPLEMENTATION.md`
- Visual diagrams: `ROLE-ACCESS-DIAGRAM.md`

## 🐛 Troubleshooting

### "Table user_roles does not exist"
→ Run Step 1 again (database schema)

### Users can access both portals
→ Clear browser cache and re-login
→ Verify roles are assigned: `npm run migrate:users`

### Existing users have no access
→ Run: `npm run migrate:users`
→ Or manually assign: `npm run assign:role user@email.com student`

## 🎯 What This Does

✅ Developers can only access developer console
✅ Students can only access student dashboard
✅ Automatic role assignment during sign-up
✅ Secure role checking at database, backend, and frontend levels
✅ Easy role management with CLI tools

## 🚀 Next Steps

1. Test both developer and student sign-ups
2. Verify access restrictions work
3. Assign admin role to yourself if needed:
   ```bash
   npm run assign:role your@email.com admin
   ```
4. Review full documentation for advanced features

---

**Need help?** Check the detailed guides in the documentation files.
