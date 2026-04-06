/**
 * @file record.routes.js
 * @description Secure routes for Financial Records management.
 * Orchestrates CRUD operations with Joi validation and Role-Based Access Control (RBAC).
 */

const express = require('express');
const recordController = require('../controllers/record.controller');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { createRecordValidation, updateRecordValidation } = require('../validations/record.validation');

const router = express.Router();

/**
 * Global Middleware: All routes in this module require a valid JWT.
 */
router.use(protect);

/**
 * @route   POST /api/v1/records
 * @desc    Create a new transaction
 * @access  Private (Admin, Analyst)
 */
router.post(
    '/', 
    authorize(['Admin', 'Analyst']), 
    validate(createRecordValidation), 
    recordController.createRecord
);

/**
 * @route   GET /api/v1/records
 * @desc    Get filtered and paginated records for the current user
 * @access  Private (All Roles: Admin, Analyst, Viewer)
 */
router.get('/', recordController.getRecords);

/**
 * @route   PUT /api/v1/records/:id
 * @desc    Update an existing record
 * @access  Private (Admin, Analyst)
 */
router.put(
    '/:id', 
    authorize(['Admin', 'Analyst']), 
    validate(updateRecordValidation), 
    recordController.updateRecord
);

/**
 * @route   DELETE /api/v1/records/:id
 * @desc    Remove a record
 * @access  Private (Admin only)
 */
router.delete(
    '/:id', 
    authorize(['Admin']), 
    recordController.deleteRecord
);

module.exports = router;
