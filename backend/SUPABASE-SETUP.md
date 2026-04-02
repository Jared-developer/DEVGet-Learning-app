# Supabase Setup Guide

## Step 1: Run the SQL Schema

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to the SQL Editor
3. Copy the contents of `backend/supabase-schema.sql`
4. Paste and run the SQL to create all tables, indexes, and policies

## Step 2: Update Environment Variables

Update your `backend/.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://eejybruttqzflzhjrgvj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find these:**
- `SUPABASE_URL`: Project Settings → API → Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Project Settings → API → service_role key (keep this secret!)
- `SUPABASE_ANON_KEY`: Project Settings → API → anon public key

## Step 3: Install Supabase Package

```bash
cd backend
npm install @supabase/supabase-js
```

## Step 4: Database Schema Overview

### Tables Created:

1. **courses** - Stores all course information
   - id, title, description, category, difficulty, duration
   - instructor, thumbnail, price, is_free
   - lessons (JSONB array)
   - timestamps

2. **enrollments** - Tracks user course enrollments
   - Links users to courses
   - Tracks enrollment date and status

3. **progress** - Tracks lesson completion
   - Per-user, per-course, per-lesson tracking
   - Completion status and notes

### Row Level Security (RLS)

All tables have RLS enabled:
- **Courses**: Public read access, authenticated write
- **Enrollments**: Users can only access their own
- **Progress**: Users can only access their own

## Step 5: Seed Sample Data (Optional)

You can use the Supabase dashboard or create a seed script to add initial courses.

## Step 6: Test the Connection

Run the backend server:
```bash
npm run dev
```

The server should connect to Supabase successfully.

## Migration from MongoDB

If you have existing MongoDB data:
1. Export your MongoDB collections
2. Transform the data to match the new schema
3. Import into Supabase using the dashboard or API

## Benefits of Supabase

- Built-in authentication (already integrated in frontend)
- Real-time subscriptions
- Row Level Security
- Auto-generated REST API
- PostgreSQL power and reliability
- No need to manage database servers
