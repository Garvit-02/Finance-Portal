# 🗄️ Database Schema Documentation

This document provides a detailed reference for the MongoDB collections used in the **Finance Data Processing and Access Control System**.

---

## 👤 1. Users Collection
This collection stores secure user identities and role assignments.

| Field Name | Data Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated | Unique identifier for each user. |
| `name` | `String` | Required | Full name of the user. |
| `email` | `String` | Required, Unique, Indexed | Primary identity for login. |
| `password` | `String` | Required | Salted and hashed via `bcryptjs`. |
| `role` | `String` | Required, Enum | Permission level: `Admin`, `Analyst`, `Viewer`. |
| `createdAt` | `Date` | Auto-generated | Timestamp of user registration. |
| `updatedAt` | `Date` | Auto-generated | Timestamp of last profile update. |

### 🔗 Relationships:
- **One-to-Many**: A `User` can have multiple `FinancialRecords`.
- **One-to-Many**: A `User` can be the subject of multiple `AuditLogs`.

---

## 💰 2. FinancialRecords Collection
This collection stores transactional data (Income and Expenses).

| Field Name | Data Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated | Unique identifier for each record. |
| `userId` | `ObjectId` (Ref: `User`) | Required, Indexed | The user who owns this financial record. |
| `type` | `String` | Required, Enum | Type of transaction: `Income` or `Expense`. |
| `amount` | `Number` | Required, Min: 0.01 | Total monetary value of the record. |
| `category` | `String` | Required | Classification (e.g., Salary, Rent, Food). |
| `note` | `String` | Optional, Max: 500 | Additional descriptive context. |
| `date` | `Date` | Required, Indexed | The actual date the transaction occurred. |
| `createdAt` | `Date` | Auto-generated | System timestamp of record creation. |
| `updatedAt` | `Date` | Auto-generated | System timestamp of last modification. |

### 🔗 Relationships:
- **Belongs To**: Each `FinancialRecord` is strictly assigned to one `User` through the `userId` field.

---

## 🛡️ 3. AuditLogs Collection
This collection stores immutable activity trails for security auditing.

| Field Name | Data Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated | Unique identifier for the audit event. |
| `userId` | `ObjectId` (Ref: `User`) | Required, Indexed | The user who performed the action. |
| `action` | `String` | Required, Enum | Action type (e.g., `LOGIN`, `RECORD_DELETE`). |
| `resource` | `String` | Required | The model name (e.g., `FinancialRecord`). |
| `resourceId` | `ObjectId` | Optional | The ID of the specific resource modified. |
| `status` | `String` | Enum | `SUCCESS` or `FAILED`. |
| `details` | `Mixed` | Optional | JSON metadata about the change (e.g., modified fields). |
| `timestamp` | `Date` | Required, Indexed | Precise time of the security event. |

### 🔗 Relationships:
- **Reference**: High-level link to `User` and secondary link to any specific business resource via `resourceId`.

---

## ⚡ Indexing Strategy
To ensure high performance at scale, we implement the following compound and single-field indices:
- **Users**: Unique index on `email`.
- **FinancialRecords**: Compound index `{ userId: 1, date: -1 }` for optimized user-specific browsing.
- **AuditLogs**: Compound index `{ userId: 1, timestamp: -1 }` for chronological security analysis.
