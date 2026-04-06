/**
 * @file export.service.js
 * @description Service for exporting financial data into portable formats (CSV).
 * Leverages @json2csv/plainjs for high-quality CSV generation.
 */

const { Parser } = require('@json2csv/plainjs');

/**
 * Convert an array of financial records into a CSV string.
 * @param {object[]} records - Array of record objects from the database.
 * @returns {string} The generated CSV data.
 */
const exportRecordsToCSV = (records) => {
    // 1. Check for empty input
    if (!records || records.length === 0) {
        return "type,amount,category,note,date"; // Return header only
    }

    // 2. Define target fields for the spreadsheet
    const fields = ['type', 'amount', 'category', 'note', 'date'];
    const opts = { fields };
    
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(records);
        return csv;
    } catch (err) {
        console.error('[ExportService Error] Failed to parse CSV:', err.message);
        throw new Error('An error occurred while generating the CSV report.');
    }
};

module.exports = {
    exportRecordsToCSV
};
