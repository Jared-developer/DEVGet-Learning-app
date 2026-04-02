-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'urgent', 'success', 'general')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read active announcements
CREATE POLICY "Anyone can view active announcements"
    ON announcements
    FOR SELECT
    USING (auth.role() = 'authenticated' AND is_active = true);

-- Policy: Only admins can insert announcements
CREATE POLICY "Only admins can create announcements"
    ON announcements
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Only admins can update announcements
CREATE POLICY "Only admins can update announcements"
    ON announcements
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Only admins can delete announcements
CREATE POLICY "Only admins can delete announcements"
    ON announcements
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Insert sample announcements
INSERT INTO announcements (title, content, type, is_active) VALUES
('Welcome to Devgate Learning Portal!', 'We are excited to have you here. Start your learning journey today by enrolling in our courses.', 'success', true),
('New Course Available: Agentic AI Development', 'Check out our latest advanced course on building autonomous AI agents and systems. Enroll now!', 'info', true),
('Platform Maintenance Scheduled', 'We will be performing scheduled maintenance on Saturday, 12 AM - 4 AM EST. The platform may be temporarily unavailable.', 'urgent', true);
