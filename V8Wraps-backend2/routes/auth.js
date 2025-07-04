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
// PUT /api/auth/change-password - Change password
router.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    // Validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    try {
        // Get current user with password hash
        const { data: user, error: fetchError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', req.user.id)
            .single();
            
        if (fetchError || !user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
        
        // Update password in database
        console.log(req.user.id);
        const { error: updateError } = await supabase
            .from('admin_users')
            .update({ 
                password_hash: newPasswordHash,
                updated_at: new Date().toISOString()
            })
            .eq('id', req.user.id);
            
        if (updateError) {
            console.error('Password update error:', updateError);
            return res.status(500).json({ message: 'Failed to update password' });
        }
        
        res.status(200).json({ message: 'Password changed successfully' });
        
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
