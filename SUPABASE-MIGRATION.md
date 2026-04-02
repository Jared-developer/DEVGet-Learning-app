# Migration from MongoDB to Supabase

This guide will help you migrate your DEVGet Learning Platform from MongoDB to Supabase.

## Why Supabase?

- **Unified Authentication**: Frontend already uses Supabase Auth
- **PostgreSQL Power**: More robust than MongoDB for relational data
- **Built-in Features**: Real-time, storage, edge functions
- **Row Level Security**: Better data protection
- **No Server Management**: Fully managed database

## Migration Steps

### 1. Install Supabase Package

```bash
cd backend
npm install @supabase/supabase-js
```

### 2. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project: `eejybruttqzflzhjrgvj`
3. Navigate to **SQL Editor**
4. Run the schema from `backend/supabase-schema.sql`

### 3. Get Your Credentials

From Supabase Dashboard → Project Settings → API:

- **Project URL**: `https://eejybruttqzflzhjrgvj.supabase.co`
- **anon public key**: Already in `frontend/.env`
- **service_role key**: Needed for backend (keep secret!)

### 4. Update Backend Environment

Create/update `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://eejybruttqzflzhjrgvj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 5. Database Schema

The new Supabase schema includes:

**courses** table:
```sql
- id (UUID, primary key)
- title (text)
- description (text)
- category (text)
- difficulty (text)
- duration (text)
- instructor (text)
- thumbnail (text)
- price (decimal)
- is_free (boolean)
- lessons (jsonb array)
- created_at, updated_at (timestamps)
```

**enrollments** table:
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- course_id (UUID, foreign key to courses)
- enrolled_at (timestamp)
- status (text)
```

**progress** table:
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- course_id (UUID, foreign key to courses)
- lesson_id (text)
- completed (boolean)
- completed_at (timestamp)
- notes (text)
- created_at, updated_at (timestamps)
```

### 6. Backend Code Changes Needed

The backend routes need to be updated to use Supabase instead of MongoDB:

**Before (MongoDB)**:
```javascript
import Course from '../models/Course.js';
const courses = await Course.find();
```

**After (Supabase)**:
```javascript
import { supabase } from '../config/supabase.js';
const { data: courses } = await supabase.from('courses').select('*');
```

### 7. Key Differences

| Feature | MongoDB | Supabase |
|---------|---------|----------|
| Query | `Model.find()` | `supabase.from('table').select()` |
| Insert | `Model.create()` | `supabase.from('table').insert()` |
| Update | `Model.findByIdAndUpdate()` | `supabase.from('table').update().eq('id', id)` |
| Delete | `Model.findByIdAndDelete()` | `supabase.from('table').delete().eq('id', id)` |
| Auth | Custom JWT | Built-in Supabase Auth |

### 8. Benefits You'll Get

✅ **Unified Auth**: Same auth system for frontend and backend
✅ **Real-time**: Subscribe to database changes
✅ **Better Security**: Row Level Security policies
✅ **Type Safety**: Auto-generated TypeScript types
✅ **Scalability**: Managed PostgreSQL
✅ **Cost**: Free tier is generous

### 9. Next Steps

1. Run the SQL schema in Supabase
2. Install `@supabase/supabase-js` in backend
3. Update backend routes to use Supabase client
4. Test authentication flow
5. Migrate existing data (if any)
6. Remove MongoDB dependencies

### 10. Testing

After migration:
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (already configured)
cd frontend
npm run dev
```

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Rollback Plan

If you need to rollback:
1. Keep MongoDB connection string in `.env`
2. Don't delete MongoDB models yet
3. Test Supabase thoroughly before removing MongoDB code
