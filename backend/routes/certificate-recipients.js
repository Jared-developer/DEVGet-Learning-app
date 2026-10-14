import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /api/certificate-recipients/user/:userId
 * Get all certificates for a user
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('certificate_recipients')
            .select('*')
            .eq('user_id', userId)
            .order('issued_at', { ascending: false });

        if (error) {
            console.error('Error fetching certificates:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch certificates'
            });
        }

        res.json({
            success: true,
            certificates: data || []
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/certificate-recipients/:certificateId
 * Get certificate by certificate ID
 */
router.get('/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;

        const { data, error } = await supabase
            .from('certificate_recipients')
            .select('*')
            .eq('certificate_id', certificateId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    error: 'Certificate not found'
                });
            }
            throw error;
        }

        res.json({
            success: true,
            certificate: data
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/certificate-recipients/bootcamp/:bootcampId/user/:userId
 * Check if user has certificate for specific bootcamp
 */
router.get('/bootcamp/:bootcampId/user/:userId', async (req, res) => {
    try {
        const { bootcampId, userId } = req.params;

        const { data, error } = await supabase
            .from('certificate_recipients')
            .select('*')
            .eq('user_id', userId)
            .eq('bootcamp_id', bootcampId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.json({
                    success: true,
                    hasCertificate: false
                });
            }
            throw error;
        }

        res.json({
            success: true,
            hasCertificate: true,
            certificate: data
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
