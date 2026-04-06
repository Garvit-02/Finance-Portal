/**
 * @file server.js
 * @description Main entry point for the Finance Portal application.
 * Manages server startup, database connection, and system-level error monitoring.
 */

const http = require('http');
const connectDB = require('./src/config/db');
const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

/**
 * Initialize Server-Side Logic
 */
const startServer = async () => {
    try {
        // Connect to Database first
        await connectDB();

        // Create HTTP Server
        const server = http.createServer(app);

        // Start listening
        server.listen(PORT, () => {
            console.log(`[System Info] Server listening in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
        });

        // Monitor for server-level errors
        server.on('error', (err) => {
            console.error(`[Critical Server Error] ${err.message}`);
            process.exit(1);
        });

    } catch (error) {
        console.error(`[System Startup Fatal Error] ${error.message}`);
        process.exit(1);
    }
};

/**
 * Unhandled Exception Monitoring
 */
// Catch any unexpected sync errors
process.on('uncaughtException', (err) => {
    console.error(`[Uncaught Exception] Fata error: ${err.message}`);
    process.exit(1);
});

// Catch any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error(`[Unhandled Rejection] At: ${promise}, reason: ${reason}`);
    process.exit(1);
});

startServer();
