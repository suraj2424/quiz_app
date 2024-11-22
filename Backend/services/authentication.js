const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const dotenv = require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

const generateToken = (user) => {
    const payload = { name:user.name, email: user.email, id: user._id, type: user.type };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return token;
};

module.exports = { authenticate, generateToken };