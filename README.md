# Finance Data Processing and Access Control System

## 1. Project Title

Finance Data Processing and Access Control System

## 2. Project Overview

The Finance Data Processing and Access Control System is a robust backend API designed to securely manage financial records and provide analytical insights. The system accomplishes the following:

- **Manage Financial Records:** Full CRUD (Create, Read, Update, Delete) support for tracking income and expense transactions.
- **Role-Based Access Control (RBAC):** Strict access levels defining operational capabilities. Admins have complete system oversight, Analysts manage their own data and view analytics, and Viewers have read-only access to dashboard insights.
- **Dashboard Analytics:** High-performance data aggregation delivering real-time metrics including total income, total expense, net balance, category totals, monthly trends, and recent transactions.
- **Clean Architecture:** Built with a maintainable Controller → Service → Model (CSM) design pattern, ensuring separation of business logic, request handling, and data mapping.

## 3. Tech Stack

- **Node.js**: JavaScript runtime environment for backend logic.
- **Express.js**: Minimalist web framework for routing and middleware.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JWT Authentication**: Secure stateless user sessions.
- **Joi Validation**: Schema description language for payload validation.
- **Postman**: API development and testing framework.

*Note: Security middlewares such as Helmet, Express Rate Limit, Mongo Sanitize, and XSS Clean are also configured for enterprise readiness.*

## 4. System Architecture

The application implements a **Clean Architecture** allowing strict decoupling of concerns.

**Request Flow:**
`Route → Middleware → Controller → Service → Model → Database`

1. **Route:** Directs the endpoint to the correct controller.
2. **Middleware:** Handles JWT Authentication, RBAC, Data Validation (Joi), and Security headers before reaching the controller.
3. **Controller:** Extracts the request payload (`req.body`, `req.user`, `req.params`) and passes the data to the Service.
4. **Service:** Executes core business logic and data manipulation.
5. **Model:** Interacts with the database using Mongoose schemas.
6. **Database:** Executes the final MongoDB operations.

## 5. Database Schema

### Users Collection
Tracks the identity and access privileges of system users.
- `name` (String): Full name of the user.
- `email` (String, Unique): Contact email, used for login.
- `password` (String): Hashed securely using `bcryptjs`.
- `role` (String): Enumerated access level (`Admin`, `Analyst`, `Viewer`).

### Financial Records Collection
Stores all income and expense transaction data.
- `userId` (ObjectId, ref 'User'): Establishes the owner of the record.
- `type` (String): Transaction type (`Income`, `Expense`).
- `amount` (Number): Financial value of the transaction.
- `category` (String): Classification of the transaction (e.g., `Salary`, `Food`, `Rent`).
- `note` (String, Optional): Additional context for the record.
- `date` (Date): The date the transaction occurred (Defaults to current date).

*Note: The `AuditLog` collection also exists to track system-wide events.*

## 6. Role-Based Access Control

The RBAC implementation ensures principle of least privilege:

- **Admin:** Full access. Can create, read, update, and delete any user's records. Can view global dashboard analytics and system security audit logs.
- **Analyst:** Read records + dashboard. Can create, read, and update strictly their *own* financial records. Can view their own personalized dashboard analytics.
- **Viewer:** Only dashboard. Can view their personalized dashboard analytics and their own records if present, but cannot create, update, or delete any data.

## 7. API Endpoints

### Auth
- `POST /api/v1/auth/register` - Create a new user.
- `POST /api/v1/auth/login` - Authenticate and receive a JWT.

### Records
- `POST /api/v1/records` - Create a new financial record.
- `GET /api/v1/records` - Retrieve paginated and filtered records.
- `PUT /api/v1/records/:id` - Update an existing record.
- `DELETE /api/v1/records/:id` - Delete a financial record.

### Dashboard
- `GET /api/v1/dashboard/summary` - Get total income, expense, and net balance.
- `GET /api/v1/dashboard/category` - Get sub-totals grouped by category.
- `GET /api/v1/dashboard/trends` - Get monthly aggregation over the last 6 months.
- `GET /api/v1/dashboard/recent` - Fetch the 5 most recent transactions.

*(Additional endpoints exist for System Auditing and CSV Export.)*

## 8. Setup Instructions

Steps to run the project locally:

1. Clone the repository and navigate into the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (use `.env.example` as a template).
4. Start the application in development mode:
   ```bash
   npm run dev
   ```

## 9. Environment Variables

Configure the following variables in your `.env` file:

- `PORT` - The port number for the server (e.g., 5001).
- `MONGO_URI` - Your MongoDB connection string.
- `JWT_SECRET` - A strong secret key used for signing JWT tokens.

## 10. Postman Collection

A robust, pre-configured Postman collection is included in the project for seamless API testing. 

You can find the collection file here:
`tests/Finance-API.postman_collection.json`

Import this file into your Postman workspace to begin testing immediately. Variables like `token` are automatically populated by the Login request's test scripts.

## 11. Folder Structure

```text
finance-portal/
├── config/              # Database connection setup
├── docs/                # Detailed markdown documentation
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, RBAC, Validation & Security
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── services/        # Core business logic
│   ├── utils/           # Helper functions & API responses
│   ├── validations/     # Joi validation schemas
│   └── app.js           # Express App instantiation
├── tests/               # Postman API collections
├── .env.example         # Environment variable template
├── .gitignore           # Ignored files
├── package.json         # Project dependencies
├── README.md            # You are here
└── server.js            # Server entry point
```

## 12. Assumptions

- **Role Inheritance**: Assume roles are strictly segregated instead of inheriting. An Analyst cannot do everything an Admin can do, they are restricted to their own isolated data scope.
- **Dashboard Calculations**: The Net Balance calculation implicitly assumes that all `Income` amounts are positive inflows and all `Expense` amounts are positive outflows, calculating Net Balance as `(Total Income - Total Expense)`.
- **Date Filtering**: All dashboard analytics (except where strictly monthly) and record fetching assume standard ISODate formats for precise filtering.

## 13. Author

**Garvit Gupta**
