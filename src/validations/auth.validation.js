/**
 * @file auth.validation.js
 * @description Joi validation schemas for authentication routes.
 * Ensures data integrity before reaching the logic layer.
 */

const Joi = require('joi');

/**
 * Validation schema for user registration.
 */
const registerValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is a required field'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is a required field'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is a required field'
        }),

    role: Joi.string()
        .valid('Admin', 'Analyst', 'Viewer')
        .messages({
            'any.only': 'Role must be one of [Admin, Analyst, Viewer]'
        })
});

/**
 * Validation schema for user login.
 */
const loginValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required for login'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required for login'
        })
});

module.exports = {
    registerValidation,
    loginValidation
};
