import express from 'express';
import { body, query, validationResult } from 'express-validator';
import supabase from '../config/supabase.js';
import { supabaseProtect } from '../middleware/supabaseAuth.js';

const router = express.Router();

// @desc    Get messages for a course community
// @route   GET /api/community/:courseId/messages
// @access  Private (Enrolled students only)
router.get('/:courseId/messages', supabaseProtect, [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
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

        const { courseId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Check if user is enrolled in the course
        const { data: enrollment, error: enrollError } = await supabase
            .from('enrollments')
            .select('status')
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .single();

        if (enrollError || !enrollment || enrollment.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to access the community'
            });
        }

        // Get messages with pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: messages, error, count } = await supabase
            .from('community_messages')
            .select(`
                id,
                course_id,
                user_id,
                message,
                created_at,
                updated_at,
                is_edited
            `, { count: 'exact' })
            .eq('course_id', courseId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Get user details for each message
        const userIds = [...new Set(messages.map(m => m.user_id))];
        const { data: users } = await supabase.auth.admin.listUsers();

        const userMap = {};
        users.users.forEach(user => {
            if (userIds.includes(user.id)) {
                userMap[user.id] = {
                    email: user.email,
                    name: user.user_metadata?.name || user.email.split('@')[0]
                };
            }
        });

        // Enrich messages with user data
        const enrichedMessages = messages.map(msg => ({
            ...msg,
            user: userMap[msg.user_id] || { email: 'Unknown', name: 'Unknown User' }
        }));

        res.json({
            status: 'success',
            data: {
                messages: enrichedMessages,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(count / limit),
                    total: count,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get community messages error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Post a message to course community
// @route   POST /api/community/:courseId/messages
// @access  Private (Enrolled students only)
router.post('/:courseId/messages', supabaseProtect, [
    body('message')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message must be between 1 and 2000 characters')
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

        const { courseId } = req.params;
        const { message } = req.body;

        // Check if user is enrolled in the course
        const { data: enrollment, error: enrollError } = await supabase
            .from('enrollments')
            .select('status')
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .single();

        if (enrollError || !enrollment || enrollment.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to post messages'
            });
        }

        // Create message
        const { data: newMessage, error } = await supabase
            .from('community_messages')
            .insert([{
                course_id: courseId,
                user_id: req.user.id,
                message
            }])
            .select()
            .single();

        if (error) throw error;

        // Get user details
        const { data: { user } } = await supabase.auth.admin.getUserById(req.user.id);

        const enrichedMessage = {
            ...newMessage,
            user: {
                email: user.email,
                name: user.user_metadata?.name || user.email.split('@')[0]
            }
        };

        res.status(201).json({
            status: 'success',
            message: 'Message posted successfully',
            data: { message: enrichedMessage }
        });

    } catch (error) {
        console.error('Post community message error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Update a message
// @route   PUT /api/community/messages/:messageId
// @access  Private (Message owner only)
router.put('/messages/:messageId', supabaseProtect, [
    body('message')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message must be between 1 and 2000 characters')
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

        const { messageId } = req.params;
        const { message } = req.body;

        // Check if message exists and belongs to user
        const { data: existingMessage, error: fetchError } = await supabase
            .from('community_messages')
            .select('user_id')
            .eq('id', messageId)
            .single();

        if (fetchError || !existingMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message not found'
            });
        }

        if (existingMessage.user_id !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this message'
            });
        }

        // Update message
        const { data: updatedMessage, error } = await supabase
            .from('community_messages')
            .update({
                message,
                is_edited: true
            })
            .eq('id', messageId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            status: 'success',
            message: 'Message updated successfully',
            data: { message: updatedMessage }
        });

    } catch (error) {
        console.error('Update community message error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Delete a message
// @route   DELETE /api/community/messages/:messageId
// @access  Private (Message owner only)
router.delete('/messages/:messageId', supabaseProtect, async (req, res) => {
    try {
        const { messageId } = req.params;

        // Check if message exists and belongs to user
        const { data: existingMessage, error: fetchError } = await supabase
            .from('community_messages')
            .select('user_id')
            .eq('id', messageId)
            .single();

        if (fetchError || !existingMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message not found'
            });
        }

        if (existingMessage.user_id !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this message'
            });
        }

        // Soft delete message
        const { error } = await supabase
            .from('community_messages')
            .update({ is_deleted: true })
            .eq('id', messageId);

        if (error) throw error;

        res.json({
            status: 'success',
            message: 'Message deleted successfully'
        });

    } catch (error) {
        console.error('Delete community message error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

// @desc    Get enrolled students count for a course
// @route   GET /api/community/:courseId/members
// @access  Private (Enrolled students only)
router.get('/:courseId/members', supabaseProtect, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if user is enrolled
        const { data: enrollment, error: enrollError } = await supabase
            .from('enrollments')
            .select('status')
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .single();

        if (enrollError || !enrollment || enrollment.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to view members'
            });
        }

        // Get member count
        const { count, error } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId)
            .eq('status', 'active');

        if (error) throw error;

        res.json({
            status: 'success',
            data: {
                memberCount: count
            }
        });

    } catch (error) {
        console.error('Get community members error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

export default router;
