/**
 * @file AuditLog.js
 * @description Mongoose schema for tracking system-wide activity and security events.
 * Records sensitive actions like record creation, updates, and login events.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for an audit entry'],
        index: true
    },
    action: {
        type: String,
        required: [true, 'Action type is required'],
        enum: ['CREATE_RECORD', 'UPDATE_RECORD', 'DELETE_RECORD', 'LOGIN']
    },
    entity: {
        type: String,
        required: [true, 'Entity name is required'],
        enum: ['RECORD', 'USER']
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    details: {
        type: String,
        required: false,
        default: ''
    },
    ipAddress: {
        type: String,
        required: false,
        default: 'Unknown'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false, // We use custom 'createdAt' for immutability
    versionKey: false
});

// Optimization: Chronological indexing for performance audits
auditLogSchema.index({ userId: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
