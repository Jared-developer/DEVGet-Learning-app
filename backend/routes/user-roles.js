import express from 'express'
import { supabase, supabaseAdmin } from '../config/supabase.js'

const router = express.Router()

// Get current user's roles
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const { data: roles, error } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)

        if (error) {
            throw error
        }

        res.json({
            roles: roles.map(r => r.role)
        })
    } catch (error) {
        console.error('Error fetching user roles:', error)
        res.status(500).json({ error: error.message })
    }
})

// Assign role to user (requires admin)
router.post('/assign', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        // Check if user is admin
        const { data: adminCheck } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single()

        if (!adminCheck) {
            return res.status(403).json({ error: 'Admin access required' })
        }

        const { userId, role } = req.body

        if (!userId || !role) {
            return res.status(400).json({ error: 'userId and role are required' })
        }

        const validRoles = ['student', 'developer', 'admin', 'instructor']
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' })
        }

        const { data, error } = await supabaseAdmin
            .from('user_roles')
            .insert([{ user_id: userId, role }])
            .select()

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'User already has this role' })
            }
            throw error
        }

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error assigning role:', error)
        res.status(500).json({ error: error.message })
    }
})

// Remove role from user (requires admin)
router.delete('/remove', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        // Check if user is admin
        const { data: adminCheck } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single()

        if (!adminCheck) {
            return res.status(403).json({ error: 'Admin access required' })
        }

        const { userId, role } = req.body

        if (!userId || !role) {
            return res.status(400).json({ error: 'userId and role are required' })
        }

        const { error } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', userId)
            .eq('role', role)

        if (error) {
            throw error
        }

        res.json({ success: true })
    } catch (error) {
        console.error('Error removing role:', error)
        res.status(500).json({ error: error.message })
    }
})

export default router
