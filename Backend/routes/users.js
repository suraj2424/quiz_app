const express = require('express');
const router = express.Router();
const { createHmac, randomBytes } = require('crypto');
const User = require('../models/userSchema');
const { generateToken,authenticate } = require('../services/authentication');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.post('/register', async (req, res) => {
    const { full_name, email, password, type } = req.body;
    const salt = randomBytes(16).toString('hex');
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Create hash for password
        const hash = createHmac('sha256', salt).update(password).digest('hex');
        const user = new User({
            name:full_name,
            email: email,
            password: hash,
            salt: salt,
            type: type
        });
        await user.save();
        res.status(201).json({
            message: "User registered successfully"
        });
        console.log(user);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const hash = createHmac('sha256', user.salt).update(password).digest('hex');
            if (hash === user.password) {
                const token = generateToken(user);
                return res.status(200).json({
                    message: "User logged in successfully",
                    token: token  // Add this line to send the token in the response body
                });
            }
        }

        res.status(400).json({
            message: "Invalid credentials"
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.use(cookieParser());

router.get('/verify-token', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -salt');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user: { name: user.name, id: user._id, email: user.email, type: user.type } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: "User logged out successfully"
    });
});

router.delete("/delete/:id",async (req,res)=>{
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
})

module.exports = router;