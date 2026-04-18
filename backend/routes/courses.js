import express from 'express';
import { body, query, validationResult } from 'express-validator';
import supabase from '../config/supabase.js';
import { supabaseProtect } from '../middleware/supabaseAuth.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', [
    query('category').optional().isIn(['basics', 'advanced', 'specialization']),
    query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { category, difficulty, search, page = 1, limit = 10 } = req.query;

        // Build Supabase query - using simple schema
        let query = supabase
            .from('courses')
            .select('*', { count: 'exact' });

        if (category) query = query.eq('category', category);
        if (difficulty) query = query.eq('difficulty', difficulty);
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to).order('created_at', { ascending: false });

        const { data: courses, error, count } = await query;

        if (error) throw error;

        res.json({
            status: 'success',
            data: {
                courses,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(count / limit),
                    total: count,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Try to find by ID or title slug
        let query = supabase.from('courses').select('*');

        // Check if it's a UUID
        if (req.params.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            query = query.eq('id', req.params.id);
        } else {
            // Try to match by title (convert slug to searchable format)
            query = query.ilike('title', `%${req.params.id.replace(/-/g, ' ')}%`);
        }

        const { data: courses, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        const course = courses[0];

        // If user is authenticated, check enrollment status
        let enrollmentStatus = null;
        if (req.user) {
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('status')
                .eq('user_id', req.user.id)
                .eq('course_id', course.id)
                .single();

            enrollmentStatus = enrollment ? enrollment.status : null;
        }

        res.json({
            status: 'success',
            data: {
                course,
                enrollmentStatus
            }
        });

    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
router.post('/', supabaseProtect, [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Title must be between 5 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 1000 })
        .withMessage('Description must be between 20 and 1000 characters'),
    body('category')
        .isIn(['basics', 'advanced', 'specialization'])
        .withMessage('Invalid category'),
    body('level')
        .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
        .withMessage('Invalid level'),
    body('duration')
        .notEmpty()
        .withMessage('Duration is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const courseData = {
            ...req.body,
            instructor_id: req.user.id,
            slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        };

        const { data: course, error } = await supabase
            .from('courses')
            .insert([courseData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            status: 'success',
            message: 'Course created successfully',
            data: { course }
        });

    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
router.put('/:id', supabaseProtect, async (req, res) => {
    try {
        const { data: course, error: fetchError } = await supabase
            .from('courses')
            .select('instructor_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        // Check if user owns the course (unless admin)
        if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this course'
            });
        }

        const { data: updatedCourse, error: updateError } = await supabase
            .from('courses')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            status: 'success',
            message: 'Course updated successfully',
            data: { course: updatedCourse }
        });

    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
router.delete('/:id', supabaseProtect, async (req, res) => {
    try {
        const { data: course, error: fetchError } = await supabase
            .from('courses')
            .select('instructor_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        // Check if user owns the course (unless admin)
        if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this course'
            });
        }

        // Check if course has enrollments
        const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', req.params.id);

        if (count > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete course with active enrollments'
            });
        }

        const { error: deleteError } = await supabase
            .from('courses')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;

        res.json({
            status: 'success',
            message: 'Course deleted successfully'
        });

    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Unenroll from course
// @route   DELETE /api/courses/:id/enroll
// @access  Private (Student)
router.delete('/:id/enroll', supabaseProtect, async (req, res) => {
    try {
        const { data: course, error: fetchError } = await supabase
            .from('courses')
            .select('id, title')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        // Find the enrollment
        const { data: enrollment, error: enrollError } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', req.user.id)
            .eq('course_id', req.params.id)
            .single();

        if (enrollError || !enrollment) {
            return res.status(404).json({
                status: 'error',
                message: 'You are not enrolled in this course'
            });
        }

        // Delete the enrollment
        const { error: deleteError } = await supabase
            .from('enrollments')
            .delete()
            .eq('id', enrollment.id);

        if (deleteError) throw deleteError;

        res.json({
            status: 'success',
            message: 'Successfully unenrolled from course'
        });

    } catch (error) {
        console.error('Unenroll error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Get course statistics
// @route   GET /api/courses/:id/stats
// @access  Private (Instructor/Admin)
router.get('/:id/stats', supabaseProtect, async (req, res) => {
    try {
        const { data: course, error: fetchError } = await supabase
            .from('courses')
            .select('id, title, instructor_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        // Check if user owns the course (unless admin)
        if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to view course statistics'
            });
        }

        // Get enrollment statistics
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('status, completion_percentage')
            .eq('course_id', req.params.id);

        if (enrollError) throw enrollError;

        const totalEnrollments = enrollments.length;
        const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
        const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
        const averageProgress = totalEnrollments > 0
            ? enrollments.reduce((sum, e) => sum + (e.completion_percentage || 0), 0) / totalEnrollments
            : 0;

        res.json({
            status: 'success',
            data: {
                course: {
                    id: course.id,
                    title: course.title
                },
                statistics: {
                    totalEnrollments,
                    activeEnrollments,
                    completedEnrollments,
                    averageProgress: Math.round(averageProgress),
                    completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0
                }
            }
        });

    } catch (error) {
        console.error('Get course stats error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

export default router;