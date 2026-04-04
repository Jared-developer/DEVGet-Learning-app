# Backend Scripts

This directory contains utility scripts for managing the DEVGet Learning platform.

## Role Management Scripts

### setup-user-roles.js
Verifies that the user roles system is properly configured.

**Usage:**
```bash
npm run setup:roles
# or
node scripts/setup-user-roles.js
```

**What it does:**
- Checks if `user_roles` table exists
- Verifies table is accessible
- Displays available roles

**When to use:**
- After running the database schema
- To verify role system is working
- During troubleshooting

---

### test-role-system.js
Comprehensive test suite for the role-based access control system.

**Usage:**
```bash
npm run test:roles
# or
node scripts/test-role-system.js
```

**What it does:**
- Checks database table and schema
- Verifies helper functions
- Tests RLS policies
- Analyzes role distribution
- Finds users without roles
- Detects duplicate assignments
- Validates environment variables

**When to use:**
- After initial setup
- Before deployment
- During troubleshooting
- Regular health checks

---

### migrate-existing-users.js
Migrates existing users to the role-based system by assigning appropriate roles.

**Usage:**
```bash
npm run migrate:users
# or
node scripts/migrate-existing-users.js
```

**What it does:**
- Assigns `student` role to users with enrollments
- Assigns `developer` role to users with API keys
- Lists users without any roles
- Handles duplicate role assignments gracefully

**When to use:**
- After initial role system setup
- When migrating from non-role system
- To fix users without roles

---

### assign-role.js
CLI tool to manually assign a role to a specific user.

**Usage:**
```bash
npm run assign:role <email> <role>
# or
node scripts/assign-role.js <email> <role>
```

**Examples:**
```bash
# Assign student role
npm run assign:role user@example.com student

# Assign developer role
npm run assign:role dev@example.com developer

# Assign admin role
npm run assign:role admin@example.com admin

# Assign instructor role
npm run assign:role teacher@example.com instructor
```

**Available roles:**
- `student` - Access to learning dashboard and courses
- `developer` - Access to developer console and API keys
- `instructor` - Access to instructor features
- `admin` - Full system access

**What it does:**
- Finds user by email
- Checks existing roles
- Assigns new role if not already present
- Displays updated role list

**When to use:**
- To manually assign roles to specific users
- To grant admin access
- To add instructor permissions
- During user onboarding

---

## Other Scripts

### test-supabase.js
Tests the Supabase connection and basic operations.

**Usage:**
```bash
node scripts/test-supabase.js
```

**What it does:**
- Tests database connection
- Verifies table access
- Checks authentication

---

### setup-instructors.js
Sets up the instructors table and initial data.

**Usage:**
```bash
node scripts/setup-instructors.js
```

---

### setup-api-keys.js
Sets up the API keys table for developer access.

**Usage:**
```bash
node scripts/setup-api-keys.js
```

---

### setup-assignments.js
Sets up the assignments table and structure.

**Usage:**
```bash
node scripts/setup-assignments.js
```

---

### setup-community.js
Sets up the community features table.

**Usage:**
```bash
node scripts/setup-community.js
```

---

### set-admin-role.js
Legacy script for setting admin roles (use assign-role.js instead).

---

### add-mern-to-supabase.js
Adds MERN stack course data to Supabase.

**Usage:**
```bash
node scripts/add-mern-to-supabase.js
```

---

### add-agentic-ai-to-supabase.js
Adds Agentic AI course data to Supabase.

**Usage:**
```bash
node scripts/add-agentic-ai-to-supabase.js
```

---

### test-ai-assistant.js
Tests the AI assistant integration.

**Usage:**
```bash
node scripts/test-ai-assistant.js
```

---

## Common Workflows

### Initial Setup
```bash
# 1. Setup role system
npm run setup:roles

# 2. Migrate existing users
npm run migrate:users

# 3. Assign admin role to yourself
npm run assign:role your@email.com admin
```

### Adding a New User
```bash
# User signs up through the UI, then assign additional roles if needed
npm run assign:role user@email.com instructor
```

### Troubleshooting
```bash
# Verify role system
npm run setup:roles

# Check and fix user roles
npm run migrate:users

# Manually fix specific user
npm run assign:role user@email.com student
```

---

## Environment Variables Required

All scripts require these environment variables in `backend/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Error Handling

### "Table does not exist"
- Run the appropriate SQL schema file in Supabase
- Check Supabase dashboard for table creation

### "User not found"
- Verify email address is correct
- Check user exists in Supabase Auth

### "Permission denied"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check RLS policies in Supabase

---

## Best Practices

1. **Always backup** before running migration scripts
2. **Test in development** before running in production
3. **Verify results** after running scripts
4. **Use npm scripts** instead of direct node commands
5. **Check logs** for any errors or warnings

---

## Script Development

When creating new scripts:

1. Use ES6 module syntax (`import`/`export`)
2. Load environment variables with `dotenv`
3. Use `supabaseAdmin` for privileged operations
4. Include error handling
5. Provide clear console output
6. Add to `package.json` scripts if frequently used

**Example template:**
```javascript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function myScript() {
    try {
        console.log('Starting...')
        // Your code here
        console.log('✅ Complete!')
    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

myScript()
```

---

## Need Help?

- Check the main documentation in the root directory
- Review `USER-ROLES-SETUP.md` for role system details
- Check Supabase logs for database errors
- Verify environment variables are set correctly
