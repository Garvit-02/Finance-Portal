/**
 * @file apiResponse.js
 * @description Utility for standardizing all API response outputs.
 * This ensures consistency across all controllers and makes frontend integration predictable.
 */

/**
 * Standardize API Response Structure
 * @param {boolean} success - Indicates if the request was successful
 * @param {string} message - A human-readable summary of the operation
 * @param {object} data - Any data returned from the service/database
 * @param {string} error - Error string/code (e.g., "UNAUTHORIZED")
 * @returns {object} Standardized JSON structure
 */
const apiResponse = (success, message = "", data = null, error = null) => {
    // If it's a success response, include data as well
    if (success) {
        return {
            success,
            message,
            data
        };
    }

    // If it's an error response, return the specific format requested: { success, message, error }
    return {
        success,
        message,
        error: error || "SERVER_ERROR"
    };
};

/**
 * Usage in Controllers:
 * 
 * try {
 *     const user = await userService.getUser(id);
 *     return res.status(200).json(apiResponse(true, "User data retrieved successfully", user));
 * } catch (error) {
 *     return res.status(400).json(apiResponse(false, error.message, null, error));
 * }
 */

module.exports = apiResponse;
