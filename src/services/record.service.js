/**
 * @file record.service.js
 * @description Business logic layer for Financial Records (CRUD, Filtering, and Pagination).
 * Handles user-specific data access and administrative overrides.
 */

const Record = require('../models/Record');
const auditService = require('./audit.service');

/**
 * Create a new financial record.
 * @param {string} userId - ID of the creating user.
 * @param {object} recordData - { type, amount, category, note, date }
 * @returns {Promise<object>} The saved record.
 */
const createRecord = async (userId, recordData) => {
    const record = new Record({
        ...recordData,
        userId
    });

    const savedRecord = await record.save();

    // Log Action
    auditService.logAction({
        userId,
        action: 'CREATE_RECORD',
        entity: 'RECORD',
        entityId: savedRecord._id,
        details: `Created ${savedRecord.type}: ${savedRecord.amount}`
    });

    return savedRecord;
};

/**
 * Retrieve filtered and paginated records for a specific user (or all if Admin).
 * @param {object} user - { id, role } - Current authenticated user
 * @param {object} filters - { type, category, startDate, endDate }
 * @param {object} pagination - { page, limit }
 * @returns {Promise<object>} List of records and total count
 */
const getRecords = async (user, filters, pagination) => {
    const { type, category, startDate, endDate } = filters;
    const { page = 1, limit = 10 } = pagination;

    // 1. Build Query Object
    const query = {};

    // RBAC: If not Admin, user can only see their own records
    if (user.role !== 'Admin') {
        query.userId = user.id;
    }

    // Dynamic Filtering
    if (type) query.type = type;
    if (category) query.category = category;
    
    // Date Range Filtering
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    // 2. Execute Query with Pagination and Sorting
    const skip = (page - 1) * limit;
    
    const records = await Record.find(query)
        .sort({ date: -1 }) // Newest first
        .skip(skip)
        .limit(Number(limit));

    const total = await Record.countDocuments(query);

    return {
        records,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Update an existing record with Role-Based Access Control (RBAC).
 * @param {string} recordId - ID of the record to update.
 * @param {object} user - { id, role } - Current authenticated user.
 * @param {object} updateData - Partial update fields.
 * @returns {Promise<object>} The updated record.
 */
const updateRecord = async (recordId, user, updateData) => {
    // 1. Find record to check ownership
    const record = await Record.findById(recordId);
    
    if (!record) {
        const error = new Error('Financial record not found');
        error.statusCode = 404;
        throw error;
    }

    // 2. Authorization: 
    // - Admin can update anything.
    // - Analyst can only update their own record.
    // - Viewer can NEVER update (implicit by failing these checks).
    const isAdmin = user.role === 'Admin';
    const isAnalystOwner = user.role === 'Analyst' && record.userId.toString() === user.id;

    if (!isAdmin && !isAnalystOwner) {
        const error = new Error('Access denied: Higher privileges or ownership required to update records');
        error.statusCode = 403;
        throw error;
    }

    // 3. Perform the update and return the new document with validations
    const updatedRecord = await Record.findByIdAndUpdate(recordId, updateData, { new: true, runValidators: true });

    // Log Action
    auditService.logAction({
        userId: user.id,
        action: 'UPDATE_RECORD',
        entity: 'RECORD',
        entityId: recordId,
        details: `Updated fields: ${Object.keys(updateData).join(', ')}`
    });

    return updatedRecord;
};

/**
 * Delete a record with strict Administrative oversight.
 * @param {string} recordId - ID of the record to delete.
 * @param {object} user - { id, role } - Current authenticated user.
 * @returns {Promise<object>} The deleted record summary.
 */
const deleteRecord = async (recordId, user) => {
    // 1. Find record to ensure it exists
    const record = await Record.findById(recordId);

    if (!record) {
        const error = new Error('Financial record not found');
        error.statusCode = 404;
        throw error;
    }

    // 2. Authorization: ONLY Admin can delete records
    if (user.role !== 'Admin') {
        const error = new Error('Access denied: Administrative privileges required to delete records');
        error.statusCode = 403;
        throw error;
    }

    // 3. Perform the deletion
    await record.deleteOne();

    // Log Action
    auditService.logAction({
        userId: user.id,
        action: 'DELETE_RECORD',
        entity: 'RECORD',
        entityId: recordId,
        details: `Deleted ${record.type} record of ${record.amount}`
    });

    return { 
        success: true,
        message: "Financial record permanently removed by Administrator",
        id: recordId 
    };
};

module.exports = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
};
