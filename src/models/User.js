/**
 * @file User.js
 * @description Mongoose schema for User management in the Finance Portal.
 * Includes password hashing, role-based access control flags, and authentication methods.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Display name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Prevents password from being returned in queries by default
    },
    role: {
        type: String,
        enum: {
            values: ['Admin', 'Analyst', 'Viewer'],
            message: '{VALUE} is not a valid role'
        },
        default: 'Viewer'
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended'],
        default: 'Active'
    }
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false
});

/**
 * Pre-save Middleware: Hashes the password before saving to the database.
 */
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: Compare entered password with the hashed password in DB.
 * @param {string} enteredPassword - The plain text password from login request
 * @returns {Promise<boolean>} - Match result
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
