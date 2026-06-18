-- Add progress tracking tables

-- Table to track individual lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id VARCHAR NOT NULL, -- Format: "module_id-lesson_id" (e.g., "1-1", "2-3")
    lesson_title VARCHAR NOT NULL,
    lesson_type VARCHAR DEFAULT 'video', -- video, quiz, assignment, project
    status VARCHAR DEFAULT 'not_started', -- not_started, in_progress, completed
    completion_date TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- in seconds
    quiz_score INTEGER, -- percentage for quizzes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- Table to track overall course progress
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    total_lessons INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_completion DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Add RLS policies for lesson_progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress" 
ON lesson_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" 
ON lesson_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
ON lesson_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view lesson progress for their courses"
ON lesson_progress FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM course_instructors ci
        JOIN courses c ON c.id = ci.course_id
        WHERE c.id = lesson_progress.course_id 
        AND ci.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'admin'
    )
);

-- Add RLS policies for course_progress
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own course progress" 
ON course_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress" 
ON course_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" 
ON course_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view course progress for their courses"
ON course_progress FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM course_instructors ci
        JOIN courses c ON c.id = ci.course_id
        WHERE c.id = course_progress.course_id 
        AND ci.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'admin'
    )
);

-- Function to update course progress when lesson progress changes
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update course progress summary
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
CREATE TRIGGER update_course_progress_trigger
    AFTER INSERT OR UPDATE ON lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_course_progress();

-- Add indexes for performance
CREATE INDEX idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX idx_course_progress_user ON course_progress(user_id);
CREATE INDEX idx_course_progress_last_accessed ON course_progress(last_accessed);