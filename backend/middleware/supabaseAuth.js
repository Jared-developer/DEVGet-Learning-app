import { supabase } from '../config/supabase.js';

// Protect routes - verify Supabase JWT token
export const supabaseProtect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is not valid.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Supabase auth middleware error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Token is not valid.'
        });
    }
};