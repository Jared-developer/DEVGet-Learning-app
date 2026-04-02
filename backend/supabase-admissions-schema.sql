-- Admissions Table Schema for Supabase
-- This table stores admission application documents

-- Create admissions table
CREATE TABLE IF NOT EXISTS admissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    deadline TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admissions_active ON admissions(is_active);
CREATE INDEX IF NOT EXISTS idx_admissions_deadline ON admissions(deadline);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active admissions
CREATE POLICY "Anyone can view active admissions"
    ON admissions
    FOR SELECT
    USING (is_active = true);

-- Policy: Authenticated users can view all admissions
CREATE POLICY "Authenticated users can view all admissions"
    ON admissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only admins can insert admissions
CREATE POLICY "Admins can insert admissions"
    ON admissions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Only admins can update admissions
CREATE POLICY "Admins can update admissions"
    ON admissions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Only admins can delete admissions
CREATE POLICY "Admins can delete admissions"
    ON admissions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create storage bucket for admission files
INSERT INTO storage.buckets (id, name, public)
VALUES ('admissions', 'admissions', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for admissions bucket
CREATE POLICY "Anyone can view admission files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'admissions');

CREATE POLICY "Admins can upload admission files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'admissions' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update admission files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'admissions' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can delete admission files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'admissions' AND
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_admissions_timestamp
    BEFORE UPDATE ON admissions
    FOR EACH ROW
    EXECUTE FUNCTION update_admissions_updated_at();

-- Comments
COMMENT ON TABLE admissions IS 'Stores admission application documents and information';
COMMENT ON COLUMN admissions.title IS 'Title of the admission application';
COMMENT ON COLUMN admissions.description IS 'Description of the admission requirements';
COMMENT ON COLUMN admissions.file_url IS 'URL to the admission document file';
COMMENT ON COLUMN admissions.deadline IS 'Application deadline';
COMMENT ON COLUMN admissions.is_active IS 'Whether the admission is currently open';
