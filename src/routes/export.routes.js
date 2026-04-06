/**
 * @file export.routes.js
 * @description Secure routes for Data Export functionality.
 * Optimized for spreadsheet and analytical reporting.
 */

const express = require('express');
const exportController = require('../controllers/export.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

const router = express.Router();

/**
 * All routes in this module are protected by JWT.
 */
router.use(protect);

/**
 * @route   GET /api/v1/export/records
 * @desc    Export financial records to a downloadable CSV file
 * @access  Private (Admin, Analyst)
 */
const exportHandler = exportController.exportRecords;
if (!exportHandler) {
    throw new Error('[Critical] exportController.exportRecords is undefined in export.routes.js');
}

router.get('/records', authorize(['Admin', 'Analyst']), exportHandler);

module.exports = router;
