/**
 * @file app.js
 * @description Express Application initialization, Middleware setup, and Routing management.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

/**
 * Standard Middlewares
 */
app.use(express.json()); // Allow JSON payloads
app.use(cors());         // Enable Cross-Origin Resource Sharing

/**
 * Basic Health Check Endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Finance Portal API Service is active (v1.0.0)",
    });
});

/**
 * Route Mounting
 */
const authRoutes = require('./routes/auth.routes');
const recordRoutes = require('./routes/record.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const exportRoutes = require('./routes/export.routes');
const { protect } = require('./middleware/auth.middleware');

// All API endpoints are prefixed with /api/v1/
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/export', exportRoutes);

/**
 * Protected Test Route
 * This ensures the JWT verification and identity propagation are working correctly.
 */
app.get('/api/v1/test', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route working correctly. JWT and Auth Middleware verified.',
    user: req.user
  });
});

/**
 * Centralized Error Handling Middleware
 */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "An internal error occurred on the server";
    const errorType = err.name || "SERVER_ERROR";

    console.error(`[Server Error Trace] ${statusCode} - ${message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: errorType // Simplified error type as requested
    });
});

module.exports = app;
