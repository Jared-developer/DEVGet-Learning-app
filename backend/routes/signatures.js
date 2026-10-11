import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get signatures for a certificate
router.get('/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;

        const { data, error } = await supabase
            .from('certificate_signatures')
            .select('*')
            .eq('certificate_id', certificateId)
            .order('slot_number');

        if (error) throw error;

        res.json({ success: true, signatures: data || [] });
    } catch (error) {
        console.error('Error fetching signatures:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add or update signature
router.post('/', async (req, res) => {
    try {
        const { certificateId, slotNumber, name, title, signature, confirmed } = req.body;

        // Check if signature already exists and is confirmed
        const { data: existing } = await supabase
            .from('certificate_signatures')
            .select('*')
            .eq('certificate_id', certificateId)
            .eq('slot_number', slotNumber)
            .single();

        if (existing && existing.confirmed) {
            return res.status(400).json({ 
                success: false, 
                error: 'This signature has been confirmed and cannot be modified' 
            });
        }

        const signatureData = {
            certificate_id: certificateId,
            slot_number: slotNumber,
            name,
            title,
            signature,
            confirmed: confirmed || false,
            updated_at: new Date().toISOString()
        };

        let result;
        if (existing) {
            // Update existing signature
            result = await supabase
                .from('certificate_signatures')
                .update(signatureData)
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Insert new signature
            result = await supabase
                .from('certificate_signatures')
                .insert([signatureData])
                .select()
                .single();
        }

        if (result.error) throw result.error;

        res.json({ success: true, signature: result.data });
    } catch (error) {
        console.error('Error saving signature:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
