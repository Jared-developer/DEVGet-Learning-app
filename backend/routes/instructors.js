import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { supabaseProtect } from '../middleware/supabaseAuth.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        // Check role from the JWT token (already verified by supabaseProtect)
        if (req.user.user_metadata?.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Middleware to check if user is instructor for a course
const isInstructor = async (req, res, next) => {
    try {
        const courseId = req.params.courseId || req.body.course_id;

        const { data, error } = await supabase
            .from('course_instructors')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            return res.status(403).json({ error: 'Instructor access required for this course' });
        }

        req.isInstructor = true;
        next();
    } catch (error) {
        console.error('Instructor check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Admin: Assign instructor to course
router.post('/assign', supabaseProtect, isAdmin, async (req, res) => {
    try {
        const { user_id, course_id } = req.body;

        if (!user_id || !course_id) {
            return res.status(400).json({ error: 'User ID and Course ID are required' });
        }

        // Check if course exists
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id, title')
            .eq('id', course_id)
            .single();

        if (courseError || !course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if user exists
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);

        if (userError || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Assign instructor
        const { data, error } = await supabase
            .from('course_instructors')
            .insert({
                user_id,
                course_id,
                assigned_by: req.user.id
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Instructor already assigned to this course' });
            }
            throw error;
        }

        res.json({
            message: 'Instructor assigned successfully',
            data
        });
    } catch (error) {
        console.error('Assign instructor error:', error);
        res.status(500).json({ error: 'Failed to assign instructor' });
    }
});

// Admin: Remove instructor from course
router.delete('/:courseId/instructor/:userId', supabaseProtect, isAdmin, async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        const { error } = await supabase
            .from('course_instructors')
            .delete()
            .eq('course_id', courseId)
            .eq('user_id', userId);

        if (error) throw error;

        res.json({ message: 'Instructor removed successfully' });
    } catch (error) {
        console.error('Remove instructor error:', error);
        res.status(500).json({ error: 'Failed to remove instructor' });
    }
});

// Get instructors for a course
router.get('/course/:courseId', supabaseProtect, async (req, res) => {
    try {
        const { courseId } = req.params;

        const { data, error } = await supabase
            .from('course_instructors')
            .select(`
        *,
        user:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
            .eq('course_id', courseId)
            .eq('is_active', true);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get instructors error:', error);
        res.status(500).json({ error: 'Failed to fetch instructors' });
    }
});

// Admin: Get all users (for instructor assignment)
router.get('/users', supabaseProtect, isAdmin, async (req, res) => {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) throw error;

        // Filter out admins and format response
        const regularUsers = users
            .filter(u => u.user_metadata?.role !== 'admin')
            .map(u => ({
                id: u.id,
                email: u.email,
                fullName: u.user_metadata?.fullName || u.user_metadata?.full_name || 'No name',
                created_at: u.created_at
            }));

        res.json(regularUsers);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get courses for an instructor
router.get('/my-courses', supabaseProtect, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('course_instructors')
            .select(`
        *,
        course:course_id (
          id,
          title,
          description,
          category,
          thumbnail
        )
      `)
            .eq('user_id', req.user.id)
            .eq('is_active', true);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get instructor courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Upload course resource
router.post('/resources', supabaseProtect, async (req, res) => {
    try {
        const {
            course_id,
            title,
            description,
            resource_type,
            resource_url,
            file_size,
            lesson_id,
            is_public
        } = req.body;

        if (!course_id || !title || !resource_type || !resource_url) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user is instructor or admin
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(req.user.id);
        const isAdmin = user?.user_metadata?.role === 'admin';

        const { data: instructor } = await supabase
            .from('course_instructors')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('course_id', course_id)
            .eq('is_active', true)
            .single();

        if (!isAdmin && !instructor) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { data, error } = await supabase
            .from('course_resources')
            .insert({
                course_id,
                title,
                description,
                resource_type,
                resource_url,
                file_size,
                lesson_id,
                is_public: is_public !== false,
                uploaded_by: req.user.id
            })
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'Resource uploaded successfully',
            data
        });
    } catch (error) {
        console.error('Upload resource error:', error);
        res.status(500).json({ error: 'Failed to upload resource' });
    }
});

// Get course resources
router.get('/resources/:courseId', supabaseProtect, async (req, res) => {
    try {
        const { courseId } = req.params;

        const { data, error } = await supabase
            .from('course_resources')
            .select('*')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Update course resource
router.put('/resources/:resourceId', supabaseProtect, async (req, res) => {
    try {
        const { resourceId } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('course_resources')
            .update(updates)
            .eq('id', resourceId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'Resource updated successfully',
            data
        });
    } catch (error) {
        console.error('Update resource error:', error);
        res.status(500).json({ error: 'Failed to update resource' });
    }
});

// Delete course resource
router.delete('/resources/:resourceId', supabaseProtect, async (req, res) => {
    try {
        const { resourceId } = req.params;

        const { error } = await supabase
            .from('course_resources')
            .delete()
            .eq('id', resourceId);

        if (error) throw error;

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

// Create class session
router.post('/sessions', supabaseProtect, async (req, res) => {
    try {
        const {
            course_id,
            title,
            description,
            session_date,
            duration_minutes,
            meeting_link,
            recording_url,
            status
        } = req.body;

        if (!course_id || !title || !session_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('class_sessions')
            .insert({
                course_id,
                title,
                description,
                session_date,
                duration_minutes,
                meeting_link,
                recording_url,
                status: status || 'scheduled',
                created_by: req.user.id
            })
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'Class session created successfully',
            data
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to create class session' });
    }
});

// Get class sessions for a course
router.get('/sessions/:courseId', supabaseProtect, async (req, res) => {
    try {
        const { courseId } = req.params;

        const { data, error } = await supabase
            .from('class_sessions')
            .select('*')
            .eq('course_id', courseId)
            .order('session_date', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch class sessions' });
    }
});

// Update class session
router.put('/sessions/:sessionId', supabaseProtect, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('class_sessions')
            .update(updates)
            .eq('id', sessionId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'Class session updated successfully',
            data
        });
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({ error: 'Failed to update class session' });
    }
});

// Delete class session
router.delete('/sessions/:sessionId', supabaseProtect, async (req, res) => {
    try {
        const { sessionId } = req.params;

        const { error } = await supabase
            .from('class_sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;

        res.json({ message: 'Class session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({ error: 'Failed to delete class session' });
    }
});

export default router;
