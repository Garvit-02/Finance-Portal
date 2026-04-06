# 📖 Finance Portal API Documentation

This document provides a comprehensive technical reference for the Finance Data Processing and Access Control Backend.

## 🔓 1. Authentication Module
Manage user accounts and identity propagation.

### ➕ Register User
- **Endpoint**: `/api/v1/auth/register`
- **Method**: `POST`
- **Description**: Creates a new user in the system.
- **Access Role**: `Public`
- **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securePassword123",
      "role": "Analyst" 
    }
    ```
- **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": { "id": "...", "name": "...", "email": "...", "role": "..." }
    }
    ```

### 🔑 Login User
- **Endpoint**: `/api/v1/auth/login`
- **Method**: `POST`
- **Description**: Authenticates user and returns a JWT token.
- **Access Role**: `Public`
- **Request Body**:
    ```json
    {
      "email": "jane@example.com",
      "password": "securePassword123"
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": { "token": "...", "user": { ... } }
    }
    ```

---

## 📝 2. Financial Records Module
Standardized CRUD operations for income and expenses.

### ➕ Create Record
- **Endpoint**: `/api/v1/records`
- **Method**: `POST`
- **Description**: Adds a new financial transaction.
- **Access Role**: `Admin`, `Analyst`
- **Request Body**:
    ```json
    {
      "type": "Expense",
      "amount": 45.90,
      "category": "Travel",
      "note": "Taxi to airport",
      "date": "2026-04-06"
    }
    ```
- **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Financial record created successfully",
      "data": { ... }
    }
    ```

### 📋 List Records
- **Endpoint**: `/api/v1/records`
- **Method**: `GET`
- **Description**: Retrieves filtered and paginated records for the authenticated user.
- **Access Role**: `Admin` (All), `Analyst`/`Viewer` (Own Only)
- **Query Params**: `type`, `category`, `startDate`, `endDate`, `page`, `limit`.
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Records retrieved successfully",
      "data": { "records": [...], "pagination": { ... } }
    }
    ```

### 🔄 Update Record
- **Endpoint**: `/api/v1/records/:id`
- **Method**: `PUT`
- **Description**: Modifies an existing financial transaction.
- **Access Role**: `Admin`, `Analyst` (Own Only)
- **Request Body**: Partial update fields (`amount`, `category`, etc.)
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Record updated successfully",
      "data": { ... }
    }
    ```

### ❌ Delete Record
- **Endpoint**: `/api/v1/records/:id`
- **Method**: `DELETE`
- **Description**: Permanently removes a record from the database.
- **Access Role**: `Admin`
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Record deleted successfully",
      "data": { "id": "..." }
    }
    ```

---

## 📊 3. Dashboard & Analytics Module
Aggregated financial insights powered by MongoDB pipelines.

### 📈 Get Summary
- **Endpoint**: `/api/v1/dashboard/summary`
- **Method**: `GET`
- **Description**: Global KPIs (Total Income, Total Expense, Net Balance).
- **Access Role**: `All Roles`
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Dashboard summary fetched",
      "data": { "totalIncome": 5000, "totalExpense": 1200, "netBalance": 3800 }
    }
    ```

### 🗂️ Get Category Breakdown
- **Endpoint**: `/api/v1/dashboard/category`
- **Method**: `GET`
- **Description**: Spending and earning distribution grouped by category.
- **Access Role**: `Admin`, `Analyst`
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Category totals retrieved successfully",
      "data": [ { "category": "Salary", "total": 5000, "type": "Income" }, ... ]
    }
    ```

### 🗓️ Get Monthly Trends
- **Endpoint**: `/api/v1/dashboard/trends`
- **Method**: `GET`
- **Description**: Income vs. Expense trends for the last 6 months.
- **Access Role**: `Admin`, `Analyst`
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Monthly trends retrieved successfully",
      "data": [ { "year": 2026, "month": 4, "totalIncome": 5000, "totalExpense": 1200 }, ... ]
    }
    ```

### 🕒 Get Recent Transactions
- **Endpoint**: `/api/v1/dashboard/recent`
- **Method**: `GET`
- **Description**: Retrieves the last 5 financial activity items.
- **Access Role**: `All Roles`
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Recent transactions retrieved successfully",
      "data": [ ... ]
    }
    ```

---

## 🛡️ 4. Standardized Error Response
When a request fails, the API returns the following structured format:

```json
{
  "success": false,
  "message": "Access denied: Role 'Viewer' is not authorized for this action",
  "error": "FORBIDDEN"
}
```

**Common error codes (`error` field):**
- `UNAUTHORIZED`: Invalid or missing token.
- `FORBIDDEN`: Role-based privilege violation.
- `ValidationError`: Joi schema validation failed.
- `NOT_FOUND`: Resource (e.g. record ID) does not exist.
- `SERVER_ERROR`: Fallback for unexpected internal failures.
