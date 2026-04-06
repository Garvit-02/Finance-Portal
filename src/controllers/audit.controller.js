/**
 * @file audit.controller.js
 * @description Controller for security and system activity auditing.
 * Restricts access to sensitive audit trails to Administrative roles.
 */

const auditService = require('../services/audit.service');
const apiResponse = require('../utils/apiResponse');

/**
 * Fetch all audit logs for system review.
 */
const getLogs = async (req, res, next) => {
    try {
        const logs = await auditService.getAuditLogs();
        
        return res.status(200).json(
            apiResponse(true, "System audit logs retrieved successfully", logs)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLogs
};
