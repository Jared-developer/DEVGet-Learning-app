-- Add image_url column to admissions table
ALTER TABLE admissions 
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN admissions.image_url IS 'URL to the admission banner/cover image';
