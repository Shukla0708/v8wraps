const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../lib/supabase');
const {authenticateToken} = require('../lib/middleware');
const router = express.Router();


// POST /api/auth - Login
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('*')
            .ilike('email', email.trim())
            .maybeSingle();

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/auth/logout - Logout
router.post('/logout', (req, res) => {
    // No real logout with JWT unless implementing token blacklisting
    res.status(200).json({ message: 'Logout successful (client should delete token)' });
});

// GET /api/auth/user - Protected route to get current user
router.get('/user', authenticateToken, async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
