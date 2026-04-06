/**
 * @file AuditLog.js
 * @description Mongoose schema for Tracking system-wide activity.
 * Records sensitive actions (Login, Create, Update, Delete) for security and compliance.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for an audit log'],
        index: true
    },
    action: {
        type: String,
        required: [true, 'Action type is required (e.g., LOGIN, RECORD_CREATE)'],
        enum: [
            'LOGIN', 
            'LOGOUT', 
            'REGISTER', 
            'RECORD_CREATE', 
            'RECORD_UPDATE', 
            'RECORD_DELETE',
            'SENSITIVE_DATA_ACCESS'
        ]
    },
    resource: {
        type: String,
        required: [true, 'Resource name is required (e.g., FinancialRecord, User)']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED'],
        default: 'SUCCESS'
    },
    ipAddress: {
        type: String,
        default: 'Unknown'
    },
    userAgent: {
        type: String,
        default: 'Unknown'
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Stores JSON-like metadata about the change
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false, // We use a custom 'timestamp' field
    versionKey: false
});

// Optimization: Indexing for chronological system analysis per user
auditLogSchema.index({ userId: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
