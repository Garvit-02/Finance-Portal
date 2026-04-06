/**
 * @file auth.controller.js
 * @description Authentication controller for handling registration and login requests.
 * Delegates business logic to the auth service and handles API responses.
 */

const authService = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse');

/**
 * Handle user registration request.
 */
const register = async (req, res, next) => {
    console.log("[Controller] Register starting...");
    try {
        const userData = req.body;
        console.log("[Controller] Calling authService.registerUser");
        
        // Delegate to service layer
        const user = await authService.registerUser(userData);
        console.log("[Controller] Service returned user");

        // Success response
        return res.status(201).json(
            apiResponse(true, "User registered successfully", user)
        );
    } catch (error) {
        console.error("[Controller Error]", error.message);
        // Pass to centralized error handler middleware
        next(error);
    }
};

/**
 * Handle user login request.
 */
const login = async (req, res, next) => {
    try {
        const credentials = req.body;

        // Delegate to service layer
        const result = await authService.loginUser(credentials);

        // Success response
        return res.status(200).json(
            apiResponse(true, "Login successful", result)
        );
    } catch (error) {
        // Pass to centralized error handler middleware
        next(error);
    }
};

module.exports = {
    register,
    login
};
