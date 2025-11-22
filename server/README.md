# Qyra Backend (Server)

Production-ready Express + MongoDB API powering the Qyra queue management system. Provides public endpoints for customers to join and track the queue, and protected admin endpoints to operate the queue, configure settings, and view analytics.

## Overview
- Base URL: `http://localhost:<PORT>/api`
- Tech: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`
- CORS: Allowed origins `http://localhost:5173`, `http://localhost:5174`, `https://qyra-gamma.vercel.app`
- Auth: JWT Bearer token with 7-day expiry
- Database: MongoDB via `MONGO_URI`

## Project Structure
```
/server
├── config/
│   └── db.js                          # MongoDB connection
├── controllers/
│   ├── authController.js              # Authentication logic
│   ├── queueController.js             # Queue management logic
│   └── settingsController.js          # Shop settings logic
├── middleware/
│   ├── auth.js                        # Legacy JWT auth middleware
│   ├── authMiddleware.js              # JWT auth + admin protection
│   └── errorHandler.js                # Error handling middleware
├── models/
│   ├── User.js                        # User model (Admin/Customer)
│   ├── QueueItem.js                   # Queue item model
│   └── ShopSettings.js                # Shop settings model
├── routes/
│   ├── authRoutes.js                  # Authentication routes
│   ├── queueRoutes.js                 # Queue routes
│   └── settingsRoutes.js              # Settings routes
├── scripts/
│   └── updateAdminTimePerCustomer.js  # Backfill avgTimePerCustomer for admins
├── utils/
│   ├── createAdmin.js                 # Create demo admin user
│   ├── generateToken.js               # JWT token generation
│   └── generateTokenNumber.js         # Token number generation
├── .env                               # Environment variables (not committed)
├── .gitignore
├── package.json
├── package-lock.json
├── server.js                          # Main server file
└── README.md
```

## Installation
- Ensure Node.js and MongoDB are available
- Navigate to `server/`
- Run `npm install`

## Scripts
- `npm run start` — start server
- `npm run dev` — start server with nodemon
- `npm run create-admin` — create demo admin user `admin@qyra.com / admin123`
- `npm run update-admin-time` — backfill `avgTimePerCustomer` to admins lacking it

## .env Configuration
Create `server/.env` with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/qyra
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=development
```

## Models

### User
- `name`: string, required
- `email`: string, required, unique, lowercase
- `password`: string, required, min 6, not selected by default
- `role`: enum `admin | customer`, default `customer`
- `avgTimePerCustomer`: number, minutes, default `10`, range `1..120`
- Timestamps enabled

### QueueItem
- `name`: string, required
- `phone`: string, optional
- `email`: string, optional, lowercase
- `type`: enum `Walk-in | VIP | Senior`, default `Walk-in`
- `priorityLevel`: number, required, default `1` (admin can increase to `5`)
- `status`: enum `waiting | serving | completed | removed`, default `waiting`
- `tokenNumber`: string, required, unique format `QY-XXXX`
- `completedAt`: date, nullable
- `createdAt`: date, defaults to now
- Timestamps enabled

### ShopSettings
- `isPaused`: boolean, default `false`
- `isClosed`: boolean, default `false`
- `isMaintenanceMode`: boolean, default `false`
- `theme.darkMode`: boolean, default `true`
- Static `getSettings()` ensures a single settings document exists

## Utilities
- `generateToken(id)` — returns JWT signed with `JWT_SECRET`, expires in 7 days
- `generateTokenNumber()` — generates unique `QY-XXXX` codes with collision checks and safe fallback
- `utils/createAdmin.js` — creates demo admin user if missing
- `scripts/updateAdminTimePerCustomer.js` — fills `avgTimePerCustomer=10` for admins missing the field

## Database
- Uses Mongoose to connect via `MONGO_URI`
- Logs connection name and host on successful connect
- Exits process on connection error or missing `MONGO_URI`
- Listens for `disconnected` and `error` events on the connection

## Authentication
- Admin login issues a JWT (`expiresIn: 7d`)
- Protected routes require header `Authorization: Bearer <token>`
- Only users with `role=admin` may access protected routes

## CORS
- Allowed origins: `http://localhost:5173`, `http://localhost:5174`, `https://qyra-gamma.vercel.app`
- JSON bodies enabled via `express.json()` and `express.urlencoded()`

## Health
- `GET /api/health`
  - Response `200`:
  ```json
  {
    "success": true,
    "message": "Qyra API is running",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
  ```

## API

### Auth
- `POST /api/auth/login`
  - Headers: `Content-Type: application/json`
  - Body:
  ```json
  { "email": "admin@qyra.com", "password": "admin123" }
  ```
  - Success `200`:
  ```json
  {
    "success": true,
    "token": "<jwt>",
    "user": {
      "id": "<userId>",
      "name": "Demo Admin",
      "email": "admin@qyra.com",
      "role": "admin",
      "avgTimePerCustomer": 10
    }
  }
  ```
  - Errors: `400` missing fields, `401` invalid credentials, `403` non-admin

### Queue (Public)
- `POST /api/queue/join`
  - Body:
  ```json
  { "name": "Alice", "phone": "1234567890", "email": "alice@example.com", "type": "Walk-in" }
  ```
  - Type allowed: `Walk-in`, `VIP`, `Senior` (defaults to `Walk-in`)
  - Success `201`:
  ```json
  {
    "success": true,
    "data": {
      "id": "<queueItemId>",
      "tokenNumber": "QY-AB12",
      "name": "Alice",
      "type": "Walk-in",
      "position": 3,
      "estimatedWait": "20 minutes"
    }
  }
  ```
  - Errors: `400` validation, `500` token generation or DB

- `GET /api/queue/status/:id`
  - Params: `id` queue item id
  - Success `200`:
  ```json
  {
    "success": true,
    "data": {
      "id": "<queueItemId>",
      "tokenNumber": "QY-AB12",
      "name": "Alice",
      "type": "Walk-in",
      "status": "waiting",
      "position": 3,
      "estimatedWait": "20 minutes",
      "currentlyServing": { "tokenNumber": "QY-ZX99", "name": "Bob" }
    }
  }
  ```
  - Errors: `404` not found

- `GET /api/queue/current`
  - Success `200` when serving:
  ```json
  {
    "success": true,
    "data": {
      "id": "<queueItemId>",
      "tokenNumber": "QY-ZX99",
      "name": "Bob",
      "type": "VIP",
      "phone": "",
      "email": "",
      "startedAt": "2025-01-01T00:00:00.000Z"
    }
  }
  ```
  - Success `200` when none:
  ```json
  { "success": true, "data": null, "message": "No one is currently being served" }
  ```

### Queue (Admin — requires `Authorization: Bearer <token>`)
- `GET /api/queue/list`
  - Query: `status` (optional), `type` (optional)
  - Defaults to excluding `removed` items
  - Success `200`:
  ```json
  {
    "success": true,
    "data": {
      "queue": [
        {
          "id": "<id>",
          "tokenNumber": "QY-AB12",
          "name": "Alice",
          "customerType": "walk-in",
          "type": "Walk-in",
          "phone": "",
          "email": "",
          "priority": 1,
          "priorityLevel": 1,
          "status": "waiting",
          "joinedAt": "2025-01-01T00:00:00.000Z",
          "createdAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "currentlyServing": null
    }
  }
  ```

- `PUT /api/queue/start/:id`
  - Marks any currently serving as `completed`, then sets `:id` to `serving`
  - Success `200` with item data

- `PUT /api/queue/complete/:id`
  - Sets `status=completed`, records `completedAt`
  - Success `200` with item data

- `PUT /api/queue/priority/:id`
  - Only for `status=waiting`
  - Increases `priorityLevel` up to `5`
  - If `priorityLevel>=3`, sets `type=VIP`
  - Success `200` with updated priority

- `DELETE /api/queue/:id`
  - Removes queue item by id
  - Success `200` with removed item summary

- `GET /api/queue/stats`
  - Success `200`:
  ```json
  {
    "success": true,
    "data": {
      "totalWaiting": 12,
      "servedToday": 7,
      "currentlyServing": { "tokenNumber": "QY-ZX99", "name": "Bob" },
      "averageWaitTime": 18,
      "byType": { "Walk-in": 8, "VIP": 3, "Senior": 1 }
    }
  }
  ```

### Settings
- `GET /api/settings/public`
  - Public status flags
  - Success `200`:
  ```json
  { "success": true, "data": { "isPaused": false, "isClosed": false, "isMaintenanceMode": false } }
  ```

- `GET /api/settings`
  - Admin only
  - Success `200`:
  ```json
  {
    "success": true,
    "data": {
      "isPaused": false,
      "isClosed": false,
      "isMaintenanceMode": false,
      "theme": { "darkMode": true },
      "avgTimePerCustomer": 10
    }
  }
  ```

- `PUT /api/settings/update`
  - Admin only
  - Body (all optional):
  ```json
  {
    "isPaused": true,
    "isClosed": false,
    "isMaintenanceMode": false,
    "theme": { "darkMode": true },
    "avgTimePerCustomer": 15
  }
  ```
  - Constraints: `avgTimePerCustomer` must be `1..120`
  - Success `200`: returns updated flags and `avgTimePerCustomer`
  - Errors: `400` invalid average time, `404` user not found

## Queue Logic
- Join: create item with token, infer `priorityLevel` by `type`
- Position: among `status=waiting`, sort by `priorityLevel` desc, then `createdAt` asc
- Wait time: `(position-1) * avgTimePerCustomer` minutes (admin-configured)
- Serve: starting a customer completes any existing `serving`, then sets new to `serving`
- Complete: sets `completed`, records `completedAt`
- Priority: increase level up to `5`, auto-upgrade to `VIP` at `>=3`
- Remove: deletes the item by id

## Allowed Values
- `type`: `Walk-in`, `VIP`, `Senior`
- `status`: `waiting`, `serving`, `completed`, `removed`
- `priorityLevel`: integer `1..5`

## Using with Postman
- Set environment variable `baseUrl` = `http://localhost:<PORT>/api`
- Login: `POST {{baseUrl}}/auth/login` to obtain `token`
- Set `Authorization: Bearer {{token}}` for all admin routes
- Public flow:
  - `POST {{baseUrl}}/queue/join`
  - `GET {{baseUrl}}/queue/status/:id`
  - `GET {{baseUrl}}/queue/current`
- Admin flow:
  - `GET {{baseUrl}}/queue/list`
  - `PUT {{baseUrl}}/queue/start/:id`
  - `PUT {{baseUrl}}/queue/complete/:id`
  - `PUT {{baseUrl}}/queue/priority/:id`
  - `DELETE {{baseUrl}}/queue/:id`
  - `GET {{baseUrl}}/queue/stats`
  - `GET {{baseUrl}}/settings`
  - `PUT {{baseUrl}}/settings/update`

## Troubleshooting
- Server fails to start: ensure `PORT`, `MONGO_URI`, `JWT_SECRET` set in `server/.env`
- MongoDB connection errors: verify `MONGO_URI` and database availability
- 401/403 on admin routes: include valid `Authorization: Bearer <token>` and ensure admin role
- CORS blocked: make requests from allowed origins or adjust CORS configuration
- Health check: `GET /api/health` to verify server status

## Notes
- JWT expiry is 7 days
- Average time per customer is stored on the admin user and used for ETA calculations
- `DELETE /api/queue/:id` removes records; the `removed` status exists in the schema but is not set by this endpoint
- Settings document is singleton; created automatically on first access

- Remove: deletes the item by id

## Allowed Values
- `type`: `Walk-in`, `VIP`, `Senior`
- `status`: `waiting`, `serving`, `completed`, `removed`
- `priorityLevel`: integer `1..5`

## Using with Postman
- Set environment variable `baseUrl` = `http://localhost:<PORT>/api`
- Login: `POST {{baseUrl}}/auth/login` to obtain `token`
- Set `Authorization: Bearer {{token}}` for all admin routes
- Public flow:
  - `POST {{baseUrl}}/queue/join`
  - `GET {{baseUrl}}/queue/status/:id`
  - `GET {{baseUrl}}/queue/current`
- Admin flow:
  - `GET {{baseUrl}}/queue/list`
  - `PUT {{baseUrl}}/queue/start/:id`
  - `PUT {{baseUrl}}/queue/complete/:id`
  - `PUT {{baseUrl}}/queue/priority/:id`
  - `DELETE {{baseUrl}}/queue/:id`
  - `GET {{baseUrl}}/queue/stats`
  - `GET {{baseUrl}}/settings`
  - `PUT {{baseUrl}}/settings/update`

## Troubleshooting
- Server fails to start: ensure `PORT`, `MONGO_URI`, `JWT_SECRET` set in `server/.env`
- MongoDB connection errors: verify `MONGO_URI` and database availability
- 401/403 on admin routes: include valid `Authorization: Bearer <token>` and ensure admin role
- CORS blocked: make requests from allowed origins or adjust CORS configuration
- Health check: `GET /api/health` to verify server status

## Notes
- JWT expiry is 7 days
- Average time per customer is stored on the admin user and used for ETA calculations
- `DELETE /api/queue/:id` removes records; the `removed` status exists in the schema but is not set by this endpoint
- Settings document is singleton; created automatically on first access

}
```

#### Get Queue Status
```http
GET /api/queue/status/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "tokenNumber": 1,
    "name": "John Doe",
    "type": "Walk-in",
    "status": "waiting",
    "position": 3,
    "estimatedWait": "15-21 minutes",
    "currentlyServing": {
      "tokenNumber": 45,
      "name": "Sarah Johnson"
    }
  }
}
```
Note: The backend uses `avgTimePerCustomer` (stored in the User/Admin document) to compute estimated wait times.

#### Get Currently Serving
```http
GET /api/queue/current
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "tokenNumber": 45,
    "name": "Sarah Johnson",
    "type": "VIP",
    "phone": "+1234567890",
    "email": "sarah@example.com",
    "startedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Admin Endpoints (Require JWT Token)

**All admin endpoints require authentication. Include the JWT token in the Authorization header:**
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@qyra.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Admin",
    "email": "admin@qyra.com",
    "role": "admin",
    "avgTimePerCustomer": "10"
  }
}
```

#### Get Queue List
```http
GET /api/queue/list
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (optional):**
- `status`: Filter by status (waiting, serving, completed)
- `type`: Filter by type (Walk-in, VIP, Senior)

**Response:**
```json
{
  "success": true,
  "data": {
    "queue": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "tokenNumber": 1,
        "name": "John Doe",
        "customerType": "walk-in",
        "type": "Walk-in",
        "phone": "+1234567890",
        "email": "john@example.com",
        "priority": 1,
        "priorityLevel": 1,
        "status": "waiting",
        "joinedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "currentlyServing": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "tokenNumber": 45,
      "name": "Sarah Johnson",
      "customerType": "vip",
      "type": "VIP",
      "status": "serving"
    }
  }
}
```

#### Start Serving
```http
PUT /api/queue/start/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Complete Service
```http
PUT /api/queue/complete/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Increase Priority
```http
PUT /api/queue/priority/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Queue Statistics
```http
GET /api/queue/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalWaiting": 8,
    "servedToday": 25,
    "currentlyServing": {
      "tokenNumber": 45,
      "name": "Sarah Johnson"
    },
    "averageWaitTime": 12,
    "byType": {
      "Walk-in": 5,
      "VIP": 2,
      "Senior": 1
    }
  }
}
```

## 🔧 Testing with Postman

1. **Start the server**: `npm run dev`

2. **Test Admin Login**:
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@qyra.com",
       "password": "admin123"
     }
     ```
   - Copy the `token` from the response

3. **Test Protected Endpoints**:
   - Add Header: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Test endpoints like `/api/queue/list`, `/api/queue/stats`

4. **Test Public Endpoints**:
   - No authentication needed
   - Test `/api/queue/join`, `/api/queue/current`

## 🔗 Frontend Integration

Update your frontend API calls to use:
- **Base URL**: `http://localhost:5000/api`
- **CORS**: Configured for trusted frontend origins — http://localhost:5173, http://localhost:5174, and the production URL https://qyra-gamma.vercel.app

### Example Frontend API Call:

```javascript
// Join Queue
const joinQueue = async (customerData) => {
  const response = await fetch('http://localhost:5000/api/queue/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: customerData.fullName,
      phone: customerData.phone,
      email: customerData.email,
      type: customerData.customerType === 'vip' ? 'VIP' : 
            customerData.customerType === 'senior' ? 'Senior' : 'Walk-in'
    })
  });
  return await response.json();
};

// Admin Login
const adminLogin = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  // Store token in localStorage or state
  localStorage.setItem('token', data.token);
  return data;
};

// Get Queue List (Admin)
const getQueueList = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/queue/list', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

## 📊 Database Models

### User Model
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: 'admin' | 'customer')
- `avgTimePerCustomer` (Number, default: 10) - Used by admin to calculate the estimated wait time

### QueueItem Model
- `name` (String, required)
- `phone` (String, optional)
- `email` (String, optional)
- `type` (String, enum: 'Walk-in' | 'VIP' | 'Senior')
- `priorityLevel` (Number, 1-5)
- `status` (String, enum: 'waiting' | 'serving' | 'completed')
- `tokenNumber` (Number, required, unique, auto-incremented)
- `createdAt` (Date, auto)

## 🔐 Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire in 7 days
- Admin routes are protected by authentication middleware
- CORS is configured for the frontend origin only

## 🐛 Troubleshooting

1. **MongoDB Connection Error**: Check your `.env` file and ensure the password is correct
2. **Port Already in Use**: Change `PORT` in `.env` to a different port
3. **Authentication Fails**: Ensure admin user exists in database
4. **CORS Errors**: Ensure your frontend URL is allowed in the backend CORS settings.  
                    Supported origins include:
                      - `http://localhost:5173` (local development)
                      - `http://localhost:5174` (local development)
                      - `https://qyra-gamma.vercel.app` (production)



## 📝 Notes

- Token numbers are auto-incremented (1, 2, 3, ...)
- Priority levels: VIP = 3, Senior = 2, Walk-in = 1
- Only one customer can be "serving" at a time
- When starting a new service, the previous serving item is auto-completed

