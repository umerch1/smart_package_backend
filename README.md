# SmartSub Backend

Phase 1 backend for the Smart Package and Subscription Reminder App.

## Stack

- Node.js and Express.js
- MongoDB Local with Mongoose
- JWT authentication
- bcrypt password hashing
- dotenv and CORS

## Setup

1. Ensure MongoDB is running locally.
2. From this directory, install dependencies:

   ```bash
   npm install
   ```

3. Confirm `.env` contains:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smartsub
   JWT_SECRET=your_secret_key
   ```

4. Start the API:

   ```bash
   npm start
   ```

The server listens on `http://localhost:5000`.

## Endpoints

### Health check

`GET /api/health`

### Register

`POST /api/auth/register`

```json
{
  "name": "Umer",
  "email": "umer@example.com",
  "password": "password123"
}
```

Registration validates the fields, normalizes the email, checks duplicates, hashes the password with bcrypt, stores the user, and returns a user summary plus JWT.

### Login

`POST /api/auth/login`

```json
{
  "email": "umer@example.com",
  "password": "password123"
}
```

Login loads the password explicitly because the User model excludes it by default, compares it with bcrypt, and returns a JWT with password-free user information.

### Profile

`GET /api/users/profile`

Send `Authorization: Bearer <token>`. The JWT middleware verifies the token, loads the user, and exposes only the authenticated user to the controller.

### Logout

`POST /api/auth/logout`

Logout is stateless in this phase. The Expo client should remove its stored JWT after receiving the success response. Future phases can add token revocation if server-side session invalidation is needed.

## Response format

Success responses use `{ "success": true, "message": "...", "data": {} }`. Errors use `{ "success": false, "message": "..." }`.

Passwords are never selected from normal user queries and are explicitly omitted from every API response.

This phase intentionally does not include subscriptions, notifications, dashboard, payment history, or recommendations.
