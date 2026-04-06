/**
 * @file record.controller.js
 * @description Controller for Financial Records management.
 * Connects the HTTP request layer to the record service and standardizes responses.
 */

const recordService = require('../services/record.service');
const apiResponse = require('../utils/apiResponse');

/**
 * Create a new record.
 */
const createRecord = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recordData = req.body;
        
        const record = await recordService.createRecord(userId, recordData);

        return res.status(201).json(
            apiResponse(true, "Financial record created successfully", record)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get all records with filtering and pagination.
 */
const getRecords = async (req, res, next) => {
    try {
        const user = req.user; // { id, role }
        const { type, category, startDate, endDate, page, limit } = req.query;

        const result = await recordService.getRecords(
            user,
            { type, category, startDate, endDate },
            { page, limit }
        );

        return res.status(200).json(
            apiResponse(true, "Records retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update an existing record.
 */
const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const updateData = req.body;

        const record = await recordService.updateRecord(id, user, updateData);

        return res.status(200).json(
            apiResponse(true, "Record updated successfully", record)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a record.
 */
const deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const result = await recordService.deleteRecord(id, user);

        return res.status(200).json(
            apiResponse(true, "Record deleted successfully", result)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
};
