/**
 * @file auditLogger.js
 * @description Centralized utility for recording security and operational audits.
 * Decouples the business logic from the logging overhead.
 */

const AuditLog = require('../models/AuditLog');

/**
 * Log a system event asynchronously.
 * @param {object} params - { userId, action, resource, resourceId, status, details, req }
 */
const logEvent = async ({ userId, action, resource, resourceId = null, status = 'SUCCESS', details = {}, req = null }) => {
    try {
        const auditData = {
            userId,
            action,
            resource,
            resourceId,
            status,
            details
        };

        // 1. Enrich with Request context (if provided)
        if (req) {
            auditData.ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
            auditData.userAgent = req.headers['user-agent'] || 'Unknown';
        }

        // 2. Persist to MongoDB (Non-blocking: we don't 'await' it if performance is critical, 
        //    but here we await for ensure integrity in this development phase).
        await AuditLog.create(auditData);
    } catch (error) {
        // We log the failure to console but don't crash the main process
        console.error(`[CRITICAL] Audit logging failed for ${action}:`, error.message);
    }
};

module.exports = {
    logEvent
};
