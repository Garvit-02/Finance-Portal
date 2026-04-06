/**
 * @file export.service.js
 * @description Service for exporting financial data into portable formats (CSV).
 * Leverages @json2csv/plainjs for high-quality CSV generation.
 */

const Record = require('../models/Record');
const { Parser } = require('@json2csv/plainjs');

/**
 * Export filtered financial records to a CSV string.
 * @param {object} user - { id, role } - Current authenticated user
 * @param {object} filters - { type, category, startDate, endDate }
 * @returns {Promise<string>} The generated CSV data
 */
const exportRecordsToCSV = async (user, filters) => {
    const { type, category, startDate, endDate } = filters;

    // 1. Build Query (Logic consistent with record.service.js)
    const query = {};
    if (user.role !== 'Admin') {
        query.userId = user.id;
    }

    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    // 2. Fetch Records (Excluding internal Mongoose fields)
    const records = await Record.find(query)
        .sort({ date: -1 })
        .select('type amount category note date -_id'); // Clean selection for Excel

    if (records.length === 0) {
        throw new Error('No records found for the specified filters.');
    }

    // 3. Transform to CSV
    // We define clean headers for the spreadsheet
    const fields = ['type', 'amount', 'category', 'note', 'date'];
    const opts = { fields };
    const parser = new Parser(opts);
    
    return parser.parse(records);
};

module.exports = {
    exportRecordsToCSV
};
