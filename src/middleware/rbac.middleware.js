/**
 * @file rbac.middleware.js
 * @description Role-Based Access Control (RBAC) middleware for authorization.
 * Limits access to specific routes based on the role assigned to the authenticated user.
 */

const apiResponse = require('../utils/apiResponse');

/**
 * Middleware: Authorize access based on user role.
 * @param {string[]} allowedRoles - Array of roles permitted to access the route (e.g., ['Admin', 'Analyst'])
 * @returns {Function} Express middleware function
 */
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // 1. Double check if user exists (should be attached by 'protect' middleware)
        if (!req.user || !req.user.role) {
            return res.status(401).json(
                apiResponse(false, "Unauthorized: Identity not verified", null, "UNAUTHORIZED")
            );
        }

        // 2. Check if the user's role is in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(
                apiResponse(false, `Access denied: Role '${req.user.role}' is not authorized for this action`, null, "FORBIDDEN")
            );
        }

        // 3. Permitted: proceed to the next middleware/controller
        next();
    };
};

module.exports = {
    authorize
};
