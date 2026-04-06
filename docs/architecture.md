# 🏗️ System Architecture Documentation

This document explores the architectural design, design patterns, and core logic behind the **Finance Data Processing and Access Control System**.

---

## 🏛️ 1. Controller-Service-Model (CSM) Pattern
The application is built on the **CSM pattern** (a flavor of Clean Architecture) to ensure maximum scalability and maintainability.

### Why use CSM?
- **Separation of Concerns**: Each layer has a single, well-defined responsibility.
- **Testability**: Services (business logic) can be unit-tested in isolation without mocking HTTP requests.
- **Reusable Logic**: Services can be reused across different controllers or even CLI scripts.
- **Interchangeable Models**: If we switch databases, only the Model and Service layers change; the HTTP layer (Controllers) remains untouched.

---

## 🌊 2. Request Flow Lifecycle
Every incoming HTTP request follows a standardized, linear pipeline:

1.  **`Route`**: Entry point where the endpoint is defined and mapped to a controller.
2.  **`Middleware`**: Initial processing (Authentication, RBAC checks, Joi Schema Validation).
3.  **`Controller`**: Extracts request data (body, params, query) and calls the relevant service.
4.  **`Service`**: Executes business logic and communicates with the Model.
5.  **`Model`**: Interacts with the MongoDB database using Mongoose.
6.  **`Response`**: The controller sends back a standardized JSON response using the `apiResponse` utility.

---

## 🔐 3. Authentication Flow (JWT)
We use **JSON Web Tokens (JWT)** for stateless, secure identity propagation.

- **Registration**: User provides details → Password is salted and hashed via **bcryptjs** (Mongoose pre-save hook) → User is saved to MongoDB.
- **Login**: User provides credentials → Service compares hashes → If valid, a signed JWT is generated containing `userId` and `role`.
- **Authorization header**: Clients send the token in the `Authorization: Bearer <TOKEN>` header.
- **Protect Middleware**: Intercepts the token, verifies it against the `JWT_SECRET`, and attaches the decoded payload to `req.user`.

---

## 🛡️ 4. Role-Based Access Control (RBAC) Flow
Access levels are strictly enforced via the `authorize` middleware.

1.  **Identity Verification**: The `protect` middleware first ensures the user is logged in.
2.  **Role Verification**: The `authorize` middleware checks if `req.user.role` exists in the `allowedRoles` array passed to it.
3.  **Denial**: If the role is unauthorized, a **403 Forbidden** response is immediately returned.
4.  **Audit Trail**: Every mutation (Create/Update/Delete) is logged via the **AuditLogger** to track which user performed which action.

---

## 📊 5. MongoDB Aggregation (Dashboard)
For the Dashboard, we bypassed simple `find()` queries in favor of the **MongoDB Aggregation Framework**.

### Why Aggregation?
- **Performance**: High-speed calculations (Sums, Averages, Grouping) happen natively within the database, not in Node.js memory.
- **Data Reduction**: Only the final calculated results (e.g., `{ totalIncome: 5000 }`) are sent over the network, rather than thousands of raw records.
- **Flexibility**: We can perform "Pivot" operations (grouping by Category or Month) in a single pass.

---

## 🛠️ 6. Validation & Error Handling

### Joi Validation
To prevent "garbage in, garbage out," we use **Joi schemas** at the Middleware layer.
- **Schema Enforcement**: Requests that don't match the schema are rejected with a **400 Bad Request** before they ever reach the controller.
- **Clean Input**: Ensures that only permitted fields reach our database operations.

### Centralized Error Handling
Instead of scattered `try/catch` logic in every file:
1.  Controllers wrap logic in a single `try/catch`.
2.  Errors are passed to `next(error)`.
3.  A global **Error Handler Middleware** in `app.js` captures these errors.
4.  The handler maps the error to a standardized JSON response: `{ success: false, message, error: "ERROR_TYPE" }`.
