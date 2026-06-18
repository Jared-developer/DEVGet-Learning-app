# Progress Tracking Setup Instructions

## Manual Setup Required

Since the automatic script isn't working with your Supabase setup, please follow these manual steps:

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Progress Tracking SQL

Copy and paste the following SQL into the SQL Editor and click "Run":

```sql
-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL,
    lesson_id VARCHAR NOT NULL,
    lesson_title VARCHAR NOT NULL,
    lesson_type VARCHAR DEFAULT 'video',
    status VARCHAR DEFAULT 'not_started',
    completion_date TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0,
    quiz_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- Create course_progress table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL,
    total_lessons INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_completion DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lesson_progress
CREATE POLICY "Users can view their own lesson progress" 
ON lesson_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" 
ON lesson_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
ON lesson_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for course_progress
CREATE POLICY "Users can view their own course progress" 
ON course_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress" 
ON course_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" 
ON course_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update course progress automatically
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO course_progress (user_id, course_id, total_lessons, completed_lessons, progress_percentage, last_accessed)
    SELECT 
        NEW.user_id,
        NEW.course_id,
        COUNT(*) as total_lessons,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_lessons,
        ROUND((COUNT(*) FILTER (WHERE status = 'completed')::float / COUNT(*)::float) * 100) as progress_percentage,
        NOW()
    FROM lesson_progress 
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id
    GROUP BY user_id, course_id
    ON CONFLICT (user_id, course_id) 
    DO UPDATE SET
        total_lessons = EXCLUDED.total_lessons,
        completed_lessons = EXCLUDED.completed_lessons,
        progress_percentage = EXCLUDED.progress_percentage,
        last_accessed = EXCLUDED.last_accessed,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update course progress
DROP TRIGGER IF EXISTS update_course_progress_trigger ON lesson_progress;
CREATE TRIGGER update_course_progress_trigger
    AFTER INSERT OR UPDATE ON lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_course_progress();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_last_accessed ON course_progress(last_accessed);
```

### Step 3: Verify Setup
After running the SQL, you should see the following tables in your database:
- `lesson_progress`
- `course_progress`

### Step 4: Test the Frontend
Once the tables are created, the progress tracking will work automatically when users:
1. Open lessons (marked as "in progress")
2. Complete videos (click "Mark Complete")
3. Pass quizzes (score 70% or higher)

### Features Now Available:
- ✅ Real-time progress tracking
- ✅ Course completion percentages
- ✅ Progress bars on dashboard
- ✅ Lesson completion indicators
- ✅ Quiz score tracking
- ✅ Progress tab in courses

### Troubleshooting:
If you get permission errors, make sure:
1. You're using the service role key (not anon key)
2. Row Level Security policies are applied correctly
3. The user is authenticated when accessing progress data

The progress tracking system is now fully functional!