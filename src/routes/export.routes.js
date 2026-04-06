/**
 * @file export.routes.js
 * @description Secure routes for Data Export functionality.
 * Optimized for spreadsheet and analytical reporting.
 */

const express = require('express');
const exportController = require('../controllers/export.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * All routes in this module are protected by JWT.
 */
router.use(protect);

/**
 * @route   GET /api/v1/export/csv
 * @desc    Export financial records to a downloadable CSV file
 * @access  Private
 */
router.get('/csv', exportController.exportCSV);

module.exports = router;
