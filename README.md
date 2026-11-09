# SmartSub Backend

SmartSub is a Node.js and Express API for managing subscriptions, renewal notifications, subscription and payment history, and simple usage-based recommendations. MongoDB stores users and subscription-related records. JWT protects user data, and bcrypt hashes passwords.

## Installation

Requirements:

- Node.js 18 or newer
- MongoDB running locally

Install dependencies from this directory:

```bash
npm install
```

## MongoDB Setup

Start the local MongoDB service, then create a `.env` file in this directory. MongoDB creates the `smartsub` database when the first record is saved.

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartsub
JWT_SECRET=replace_with_a_long_random_secret
```

`.env` is excluded from Git. Never commit the JWT secret.

## Folder Structure

```text
src/
   app.js
   config/db.js
   controllers/       Request handlers
   middleware/        JWT and error middleware
   models/            Mongoose schemas
   routes/            Express route definitions
   services/          Notification and recommendation logic
server.js            Environment loading and server startup
```

## API Endpoints

All protected endpoints require:

```text
Authorization: Bearer <jwt>
```

| Area | Method | Endpoint | Protected |
| --- | --- | --- | --- |
| Health | GET | `/api/health` | No |
| Authentication | POST | `/api/auth/register` | No |
| Authentication | POST | `/api/auth/login` | No |
| Authentication | POST | `/api/auth/logout` | Yes |
| User | GET | `/api/users/profile` | Yes |
| Subscriptions | POST | `/api/subscriptions` | Yes |
| Subscriptions | GET | `/api/subscriptions` | Yes |
| Subscriptions | GET | `/api/subscriptions/:id` | Yes |
| Subscriptions | PUT | `/api/subscriptions/:id` | Yes |
| Subscriptions | DELETE | `/api/subscriptions/:id` | Yes |
| Dashboard | GET | `/api/dashboard` | Yes |
| Notifications | GET | `/api/notifications` | Yes |
| Notifications | PATCH | `/api/notifications/:id/read` | Yes |
| History | GET | `/api/history/subscriptions` | Yes |
| History | GET | `/api/history/payments` | Yes |
| Recommendations | GET | `/api/recommendations` | Yes |

Subscription creation accepts `packageName`, `category`, `price`, `renewalDate`, optional `expiryDate` and `usagePattern`, and optional `status`. Recommendation messages are generated from the authenticated user’s stored subscriptions. A subscription marked `Rarely Used` receives a low-usage recommendation, an expired subscription receives a status recommendation, and a subscription renewing within seven days receives a renewal recommendation.

## Authentication and Data Ownership

Register and login return a JWT. The JWT middleware verifies the token, loads the user, and attaches that user to the request. Every protected query includes the authenticated user’s `userId`, preventing access to another user’s subscriptions, notifications, history, dashboard data, or recommendations.

Responses use this format:

```json
{
   "success": true,
   "message": "...",
   "data": {}
}
```

Errors use `{ "success": false, "message": "..." }`. Validation, invalid authentication, missing resources, duplicate accounts, and unexpected server errors are handled centrally.

## Running the Backend

```bash
npm start
```

For automatic restarts during development:

```bash
npm run dev
```

The API runs at `http://localhost:5000` unless `PORT` changes it.

## Connecting React Native Expo

Set the Expo app's API base URL to the machine running this backend:

- Android emulator: `http://10.0.2.2:5000`
- iOS simulator: `http://localhost:5000`
- Physical device: `http://<computer-lan-ip>:5000`

Send the JWT returned by login in the `Authorization` header for protected requests. Ensure the phone and computer share the same network and that the backend port is reachable through the local firewall.
