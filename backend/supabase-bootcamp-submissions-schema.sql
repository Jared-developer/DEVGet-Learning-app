-- Bootcamp submissions table for AI Governance & Digital Safety Bootcamp
CREATE TABLE IF NOT EXISTS bootcamp_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    week_number INTEGER NOT NULL,
    assignment_title VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    submission_type VARCHAR(50) NOT NULL CHECK (submission_type IN ('individual', 'group')),
    github_url TEXT NOT NULL,
    additional_notes TEXT,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'rejected')),
    score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_number, assignment_title)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bootcamp_submissions_user_id ON bootcamp_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bootcamp_submissions_week ON bootcamp_submissions(week_number);
CREATE INDEX IF NOT EXISTS idx_bootcamp_submissions_status ON bootcamp_submissions(status);
CREATE INDEX IF NOT EXISTS idx_bootcamp_submissions_email ON bootcamp_submissions(email);

-- Enable Row Level Security
ALTER TABLE bootcamp_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for bootcamp_submissions
CREATE POLICY "Users can view their own bootcamp submissions" ON bootcamp_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bootcamp submissions" ON bootcamp_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bootcamp submissions" ON bootcamp_submissions
    FOR UPDATE USING (auth.uid() = user_id AND status = 'submitted');

-- Admins can view and manage all bootcamp submissions
CREATE POLICY "Admins can view all bootcamp submissions" ON bootcamp_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'instructor')
        )
    );

CREATE POLICY "Admins can update bootcamp submissions" ON bootcamp_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'instructor')
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_bootcamp_submissions_updated_at BEFORE UPDATE ON bootcamp_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample bootcamp assignment data if not exists
DO $$
BEGIN
    -- Check if we have any bootcamp assignments
    IF NOT EXISTS (SELECT 1 FROM assignments WHERE title LIKE '%AI Governance%') THEN
        -- Insert bootcamp assignments for AI/ML course
        INSERT INTO assignments (course_id, week_number, title, description, points, due_date) VALUES
        (
            (SELECT id FROM courses WHERE title LIKE '%AI%' OR title LIKE '%Machine Learning%' LIMIT 1),
            1,
            'AI Governance & Digital Safety - Week 1 Assignment',
            'Complete the Python fundamentals and AI concepts assignment for the AI Governance & Digital Safety Bootcamp.',
            50,
            NOW() + INTERVAL '7 days'
        ),
        (
            (SELECT id FROM courses WHERE title LIKE '%AI%' OR title LIKE '%Machine Learning%' LIMIT 1),
            3,
            'AI Governance & Digital Safety - Week 3 Assignment', 
            'Complete the data preprocessing and exploratory data analysis assignment for the AI Governance & Digital Safety Bootcamp.',
            70,
            NOW() + INTERVAL '21 days'
        ),
        (
            (SELECT id FROM courses WHERE title LIKE '%AI%' OR title LIKE '%Machine Learning%' LIMIT 1),
            5,
            'AI Governance & Digital Safety - Week 5 Assignment',
            'Complete the classification and ethics assignment for the AI Governance & Digital Safety Bootcamp.',
            70,
            NOW() + INTERVAL '35 days'
        ),
        (
            (SELECT id FROM courses WHERE title LIKE '%AI%' OR title LIKE '%Machine Learning%' LIMIT 1),
            14,
            'AI Governance & Digital Safety - Week 14 Assignment',
            'Complete the responsible AI capstone assignment for the AI Governance & Digital Safety Bootcamp.',
            100,
            NOW() + INTERVAL '98 days'
        );
    END IF;
END $$;