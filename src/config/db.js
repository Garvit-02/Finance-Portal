/**
 * @file db.js
 * @description MongoDB connection configuration using Mongoose.
 * This file handles the establishment and monitoring of the database connection.
 */

const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB and set up event listeners for the connection lifecycle.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events for continuous monitoring
        mongoose.connection.on('error', (err) => {
            console.error(`[Database Error] ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('[Database Attention] MongoDB disconnected');
        });

    } catch (error) {
        console.error(`[Critical Execution Error] MongoDB connection failed: ${error.message}`);
        // Exit process with failure code if initial connection fails
        process.exit(1);
    }
};

// Graceful shutdown: Close MongoDB connection on app termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('[System Information] MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = connectDB;
