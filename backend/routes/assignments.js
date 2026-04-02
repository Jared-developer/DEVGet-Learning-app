import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all assignments for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;

        const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('course_id', courseId)
            .order('week_number', { ascending: true });

        if (error) throw error;

        res.json({ success: true, assignments: data });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get assignments for a specific week
router.get('/course/:courseId/week/:weekNumber', async (req, res) => {
    try {
        const { courseId, weekNumber } = req.params;

        const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('course_id', courseId)
            .eq('week_number', weekNumber)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.json({ success: true, assignment: data });
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit an assignment
router.post('/submit', async (req, res) => {
    try {
        const { assignmentId, userId, githubUrl, notes } = req.body;

        if (!assignmentId || !userId || !githubUrl) {
            return res.status(400).json({
                success: false,
                error: 'Assignment ID, User ID, and GitHub URL are required'
            });
        }

        // Validate GitHub URL format
        const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/.+/i;
        if (!githubUrlPattern.test(githubUrl)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid GitHub URL'
            });
        }

        // Check if submission already exists
        const { data: existing } = await supabase
            .from('assignment_submissions')
            .select('id')
            .eq('assignment_id', assignmentId)
            .eq('user_id', userId)
            .single();

        if (existing) {
            // Update existing submission
            const { data, error } = await supabase
                .from('assignment_submissions')
                .update({
                    github_url: githubUrl,
                    notes: notes || null,
                    submitted_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;

            return res.json({
                success: true,
                message: 'Assignment updated successfully',
                submission: data
            });
        }

        // Create new submission
        const { data, error } = await supabase
            .from('assignment_submissions')
            .insert([{
                assignment_id: assignmentId,
                user_id: userId,
                github_url: githubUrl,
                notes: notes || null,
                status: 'submitted'
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Assignment submitted successfully',
            submission: data
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user's submissions
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('assignment_submissions')
            .select(`
                *,
                assignment:assignments (
                    id,
                    title,
                    description,
                    points,
                    week_number,
                    course:courses (
                        id,
                        title
                    )
                )
            `)
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, submissions: data });
    } catch (error) {
        console.error('Error fetching user submissions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user's submission for a specific assignment
router.get('/user/:userId/assignment/:assignmentId', async (req, res) => {
    try {
        const { userId, assignmentId } = req.params;

        const { data, error } = await supabase
            .from('assignment_submissions')
            .select('*')
            .eq('user_id', userId)
            .eq('assignment_id', assignmentId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.json({ success: true, submission: data });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
