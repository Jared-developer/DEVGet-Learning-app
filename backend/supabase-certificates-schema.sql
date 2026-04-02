-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    grade VARCHAR(10), -- A+, A, B+, etc.
    score INTEGER, -- Overall course score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own certificates" ON certificates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert certificates" ON certificates
    FOR INSERT WITH CHECK (true);

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number(
    p_course_id UUID,
    p_user_id UUID
)
RETURNS VARCHAR AS $$
DECLARE
    v_course_code VARCHAR(10);
    v_year VARCHAR(4);
    v_sequence VARCHAR(6);
    v_cert_number VARCHAR(50);
BEGIN
    -- Get course code from course title
    SELECT 
        CASE 
            WHEN title ILIKE '%MERN%' THEN 'MERN'
            WHEN title ILIKE '%AI%' AND title ILIKE '%Machine Learning%' THEN 'AIML'
            WHEN title ILIKE '%Agentic%' THEN 'AGNT'
            WHEN title ILIKE '%HTML%' THEN 'HTML'
            WHEN title ILIKE '%CSS%' THEN 'CSS'
            WHEN title ILIKE '%JavaScript%' THEN 'JS'
            WHEN title ILIKE '%React%' THEN 'REACT'
            WHEN title ILIKE '%Node%' THEN 'NODE'
            WHEN title ILIKE '%MongoDB%' THEN 'MONGO'
            WHEN title ILIKE '%Python%' THEN 'PY'
            WHEN title ILIKE '%Data Science%' THEN 'DS'
            ELSE 'GEN'
        END INTO v_course_code
    FROM courses
    WHERE id = p_course_id;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Get sequence number (count of certificates for this course)
    SELECT LPAD((COUNT(*) + 1)::TEXT, 6, '0') INTO v_sequence
    FROM certificates
    WHERE course_id = p_course_id;
    
    -- Generate certificate number
    v_cert_number := 'CERT-' || v_course_code || '-' || v_year || '-' || v_sequence;
    
    RETURN v_cert_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is eligible for certificate
CREATE OR REPLACE FUNCTION check_certificate_eligibility(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_total_weeks INTEGER;
    v_completed_weeks INTEGER;
    v_capstone_submitted BOOLEAN;
    v_last_week INTEGER;
BEGIN
    -- Get total weeks for the course (from assignments)
    SELECT MAX(week_number) INTO v_total_weeks
    FROM assignments
    WHERE course_id = p_course_id;
    
    -- If no assignments, course is complete when enrolled
    IF v_total_weeks IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Get last week number
    v_last_week := v_total_weeks;
    
    -- Check if capstone project (last week) is submitted
    SELECT EXISTS(
        SELECT 1
        FROM assignment_submissions asub
        JOIN assignments a ON asub.assignment_id = a.id
        WHERE asub.user_id = p_user_id
        AND a.course_id = p_course_id
        AND a.week_number = v_last_week
        AND asub.status IN ('submitted', 'graded')
    ) INTO v_capstone_submitted;
    
    -- User is eligible if capstone is submitted
    RETURN v_capstone_submitted;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate certificate when capstone is submitted
CREATE OR REPLACE FUNCTION auto_generate_certificate()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_last_week INTEGER;
    v_is_capstone BOOLEAN;
    v_eligible BOOLEAN;
    v_cert_exists BOOLEAN;
    v_cert_number VARCHAR(50);
    v_avg_score NUMERIC;
    v_grade VARCHAR(10);
BEGIN
    -- Get course_id and week_number from assignment
    SELECT a.course_id, a.week_number INTO v_course_id, v_last_week
    FROM assignments a
    WHERE a.id = NEW.assignment_id;
    
    -- Check if this is the last week (capstone project)
    SELECT week_number = (
        SELECT MAX(week_number)
        FROM assignments
        WHERE course_id = v_course_id
    ) INTO v_is_capstone
    FROM assignments
    WHERE id = NEW.assignment_id;
    
    -- Only proceed if this is a capstone submission
    IF NOT v_is_capstone THEN
        RETURN NEW;
    END IF;
    
    -- Check if user is eligible
    v_eligible := check_certificate_eligibility(NEW.user_id, v_course_id);
    
    IF NOT v_eligible THEN
        RETURN NEW;
    END IF;
    
    -- Check if certificate already exists
    SELECT EXISTS(
        SELECT 1
        FROM certificates
        WHERE user_id = NEW.user_id
        AND course_id = v_course_id
    ) INTO v_cert_exists;
    
    IF v_cert_exists THEN
        RETURN NEW;
    END IF;
    
    -- Calculate average score
    SELECT COALESCE(AVG(score), 0) INTO v_avg_score
    FROM assignment_submissions asub
    JOIN assignments a ON asub.assignment_id = a.id
    WHERE asub.user_id = NEW.user_id
    AND a.course_id = v_course_id
    AND asub.status = 'graded';
    
    -- Determine grade
    v_grade := CASE
        WHEN v_avg_score >= 95 THEN 'A+'
        WHEN v_avg_score >= 90 THEN 'A'
        WHEN v_avg_score >= 85 THEN 'B+'
        WHEN v_avg_score >= 80 THEN 'B'
        WHEN v_avg_score >= 75 THEN 'C+'
        WHEN v_avg_score >= 70 THEN 'C'
        ELSE 'Pass'
    END;
    
    -- Generate certificate number
    v_cert_number := generate_certificate_number(v_course_id, NEW.user_id);
    
    -- Insert certificate
    INSERT INTO certificates (
        user_id,
        course_id,
        certificate_number,
        grade,
        score,
        issued_at,
        completion_date
    ) VALUES (
        NEW.user_id,
        v_course_id,
        v_cert_number,
        v_grade,
        v_avg_score::INTEGER,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate certificate on capstone submission
CREATE TRIGGER trigger_auto_generate_certificate
    AFTER INSERT OR UPDATE ON assignment_submissions
    FOR EACH ROW
    WHEN (NEW.status IN ('submitted', 'graded'))
    EXECUTE FUNCTION auto_generate_certificate();

-- Comments
COMMENT ON TABLE certificates IS 'Stores course completion certificates';
COMMENT ON FUNCTION generate_certificate_number IS 'Generates unique certificate numbers';
COMMENT ON FUNCTION check_certificate_eligibility IS 'Checks if user is eligible for certificate';
COMMENT ON FUNCTION auto_generate_certificate IS 'Automatically generates certificate when capstone is submitted';
