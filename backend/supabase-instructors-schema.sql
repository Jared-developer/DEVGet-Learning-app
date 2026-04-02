-- Instructors Schema
-- This schema manages instructor assignments and their permissions

-- Course instructors table (maps instructors to courses)
CREATE TABLE IF NOT EXISTS course_instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, course_id)
);

-- Course resources table (recordings, presentations, materials)
CREATE TABLE IF NOT EXISTS course_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('recording', 'presentation', 'document', 'link', 'other')),
    resource_url TEXT NOT NULL,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id),
    lesson_id TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class sessions table (live classes, recordings)
CREATE TABLE IF NOT EXISTS class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    meeting_link TEXT,
    recording_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update announcements to support course-specific announcements
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'course', 'students'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_instructors_user ON course_instructors(user_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_course ON course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_course ON class_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_date ON class_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_announcements_course ON announcements(course_id);

-- Enable RLS
ALTER TABLE course_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for course_instructors
CREATE POLICY "Anyone can view course instructors"
    ON course_instructors
    FOR SELECT
    USING (true);

CREATE POLICY "Only admins can assign instructors"
    ON course_instructors
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Only admins can update instructor assignments"
    ON course_instructors
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Only admins can remove instructors"
    ON course_instructors
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policies for course_resources
CREATE POLICY "Enrolled students can view public course resources"
    ON course_resources
    FOR SELECT
    USING (
        is_public = true AND (
            EXISTS (
                SELECT 1 FROM enrollments
                WHERE enrollments.user_id = auth.uid()
                AND enrollments.course_id = course_resources.course_id
            )
            OR EXISTS (
                SELECT 1 FROM course_instructors
                WHERE course_instructors.user_id = auth.uid()
                AND course_instructors.course_id = course_resources.course_id
                AND course_instructors.is_active = true
            )
            OR EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

CREATE POLICY "Instructors and admins can upload resources"
    ON course_resources
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = course_resources.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Instructors and admins can update their resources"
    ON course_resources
    FOR UPDATE
    USING (
        uploaded_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = course_resources.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Instructors and admins can delete resources"
    ON course_resources
    FOR DELETE
    USING (
        uploaded_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = course_resources.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policies for class_sessions
CREATE POLICY "Enrolled students can view class sessions"
    ON class_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE enrollments.user_id = auth.uid()
            AND enrollments.course_id = class_sessions.course_id
        )
        OR EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = class_sessions.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Instructors and admins can create class sessions"
    ON class_sessions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = class_sessions.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Instructors and admins can update class sessions"
    ON class_sessions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = class_sessions.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Instructors and admins can delete class sessions"
    ON class_sessions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM course_instructors
            WHERE course_instructors.user_id = auth.uid()
            AND course_instructors.course_id = class_sessions.course_id
            AND course_instructors.is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Update announcement policies to allow instructors
DROP POLICY IF EXISTS "Only admins can create announcements" ON announcements;
DROP POLICY IF EXISTS "Only admins can update announcements" ON announcements;
DROP POLICY IF EXISTS "Only admins can delete announcements" ON announcements;

CREATE POLICY "Admins and instructors can create announcements"
    ON announcements
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
        OR (
            course_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM course_instructors
                WHERE course_instructors.user_id = auth.uid()
                AND course_instructors.course_id = announcements.course_id
                AND course_instructors.is_active = true
            )
        )
    );

CREATE POLICY "Admins and instructors can update announcements"
    ON announcements
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
        OR (
            course_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM course_instructors
                WHERE course_instructors.user_id = auth.uid()
                AND course_instructors.course_id = announcements.course_id
                AND course_instructors.is_active = true
            )
        )
    );

CREATE POLICY "Admins and instructors can delete announcements"
    ON announcements
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
        OR (
            course_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM course_instructors
                WHERE course_instructors.user_id = auth.uid()
                AND course_instructors.course_id = announcements.course_id
                AND course_instructors.is_active = true
            )
        )
    );

-- Triggers for updated_at
CREATE TRIGGER update_course_resources_updated_at BEFORE UPDATE ON course_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_sessions_updated_at BEFORE UPDATE ON class_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to check if user is instructor for a course
CREATE OR REPLACE FUNCTION is_course_instructor(p_user_id UUID, p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM course_instructors
        WHERE user_id = p_user_id
        AND course_id = p_course_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get instructor's courses
CREATE OR REPLACE FUNCTION get_instructor_courses(p_user_id UUID)
RETURNS TABLE (
    course_id UUID,
    course_title TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.title, ci.assigned_at
    FROM courses c
    INNER JOIN course_instructors ci ON c.id = ci.course_id
    WHERE ci.user_id = p_user_id AND ci.is_active = true
    ORDER BY ci.assigned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
