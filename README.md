# Finance Data Processing and Access Control System

A professional high-performance, role-based backend system designed for financial record management, data integrity, and dashboard-ready analytics.

## 📖 1. Project Overview
The **Finance Data Processing and Access Control System** is a secure backend solution for managing personal or business finances. It allows users to track income and expenses while ensuring that data is only accessible to authorized personnel. The system features a centralized dashboard that provides real-time financial insights through advanced data aggregation.

---

## ✨ 2. Features
-   **User Authentication (JWT)**: Secure login and registration using JSON Web Tokens.
-   **Role-Based Access Control (RBAC)**: Fine-grained permissions for **Admin**, **Analyst**, and **Viewer** roles.
-   **Financial Records Management (CRUD)**: Create, Read, Update, and Delete financial transactions.
-   **Filtering and Pagination**: Efficiently browse large datasets with dynamic filters (type, category, date) and paginated results.
-   **Dashboard Summary APIs**: Real-time KPIs including Total Income, Total Expenses, and Net Balance.
-   **MongoDB Aggregation**: Industrial-strength data processing for category breakdowns and monthly trends.
-   **Validation and Error Handling**: Strict data integrity using Joi validation and a centralized error response system.
-   **Clean Architecture**: Modular codebase following the Route-Middleware-Controller-Service-Model pattern.

---

## 🛠️ 3. Tech Stack
-   **Node.js**: Standard cross-platform JavaScript runtime.
-   **Express.js**: Fast, unopinionated, minimalist web framework.
-   **MongoDB**: Document-oriented NoSQL database.
-   **Mongoose**: Elegant mongodb object modeling for node.js.
-   **JWT (jsonwebtoken)**: Secure identity propagation.
-   **Joi**: Powerful schema description language and data validator.

---

## 🗺️ 4. System Architecture
The project follows a linear, decoupled data flow to ensure scalability and ease of testing:

**`Route`** (Endpoint Definition)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
**`Middleware`** (Auth, RBAC, & Validation)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
**`Controller`** (Request parsing & Response logic)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
**`Service`** (Core Business Logic & Workflows)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
**`Model`** (Database Schema & Persistence)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
**`Database`** (MongoDB Storage)

---

## 🚀 5. API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register` - Create a new account.
- `POST /api/v1/auth/login` - Authenticate and receive a JWT.

### Financial Records
- `GET /api/v1/records` - Retrieve filtered transactions.
- `POST /api/v1/records` - Create a new transaction.
- `PUT /api/v1/records/:id` - Update an existing record.
- `DELETE /api/v1/records/:id` - Permanently remove a record (Admin only).

### Dashboard & Analytics
- `GET /api/v1/dashboard/summary` - Total financial KPIs.
- `GET /api/v1/dashboard/category` - Breakdown by category.
- `GET /api/v1/dashboard/trends` - Last 6 months activity.
- `GET /api/v1/dashboard/recent` - Last 5 activities.

---

## 🔐 6. Role Permissions Table

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| **Create Records** | ✅ | ✅ | ❌ |
| **Update Records** | ✅ | ✅ (Own) | ❌ |
| **Delete Records** | ✅ | ❌ | ❌ |
| **Read Records** | ✅ (All) | ✅ (Own) | ✅ (Own) |
| **Analytics** | ✅ (Global) | ✅ (Own) | ✅ (Summary Only) |

---

## 📦 7. Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone <repository_url>
    cd finance-portal
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory (refer to Section 8).
4.  **Start the Server**:
    -   Development: `npm run dev` (uses nodemon)
    -   Production: `npm start`

---

## ⚡ 8. Environment Variables
Create a `.env` file with the following keys:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/finance-portal
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## 📝 9. Assumptions
-   **User Roles**: It is assumed that roles are assigned during registration or by an administrator.
-   **Currency**: All amounts are handled as generic numeric values; currency symbol handling is left to the frontend.
-   **Timezone**: All dates are stored and processed in UTC.

---

## 🔮 10. Future Improvements
-   **Advanced Export**: Expand the CSV export to include PDF and Excel formats.
-   **Interactive Charts**: Integrate a frontend dashboard with Chart.js or Recharts.
-   **Recurring Transactions**: Automated logging for monthly subscriptions/salaries.
-   **Multi-Currency Support**: Integration with external exchange rate APIs.

---

**Developed with Clean Architecture Principles for high reliability and scalability.**
