/**
 * @file audit.service.js
 * @description Internal service for logging system-wide activity and security events.
 * Provides a standardized way to persist audit trails across the application.
 */

const AuditLog = require('../models/AuditLog');

/**
 * Persist an audit log entry to the database.
 * @param {object} params - { userId, action, entity, entityId, details, ipAddress }
 * @returns {Promise<object>} The saved audit log entry.
 */
const logAction = async ({ userId, action, entity, entityId, details, ipAddress }) => {
    try {
        const auditEntry = new AuditLog({
            userId,
            action,
            entity,
            entityId,
            details: details || '',
            ipAddress: ipAddress || 'Unknown'
        });

        const savedEntry = await auditEntry.save();
        
        // Log to console in development environment
        if (process.env.NODE_ENV === 'development') {
            console.log(`[AuditLog] ${action} - ${entity} (User: ${userId})`);
        }

        return savedEntry;
    } catch (error) {
        // We log the failure but do not throw, as auditing should be non-blocking
        console.error('[AuditService Error] Failed to persist audit log:', error.message);
        return null;
    }
};

/**
 * Retrieve all audit log entries, sorted by most recent.
 * @returns {Promise<object[]>} List of audit logs.
 */
const getAuditLogs = async () => {
    return await AuditLog.find()
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
};

module.exports = {
    logAction,
    getAuditLogs
};
