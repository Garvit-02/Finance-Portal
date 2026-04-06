# 🔐 Roles and Permissions Documentation

This document defines the **Role-Based Access Control (RBAC)** policies for the Finance Data Processing and Access Control System.

---

## 👥 1. Role Definitions

### 👑 Admin (Administrator)
The highest privilege level. Admins have complete oversight of the entire system, including data created by other users. They are the only ones permitted to perform destructive actions (deletions).

### 🛠️ Analyst (Contributor)
The primary data entry role. Analysts can create and manage their own financial records. They have access to advanced analytics but cannot modify or see other users' private data or delete any records.

### 👁️ Viewer (Auditor/Guest)
The most restricted role. Viewers can only browse data that they have been given access to (or their own records if they have them). They have access to basic dashboard summaries but cannot perform any data entry or modifications.

---

## 📊 2. Permissions Matrix

The following table outlines the specific permissions assigned to each role across the core modules:

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| **Create Record** | ✅ Full | ✅ Full | ❌ No Access |
| **Read Record** | ✅ All Data | ✅ Own Only | ✅ Own Only |
| **Update Record** | ✅ All Data | ✅ Own Only | ❌ No Access |
| **Delete Record** | ✅ All Data | ❌ No Access | ❌ No Access |
| **Dashboard Summary** | ✅ Global | ✅ Personal | ✅ Personal |
| **Advanced Trends** | ✅ Global | ✅ Personal | ❌ No Access |
| **Data Export (CSV)** | ✅ Global | ✅ Personal | ❌ No Access |

---

## ⚙️ 3. Enforcement Mechanism
Permissions are enforced at two distinct levels to ensure maximum security:

### Level 1: Route Authorization (RBAC Middleware)
The `authorize` middleware intercepts requests at the router level and rejects unauthorized roles with a **403 Forbidden** status before the request reaches the controller.

### Level 2: Data Isolation (Service Layer)
The `record.service.js` automatically filters queries based on the `userId` in the JWT payload. 
- If the role is **Admin**: The `userId` filter is bypassed.
- If the role is **Analyst** or **Viewer**: Every query is strictly scoped to `userId = req.user.id`.

This "Defense in Depth" strategy ensures that even if a route were misconfigured, data isolation would remain intact.
