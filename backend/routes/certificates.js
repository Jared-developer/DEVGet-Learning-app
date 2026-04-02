import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all certificates for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('certificates')
            .select(`
                *,
                course:courses (
                    id,
                    title,
                    description,
                    instructor
                )
            `)
            .eq('user_id', userId)
            .order('issued_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, certificates: data });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get a specific certificate
router.get('/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;

        const { data, error } = await supabase
            .from('certificates')
            .select(`
                *,
                course:courses (
                    id,
                    title,
                    description,
                    instructor
                ),
                user:auth.users (
                    id,
                    email,
                    user_metadata
                )
            `)
            .eq('id', certificateId)
            .single();

        if (error) throw error;

        res.json({ success: true, certificate: data });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Verify certificate by certificate number
router.get('/verify/:certificateNumber', async (req, res) => {
    try {
        const { certificateNumber } = req.params;

        const { data, error } = await supabase
            .from('certificates')
            .select(`
                *,
                course:courses (
                    title
                )
            `)
            .eq('certificate_number', certificateNumber)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!data) {
            return res.json({
                success: false,
                verified: false,
                message: 'Certificate not found'
            });
        }

        res.json({
            success: true,
            verified: true,
            certificate: {
                certificateNumber: data.certificate_number,
                courseName: data.course.title,
                issuedAt: data.issued_at,
                grade: data.grade
            }
        });
    } catch (error) {
        console.error('Error verifying certificate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check eligibility for certificate
router.get('/eligibility/:userId/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // Call the database function to check eligibility
        const { data, error } = await supabase
            .rpc('check_certificate_eligibility', {
                p_user_id: userId,
                p_course_id: courseId
            });

        if (error) throw error;

        res.json({ success: true, eligible: data });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manually generate certificate (admin only)
router.post('/generate', async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Course ID are required'
            });
        }

        // Check if certificate already exists
        const { data: existing } = await supabase
            .from('certificates')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Certificate already exists for this user and course'
            });
        }

        // Generate certificate number
        const { data: certNumber, error: certError } = await supabase
            .rpc('generate_certificate_number', {
                p_course_id: courseId,
                p_user_id: userId
            });

        if (certError) throw certError;

        // Calculate average score
        const { data: submissions } = await supabase
            .from('assignment_submissions')
            .select('score')
            .eq('user_id', userId)
            .eq('status', 'graded');

        const avgScore = submissions && submissions.length > 0
            ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length)
            : 0;

        const grade = avgScore >= 95 ? 'A+' :
            avgScore >= 90 ? 'A' :
                avgScore >= 85 ? 'B+' :
                    avgScore >= 80 ? 'B' :
                        avgScore >= 75 ? 'C+' :
                            avgScore >= 70 ? 'C' : 'Pass';

        // Insert certificate
        const { data: certificate, error: insertError } = await supabase
            .from('certificates')
            .insert([{
                user_id: userId,
                course_id: courseId,
                certificate_number: certNumber,
                grade: grade,
                score: avgScore
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        res.json({
            success: true,
            message: 'Certificate generated successfully',
            certificate
        });
    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
