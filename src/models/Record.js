/**
 * @file Record.js
 * @description Mongoose schema for Financial Records (Income and Expenses).
 * Includes user attribution, categorization, and optimized indexing for historical queries.
 */

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for a financial record'],
        index: true // Essential for faster analytical queries per user
    },
    type: {
        type: String,
        required: [true, 'Transaction type is required'],
        enum: {
            values: ['Income', 'Expense'],
            message: '{VALUE} is not a valid transaction type'
        }
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        // Categories can be e.g. Salary, Rent, Groceries, Food, Travel, Entertainment, etc.
    },
    note: {
        type: String,
        trim: true,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Transaction date is required']
    }
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false
});

/**
 * Compound Index: userId and date
 * Optimization: Ensures that historical reports and dashboard aggregates are Magically fast.
 */
recordSchema.index({ userId: 1, date: -1 });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
