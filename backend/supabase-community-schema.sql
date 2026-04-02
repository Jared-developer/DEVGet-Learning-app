-- Community Messages Schema
-- Run this to add community chat functionality

-- Community messages table
CREATE TABLE IF NOT EXISTS community_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_messages_course_id ON community_messages(course_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_user_id ON community_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Policies for community messages
-- Only enrolled students can view messages for their courses
CREATE POLICY "Enrolled students can view course messages" ON community_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = community_messages.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

-- Only enrolled students can post messages
CREATE POLICY "Enrolled students can post messages" ON community_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = community_messages.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

-- Users can update their own messages
CREATE POLICY "Users can update their own messages" ON community_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages" ON community_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_community_messages_updated_at BEFORE UPDATE ON community_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user profile info (name, email) for messages
-- This is a view that joins messages with user metadata
CREATE OR REPLACE VIEW community_messages_with_users AS
SELECT 
    cm.id,
    cm.course_id,
    cm.user_id,
    cm.message,
    cm.created_at,
    cm.updated_at,
    cm.is_edited,
    cm.is_deleted,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name
FROM community_messages cm
JOIN auth.users u ON cm.user_id = u.id
WHERE cm.is_deleted = false
ORDER BY cm.created_at DESC;
