/**
 * @file auth.routes.js
 * @description Authentication routes for handling registration and login.
 * Orchestrates routes with validation and controllers.
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Onboard a new user with validation
 * @access  Public
 */
router.post('/register', validate(registerValidation), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', validate(loginValidation), authController.login);

module.exports = router;
