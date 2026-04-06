/**
 * @file audit.routes.js
 * @description Secure routes for System Auditing logs.
 * Strictly limited to Administrative oversight for security review.
 */

const express = require('express');
const auditController = require('../controllers/audit.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

const router = express.Router();

/**
 * Audit routes are restricted to the Administrative role.
 */
router.get('/', protect, authorize(['Admin']), auditController.getLogs);

module.exports = router;
