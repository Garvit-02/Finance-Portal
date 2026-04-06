/**
 * @file auth.service.js
 * @description Authentication service layer. Handles business logic for user registration and login.
 * This layer is independent of the HTTP request/response objects (req/res).
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logEvent } = require('../utils/auditLogger');

/**
 * Register a new user in the system.
 * @param {object} userData - { name, email, password, role }
 * @returns {Promise<object>} The created user (sensitive fields excluded)
 */
const registerUser = async (userData) => {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
    }

    // 2. Create the user (Password is hashed by Mongoose pre-save hook)
    const user = await User.create(userData);

    // 3. Log the registration event
    logEvent({
        userId: user._id,
        action: 'REGISTER',
        resource: 'User',
        resourceId: user._id,
        status: 'SUCCESS'
    });

    // 4. Convert to object and remove password before returning
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

/**
 * Log in a user and generate a security token.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} Token and basic user info
 */
const loginUser = async (credentials) => {
    const { email, password } = credentials;

    // 1. Find user and explicitly select password (since it's select: false in schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 2. Compare passwords using the model instance method
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 4. Log the login event
    logEvent({
        userId: user._id,
        action: 'LOGIN',
        resource: 'Auth',
        status: 'SUCCESS'
    });

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    registerUser,
    loginUser
};
