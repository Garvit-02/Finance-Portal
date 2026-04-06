/**
 * @file dashboard.controller.js
 * @description Controller for the Financial Dashboard Analytics.
 * Connects the HTTP request layer to the specific dashboard analytics services.
 */

const dashboardService = require('../services/dashboard.service');
const apiResponse = require('../utils/apiResponse');

/**
 * Get aggregated financial summary (KPIs).
 */
const getSummary = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await dashboardService.getSummary(user);

        return res.status(200).json(
            apiResponse(true, "Dashboard summary fetched", result)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get category-wise breakdown of spending and income.
 */
const getCategoryTotals = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await dashboardService.getCategoryTotals(user);

        return res.status(200).json(
            apiResponse(true, "Category totals retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get monthly trends for the last 6 months.
 */
const getMonthlyTrends = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await dashboardService.getMonthlyTrends(user);

        return res.status(200).json(
            apiResponse(true, "Monthly trends retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get the most recent 5 transactions.
 */
const getRecentTransactions = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await dashboardService.getRecentTransactions(user);

        return res.status(200).json(
            apiResponse(true, "Recent transactions retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentTransactions
};
