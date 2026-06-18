import express from 'express';
import { body, query, validationResult } from 'express-validator';
import supabase from '../config/supabase.js';
import { supabaseProtect } from '../middleware/supabaseAuth.js';

const router = express.Router();

// Enhanced error handling utility
const handleDatabaseError = (error, operation = 'database operation') => {
    console.error(`Database error during ${operation}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString()
    });

    // Map common database errors to user-friendly messages
    const errorMap = {
        'PGRST116': 'No data found for this request',
        '23503': 'Referenced data not found',
        '23505': 'This data already exists',
        '42P01': 'Database table not found - please contact support',
        'PGRST301': 'Insufficient permissions for this operation'
    };

    const userMessage = errorMap[error.code] || 'A database error occurred';
    
    return {
        code: error.code || 'DATABASE_ERROR',
        message: userMessage,
        technical: error.message
    };
};

// Rate limiting helper (in-memory, for production use Redis)
const rateLimitMap = new Map();
const checkRateLimit = (userId, action, limit = 10, windowMs = 60000) => {
    const key = `${userId}:${action}`;
    const now = Date.now();
    
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    const userData = rateLimitMap.get(key);
    if (now > userData.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (userData.count >= limit) {
        return false;
    }
    
    userData.count++;
    return true;
};

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
                message: 'Invalid request parameters',
                errors: errors.array()
            });
        }

        const { courseId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Validate courseId format (assuming numeric ID)
        if (isNaN(parseInt(courseId))) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid course ID format'
            });
        }

        // Check if user is enrolled in the course with retry logic
        let enrollment;
        let enrollError;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('enrollments')
                    .select('status')
                    .eq('user_id', req.user.id)
                    .eq('course_id', courseId)
                    .single();
                
                enrollment = result.data;
                enrollError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    enrollError = err;
                } else {
                    // Wait before retry with exponential backoff
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (enrollError) {
            const dbError = handleDatabaseError(enrollError, 'enrollment check');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to verify course enrollment. Please try again.',
                code: dbError.code
            });
        }

        if (!enrollment || enrollment.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to access the community',
                code: 'NOT_ENROLLED'
            });
        }

        // Get messages with pagination and enhanced error handling
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let messages, messageError, count;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
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

                messages = result.data;
                messageError = result.error;
                count = result.count;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    messageError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (messageError) {
            const dbError = handleDatabaseError(messageError, 'message retrieval');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to load messages. Please refresh the page.',
                code: dbError.code
            });
        }

        // Get user details for each message with error handling
        const userIds = [...new Set(messages.map(m => m.user_id))];
        let users = { users: [] };
        
        if (userIds.length > 0) {
            try {
                const result = await supabase.auth.admin.listUsers();
                users = result.data || { users: [] };
            } catch (userError) {
                console.error('Error fetching user details:', userError);
                // Continue without user details rather than failing entirely
            }
        }

        const userMap = {};
        if (users.users) {
            users.users.forEach(user => {
                if (userIds.includes(user.id)) {
                    userMap[user.id] = {
                        email: user.email,
                        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User'
                    };
                }
            });
        }

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
                    pages: Math.ceil((count || 0) / limit),
                    total: count || 0,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        const dbError = handleDatabaseError(error, 'get community messages');
        res.status(500).json({
            status: 'error',
            message: 'Unable to load community messages. Please try again later.',
            code: dbError.code
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
        .escape() // Prevent XSS
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Message validation failed',
                errors: errors.array(),
                code: 'VALIDATION_ERROR'
            });
        }

        const { courseId } = req.params;
        const { message } = req.body;

        // Validate courseId format
        if (isNaN(parseInt(courseId))) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid course ID format',
                code: 'INVALID_COURSE_ID'
            });
        }

        // Rate limiting check
        if (!checkRateLimit(req.user.id, 'post_message', 10, 60000)) {
            return res.status(429).json({
                status: 'error',
                message: 'You are posting messages too quickly. Please wait a moment.',
                code: 'RATE_LIMIT_EXCEEDED'
            });
        }

        // Check if user is enrolled in the course with retry logic
        let enrollment;
        let enrollError;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('enrollments')
                    .select('status')
                    .eq('user_id', req.user.id)
                    .eq('course_id', courseId)
                    .single();
                
                enrollment = result.data;
                enrollError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    enrollError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (enrollError) {
            const dbError = handleDatabaseError(enrollError, 'enrollment verification');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to verify course enrollment. Please try again.',
                code: dbError.code
            });
        }

        if (!enrollment || enrollment.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to post messages',
                code: 'NOT_ENROLLED'
            });
        }

        // Create message with retry logic
        let newMessage;
        let messageError;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('community_messages')
                    .insert([{
                        course_id: courseId,
                        user_id: req.user.id,
                        message
                    }])
                    .select()
                    .single();

                newMessage = result.data;
                messageError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    messageError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (messageError) {
            const dbError = handleDatabaseError(messageError, 'message creation');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to post message. Please try again.',
                code: dbError.code
            });
        }

        // Get user details with error handling
        let user = null;
        try {
            const { data: userData } = await supabase.auth.admin.getUserById(req.user.id);
            user = userData.user;
        } catch (userError) {
            console.error('Error fetching user details:', userError);
            // Use fallback user data
            user = {
                email: 'unknown@example.com',
                user_metadata: { name: 'Unknown User' }
            };
        }

        const enrichedMessage = {
            ...newMessage,
            user: {
                email: user.email || 'unknown@example.com',
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User'
            }
        };

        res.status(201).json({
            status: 'success',
            message: 'Message posted successfully',
            data: { message: enrichedMessage }
        });

    } catch (error) {
        const dbError = handleDatabaseError(error, 'post community message');
        res.status(500).json({
            status: 'error',
            message: 'Unable to post message. Please check your connection and try again.',
            code: dbError.code
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
        .escape() // Prevent XSS
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Message validation failed',
                errors: errors.array(),
                code: 'VALIDATION_ERROR'
            });
        }

        const { messageId } = req.params;
        const { message } = req.body;

        // Validate messageId format
        if (isNaN(parseInt(messageId))) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid message ID format',
                code: 'INVALID_MESSAGE_ID'
            });
        }

        // Rate limiting check
        if (!checkRateLimit(req.user.id, 'edit_message', 5, 60000)) {
            return res.status(429).json({
                status: 'error',
                message: 'You are editing messages too frequently. Please wait a moment.',
                code: 'RATE_LIMIT_EXCEEDED'
            });
        }

        // Check if message exists and belongs to user with retry logic
        let existingMessage;
        let fetchError;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('community_messages')
                    .select('user_id, created_at, is_deleted')
                    .eq('id', messageId)
                    .single();
                
                existingMessage = result.data;
                fetchError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    fetchError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (fetchError) {
            const dbError = handleDatabaseError(fetchError, 'message lookup');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to verify message. Please try again.',
                code: dbError.code
            });
        }

        if (!existingMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message not found',
                code: 'MESSAGE_NOT_FOUND'
            });
        }

        if (existingMessage.is_deleted) {
            return res.status(410).json({
                status: 'error',
                message: 'This message has been deleted',
                code: 'MESSAGE_DELETED'
            });
        }

        if (existingMessage.user_id !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'You can only edit your own messages',
                code: 'NOT_AUTHORIZED'
            });
        }

        // Check if message is too old to edit (24 hours)
        const messageAge = Date.now() - new Date(existingMessage.created_at).getTime();
        const maxEditAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (messageAge > maxEditAge) {
            return res.status(403).json({
                status: 'error',
                message: 'Messages can only be edited within 24 hours of posting',
                code: 'EDIT_WINDOW_EXPIRED'
            });
        }

        // Update message with retry logic
        let updatedMessage;
        let updateError;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('community_messages')
                    .update({
                        message,
                        is_edited: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', messageId)
                    .select()
                    .single();

                updatedMessage = result.data;
                updateError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    updateError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (updateError) {
            const dbError = handleDatabaseError(updateError, 'message update');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to update message. Please try again.',
                code: dbError.code
            });
        }

        res.json({
            status: 'success',
            message: 'Message updated successfully',
            data: { message: updatedMessage }
        });

    } catch (error) {
        const dbError = handleDatabaseError(error, 'update community message');
        res.status(500).json({
            status: 'error',
            message: 'Unable to update message. Please check your connection and try again.',
            code: dbError.code
        });
    }
});

// @desc    Delete a message
// @route   DELETE /api/community/messages/:messageId
// @access  Private (Message owner only)
router.delete('/messages/:messageId', supabaseProtect, async (req, res) => {
    try {
        const { messageId } = req.params;

        // Validate messageId format
        if (isNaN(parseInt(messageId))) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid message ID format',
                code: 'INVALID_MESSAGE_ID'
            });
        }

        // Rate limiting check
        if (!checkRateLimit(req.user.id, 'delete_message', 5, 60000)) {
            return res.status(429).json({
                status: 'error',
                message: 'You are deleting messages too frequently. Please wait a moment.',
                code: 'RATE_LIMIT_EXCEEDED'
            });
        }

        // Check if message exists and belongs to user with retry logic
        let existingMessage;
        let fetchError;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('community_messages')
                    .select('user_id, is_deleted')
                    .eq('id', messageId)
                    .single();
                
                existingMessage = result.data;
                fetchError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    fetchError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (fetchError) {
            const dbError = handleDatabaseError(fetchError, 'message lookup');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to verify message. Please try again.',
                code: dbError.code
            });
        }

        if (!existingMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message not found',
                code: 'MESSAGE_NOT_FOUND'
            });
        }

        if (existingMessage.is_deleted) {
            return res.status(410).json({
                status: 'error',
                message: 'This message has already been deleted',
                code: 'MESSAGE_ALREADY_DELETED'
            });
        }

        if (existingMessage.user_id !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'You can only delete your own messages',
                code: 'NOT_AUTHORIZED'
            });
        }

        // Soft delete message with retry logic
        let deleteError;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('community_messages')
                    .update({ 
                        is_deleted: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', messageId);

                deleteError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    deleteError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (deleteError) {
            const dbError = handleDatabaseError(deleteError, 'message deletion');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to delete message. Please try again.',
                code: dbError.code
            });
        }

        res.json({
            status: 'success',
            message: 'Message deleted successfully'
        });

    } catch (error) {
        const dbError = handleDatabaseError(error, 'delete community message');
        res.status(500).json({
            status: 'error',
            message: 'Unable to delete message. Please check your connection and try again.',
            code: dbError.code
        });
    }
});

// @desc    Get enrolled students count for a course
// @route   GET /api/community/:courseId/members
// @access  Private (Enrolled students only)
router.get('/:courseId/members', supabaseProtect, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate courseId format
        if (isNaN(parseInt(courseId))) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid course ID format',
                code: 'INVALID_COURSE_ID'
            });
        }

        // Check if user is enrolled with retry logic
        let enrollment;
        let enrollError;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('enrollments')
                    .select('status')
                    .eq('user_id', req.user.id)
                    .eq('course_id', courseId)
                    .single();
                
                enrollment = result.data;
                enrollError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    enrollError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (enrollError) {
            const dbError = handleDatabaseError(enrollError, 'enrollment verification');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to verify course enrollment. Please try again.',
                code: dbError.code
            });
        }

        if (!enrollment || enrollment.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to view member information',
                code: 'NOT_ENROLLED'
            });
        }

        // Get member count with retry logic
        let count;
        let countError;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const result = await supabase
                    .from('enrollments')
                    .select('*', { count: 'exact', head: true })
                    .eq('course_id', courseId)
                    .eq('status', 'active');

                count = result.count;
                countError = result.error;
                break;
            } catch (err) {
                retryCount++;
                if (retryCount === maxRetries) {
                    countError = err;
                } else {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
                }
            }
        }

        if (countError) {
            const dbError = handleDatabaseError(countError, 'member count retrieval');
            return res.status(500).json({
                status: 'error',
                message: 'Unable to load member count. Please try again.',
                code: dbError.code
            });
        }

        res.json({
            status: 'success',
            data: {
                memberCount: count || 0
            }
        });

    } catch (error) {
        const dbError = handleDatabaseError(error, 'get community members');
        res.status(500).json({
            status: 'error',
            message: 'Unable to load member information. Please try again later.',
            code: dbError.code
        });
    }
});

export default router;
