/**
 * @file audit.middleware.js
 * @description Middleware to automatically log system actions to the Audit Log.
 * Captures user identity, IP address, and resource metadata for security compliance.
 */

const auditService = require('../services/audit.service');

/**
 * Middleware factory for auditing specific actions.
 * @param {string} action - The action type (e.g., 'CREATE_RECORD', 'DELETE_RECORD')
 * @param {string} entity - The entity type (e.g., 'RECORD', 'USER')
 * @returns {Function} Express middleware function
 */
const audit = (action, entity) => {
    return async (req, res, next) => {
        // We move to next middleware first, then log the action asynchronously
        // to avoid blocking the user response.
        next();

        try {
            // 1. Identify User (should be attached by 'protect' middleware)
            const userId = req.user ? req.user.id : null;
            if (!userId && action !== 'LOGIN') return;

            // 2. Capture Metadata
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const entityId = req.params.id || null; // Capture ID from route params if present
            
            // 3. Construct Details (Can be expanded to include body summary)
            const details = `${action} performed on ${entity}`;

            // 4. Log the action
            // Note: If this is a LOGIN action, we might not have req.user yet,
            // so we typically handle LOGIN audit inside the auth service/controller.
            // This middleware is best for CRUD operations on existing records.
            await auditService.logAction({
                userId,
                action,
                entity,
                entityId,
                details,
                ipAddress
            });

        } catch (error) {
            console.error('[Audit Middleware Error]', error.message);
        }
    };
};

module.exports = {
    audit
};
