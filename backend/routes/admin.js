import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Register a new student (admin only)
router.post('/register-student', async (req, res) => {
    try {
        const { email, password, fullName, phone, dateOfBirth, sendEmail } = req.body;

        // Validate required fields
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and full name are required'
            });
        }

        // Create user with admin API
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: !sendEmail, // Auto-confirm if not sending email
            user_metadata: {
                full_name: fullName,
                phone: phone || null,
                date_of_birth: dateOfBirth || null,
                role: 'student',
                registered_by: 'admin'
            }
        });

        if (error) {
            console.error('Error creating user:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            data: {
                id: data.user.id,
                email: data.user.email
            }
        });
    } catch (error) {
        console.error('Error in register-student:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
