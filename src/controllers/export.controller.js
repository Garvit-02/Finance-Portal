/**
 * @file export.controller.js
 * @description Controller for Handling Data Export requests.
 * Manages the response stream for large CSV downloads.
 */

const exportService = require('../services/export.service');
const apiResponse = require('../utils/apiResponse');

/**
 * Handle CSV Export request.
 */
const exportCSV = async (req, res, next) => {
    try {
        const user = req.user;
        const { type, category, startDate, endDate } = req.query;

        // 1. Generate CSV
        const csv = await exportService.exportRecordsToCSV(user, { type, category, startDate, endDate });

        // 2. Set Response Headers for Download
        const filename = `finance_report_${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // 3. Stream the result directly to the response
        return res.status(200).send(csv);
    } catch (error) {
        // If it's a "No records found" error, we return a 404 with standard API format
        if (error.message === 'No records found for the specified filters.') {
            return res.status(404).json(
                apiResponse(false, error.message, null, "NOT_FOUND")
            );
        }
        next(error);
    }
};

module.exports = {
    exportCSV
};
