/**
 * @file security.middleware.js
 * @description Centralized security middleware to harden the application against common web attacks.
 * Includes: Rate Limiting, NoSQL Injection Protection, XSS Cleaning, and Secure HTTP Headers.
 */

const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/**
 * 1. Rate Limiting: 100 requests per 15 minutes per IP.
 * Prevents brute-force and DoS (Denial of Service) attacks.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes.",
        error: "RATE_LIMIT_EXCEEDED"
    }
});

/**
 * 2. Helmet: Sets various security-related HTTP headers.
 * Protects against well-known web vulnerabilities (e.g. Clickjacking, MIME sniffing).
 */
const securityHeaders = helmet();

/**
 * 3. Mongo Sanitize: Prevents NoSQL Injection.
 * Sanitizes user-supplied data to prevent MongoDB operator injection ($gt, $ne, etc).
 */
const nosqlInjection = mongoSanitize();

/**
 * 4. XSS Clean: Protects against Cross-Site Scripting.
 * Sanitizes all user-supplied input (req.body, req.query, req.params).
 */
const xssProtection = xss();

/**
 * Combine all security middlewares for easy integration in app.js
 */
const securityMiddleware = [
    limiter,
    securityHeaders,
    nosqlInjection,
    xssProtection
];

module.exports = securityMiddleware;
