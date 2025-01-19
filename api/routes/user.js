// Importing dependencies
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// POST route for user signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Email and password are required and must be strings.' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const result = await user.save();
        console.log('User created:', result);
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: result._id,
                email: result.email,
            },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        // Handle specific MongoDB error for unique index violation
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId;

    User.deleteOne({ _id: userId })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: 'User deleted successfully',
                });
            } else {
                res.status(404).json({
                    message: 'User not found',
                });
            }
        })
        .catch(err => {
            console.error('Error deleting user:', err);
            res.status(500).json({
                error: err.message,
            });
        });
});

// Exporting the router
module.exports = router;
