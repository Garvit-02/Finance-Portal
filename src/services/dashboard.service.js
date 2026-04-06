/**
 * @file dashboard.service.js
 * @description Analytics service for generating financial summaries.
 * Uses MongoDB Aggregation Pipelines for high-performance calculations.
 */

const Record = require('../models/Record');
const mongoose = require('mongoose');

/**
 * Get aggregated financial summary (KPIs).
 * @param {object} user - { id, role } - Current authenticated user
 * @returns {Promise<object>} { totalIncome, totalExpense, netBalance }
 */
const getSummary = async (user) => {
    const query = {};

    // 1. RBAC Logic: 
    // - If Admin: No userId filter (calculate for all records)
    // - Else: Filter by userId (calculate for self only)
    if (user.role !== 'Admin') {
        query.userId = new mongoose.Types.ObjectId(user.id);
    }

    // 2. Aggregation Pipeline
    const stats = await Record.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' }
            }
        }
    ]);

    // 3. Transform Aggregation Result to specified Format
    let totalIncome = 0;
    let totalExpense = 0;

    stats.forEach((item) => {
        if (item._id === 'Income') totalIncome = item.total;
        if (item._id === 'Expense') totalExpense = item.total;
    });

    const netBalance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        netBalance
    };
};

/**
 * Get category-wise breakdown of financial records.
 * @param {object} user - { id, role } - Current authenticated user
 * @returns {Promise<object[]>} Array of { category, total, type }
 */
const getCategoryTotals = async (user) => {
    const query = {};

    // 1. RBAC Logic: 
    // - If Admin: No userId filter
    // - Else: Filter by userId
    if (user.role !== 'Admin') {
        query.userId = new mongoose.Types.ObjectId(user.id);
    }

    // 2. Aggregation Pipeline
    const categoryTotals = await Record.aggregate([
        { $match: query },
        {
            $group: {
                _id: { category: '$category', type: '$type' },
                total: { $sum: '$amount' }
            }
        },
        { 
            $project: {
                _id: 0,
                category: '$_id.category',
                type: '$_id.type',
                total: 1
            } 
        },
        { $sort: { total: -1 } }
    ]);

    return categoryTotals;
};

/**
 * Get monthly trends for financial records (Last 6 Months).
 * @param {object} user - { id, role } - Current authenticated user
 * @returns {Promise<object[]>} Array of { year, month, totalIncome, totalExpense }
 */
const getMonthlyTrends = async (user) => {
    const query = {};

    // 1. RBAC Logic
    if (user.role !== 'Admin') {
        query.userId = new mongoose.Types.ObjectId(user.id);
    }

    // 2. Filter for last 6 months to keep trends relevant
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    query.date = { $gte: sixMonthsAgo };

    // 3. Aggregation Pipeline
    const trends = await Record.aggregate([
        { $match: query },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $group: {
                _id: {
                    year: '$_id.year',
                    month: '$_id.month'
                },
                income: {
                    $sum: {
                        $cond: [{ $eq: ["$_id.type", "Income"] }, "$total", 0]
                    }
                },
                expense: {
                    $sum: {
                        $cond: [{ $eq: ["$_id.type", "Expense"] }, "$total", 0]
                    }
                }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                totalIncome: '$income',
                totalExpense: '$expense'
            }
        }
    ]);

    return trends;
};

/**
 * Get recent transactions.
 * @param {object} user - { id, role } - Current authenticated user
 * @returns {Promise<object[]>} Last 5 records
 */
const getRecentTransactions = async (user) => {
    const query = {};

    // 1. RBAC Logic
    if (user.role !== 'Admin') {
        query.userId = user.id;
    }

    // 2. Mongoose Query: Sort by date descending and limit to 5
    const recent = await Record.find(query)
        .sort({ date: -1 })
        .limit(5);

    return recent;
};

/**
 * Get comprehensive dashboard breakdown (Categories and Trends).
 * @param {string} userId - ID of the user.
 * @returns {Promise<object>} { categoryBreakdown, monthlyTrends }
 */
const getDashboardBreakdown = async (userId) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Category-wise Breakdown (Current Year)
    const currentYear = new Date().getFullYear();
    const categoryBreakdown = await Record.aggregate([
        { 
            $match: { 
                userId: userObjectId,
                date: { $gte: new Date(`${currentYear}-01-01`) }
            } 
        },
        {
            $group: {
                _id: { category: '$category', type: '$type' },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { total: -1 } }
    ]);

    // Monthly Trends (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Record.aggregate([
        {
            $match: {
                userId: userObjectId,
                date: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return {
        categoryBreakdown,
        monthlyTrends
    };
};

module.exports = {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentTransactions,
    getDashboardBreakdown
};
