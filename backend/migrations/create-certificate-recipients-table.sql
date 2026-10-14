-- Create certificate_recipients table for tracking issued certificates
CREATE TABLE IF NOT EXISTS certificate_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bootcamp_id VARCHAR(255) NOT NULL, -- e.g., 'ai-governance-bootcamp-1.0'
    certificate_id VARCHAR(255) NOT NULL UNIQUE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, bootcamp_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificate_recipients_user_id 
ON certificate_recipients(user_id);

CREATE INDEX IF NOT EXISTS idx_certificate_recipients_email 
ON certificate_recipients(recipient_email);

CREATE INDEX IF NOT EXISTS idx_certificate_recipients_bootcamp 
ON certificate_recipients(bootcamp_id);

CREATE INDEX IF NOT EXISTS idx_certificate_recipients_cert_id 
ON certificate_recipients(certificate_id);

-- Enable RLS (Row Level Security)
ALTER TABLE certificate_recipients ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own certificates
CREATE POLICY "Users can view their own certificates"
ON certificate_recipients
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role can insert certificates (for admin script)
CREATE POLICY "Service role can insert certificates"
ON certificate_recipients
FOR INSERT
WITH CHECK (true);

-- Policy: Service role can update certificates
CREATE POLICY "Service role can update certificates"
ON certificate_recipients
FOR UPDATE
USING (true);
