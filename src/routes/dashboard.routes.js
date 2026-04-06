/**
 * @file dashboard.routes.js
 * @description Dashboard Analytics and Summarization routes.
 * Fully protected by JWT and Role-Based Access Control (RBAC).
 */

const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

const router = express.Router();

/**
 * Global Middleware: All routes in this module are protected by JWT.
 */
router.use(protect);

/**
 * @route   GET /api/v1/dashboard/summary
 * @desc    Get aggregated financial KPIs (Income, Expense, Balance)
 * @access  Private (All Roles: Admin, Analyst, Viewer)
 */
router.get('/summary', dashboardController.getSummary);

/**
 * @route   GET /api/v1/dashboard/category
 * @desc    Get category-wise breakdown of transactions
 * @access  Private (Admin, Analyst)
 */
router.get('/category', authorize(['Admin', 'Analyst']), dashboardController.getCategoryTotals);

/**
 * @route   GET /api/v1/dashboard/trends
 * @desc    Get monthly financial trends (Last 6 Months)
 * @access  Private (Admin, Analyst)
 */
router.get('/trends', authorize(['Admin', 'Analyst']), dashboardController.getMonthlyTrends);

/**
 * @route   GET /api/v1/dashboard/recent
 * @desc    Get the most recent financial activity
 * @access  Private (All Roles: Admin, Analyst, Viewer)
 */
router.get('/recent', dashboardController.getRecentTransactions);

module.exports = router;
