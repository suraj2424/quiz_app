const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    type:{
        type: String,
        // array of "admin" and "user"
        default: 'student',
        enum: ['admin', 'student', 'teacher'],
    },
    salt:{
        type: String
    },
    googleId: {
        type: String
    }
},{ timestamps:true });

const User = mongoose.model('user', userSchema);

module.exports = User;