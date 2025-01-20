// Importing dependencies
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//Hashes passwords for secure storage and compares passwords during login.
const User = require('../models/user');
const jwt = require('jsonwebtoken');// Generates JSON Web Tokens (JWTs) for user authentication. 

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
        const hashedPassword = await bcrypt.hash(password, 10);//Uses bcrypt.compare to verify the provided password against the hashed password stored in the database.

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

// POST route for user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Email and password are required and must be strings.' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Auth failed' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { email: user.email, userId: user._id },
                process.env.JWT_KEY, 
                { expiresIn: '1h' }
            );
            return res.status(200).json({ message: 'Auth successful', token: token });
        } else {
            return res.status(401).json({ message: 'Auth failed' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to delete a user by ID
router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await User.deleteOne({ _id: userId });
        if (result.deletedCount > 0) {
            res.status(200).json({
                message: 'User deleted successfully',
            });
        } else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Exporting the router
module.exports = router;
