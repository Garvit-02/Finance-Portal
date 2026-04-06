/**
 * @file record.validation.js
 * @description Joi validation schemas for financial records.
 * Ensures data integrity for Incoming/Outgoing transactions.
 */

const Joi = require('joi');

/**
 * Validation schema for creating a new financial record.
 */
const createRecordValidation = Joi.object({
    type: Joi.string()
        .valid('Income', 'Expense')
        .required()
        .messages({
            'any.only': 'Type must be either Income or Expense',
            'any.required': 'Record type is required'
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.positive': 'Amount must be a positive number',
            'any.required': 'Amount is required'
        }),

    category: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Category is required'
        }),

    note: Joi.string()
        .allow('')
        .max(255),

    date: Joi.date()
        .messages({
            'date.base': 'Please provide a valid date'
        })
});

/**
 * Validation schema for updating an existing financial record.
 */
const updateRecordValidation = Joi.object({
    amount: Joi.number()
        .positive()
        .messages({
            'number.positive': 'Amount must be a positive number'
        }),

    category: Joi.string()
        .trim(),

    note: Joi.string()
        .allow('')
        .max(255),

    date: Joi.date()
        .messages({
            'date.base': 'Please provide a valid date'
        })
});

module.exports = {
    createRecordValidation,
    updateRecordValidation
};
