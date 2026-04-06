/**
 * @file export.controller.js
 * @description Controller for the CSV data portability feature.
 * Generates and streams downloadable financial reports for the user.
 */

const recordService = require('../services/record.service');
const exportService = require('../services/export.service');

/**
 * Handle CSV export request.
 * 1. Fetch records based on user identity and filters.
 * 2. Convert raw data to CSV format via export service.
 * 3. Stream the file as a download response.
 */
const exportRecords = async (req, res, next) => {
    try {
        const user = req.user; // { id, role }
        const { type, category, startDate, endDate } = req.query;

        // 1. Get user records from database
        // We fetch up to 1000 records for the export report
        const result = await recordService.getRecords(
            user,
            { type, category, startDate, endDate },
            { page: 1, limit: 1000 }
        );

        const records = result.records;

        if (!records || records.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No financial records found to export.",
                error: "NOT_FOUND"
            });
        }

        // 2. Convert to CSV using export service
        const csv = exportService.exportRecordsToCSV(records);

        // 3. Send file as download response
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="records.csv"');

        return res.status(200).send(csv);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    exportRecords
};
