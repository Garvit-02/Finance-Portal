/**
 * @file auth.middleware.js
 * @description JWT authentication middleware to protect private routes.
 * Verifies the presence and validity of the Bearer token in the request headers.
 */

const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

/**
 * Middleware: Verify JWT and attach user payload to request.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. If no token, return 401 Unauthorized
    if (!token) {
        return res.status(401).json(
            apiResponse(false, "Access denied: No token provided", null, "UNAUTHORIZED")
        );
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user data to request object
        // Decoded payload typically contains { id, role }
        req.user = decoded;
        
        next();
    } catch (error) {
        // 5. Handle invalid or expired token
        return res.status(401).json(
            apiResponse(false, "Access denied: Invalid or expired token", null, error.name)
        );
    }
};

module.exports = {
    protect
};
