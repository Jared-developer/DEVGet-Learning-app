-- Create certificate_signatures table
CREATE TABLE IF NOT EXISTS certificate_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    certificate_id VARCHAR(255) NOT NULL,
    slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 3),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(certificate_id, slot_number)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificate_signatures_cert_id 
ON certificate_signatures(certificate_id);

-- Enable RLS (Row Level Security)
ALTER TABLE certificate_signatures ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading signatures
CREATE POLICY "Allow public read access to signatures"
ON certificate_signatures
FOR SELECT
USING (true);

-- Create policy to allow inserting/updating unconfirmed signatures
CREATE POLICY "Allow insert/update unconfirmed signatures"
ON certificate_signatures
FOR ALL
USING (confirmed = false OR confirmed IS NULL);
