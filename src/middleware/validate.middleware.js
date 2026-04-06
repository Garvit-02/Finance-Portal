/**
 * @file validate.middleware.js
 * @description Generic validation middleware to apply Joi schemas.
 */

const apiResponse = require('../utils/apiResponse');

/**
 * Middleware: Validate request body against a Joi schema.
 * Replaced the user's manual validation with a robust version.
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(
            apiResponse(false, 'Validation Error', null, errorMessage)
        );
    }
    // Correctly proceed to the next middleware or controller
    next();
};

module.exports = validate;