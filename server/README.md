# Qyra Server - Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v16+-green?style=flat-square)
![Express](https://img.shields.io/badge/Express-4.18-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)

**RESTful API for Qyra Queue Management System**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

## 🎯 Overview

The Qyra Server is a Node.js/Express backend that powers the Qyra Queue Management System. It provides a RESTful API for queue operations, admin authentication, and settings management, backed by MongoDB for data persistence.

### Key Features

- 🔐 **JWT Authentication** - Secure admin access with token-based auth
- 📊 **Queue Management** - Complete CRUD operations for queue items
- 🎫 **Token Generation** - Unique alphanumeric token creation
- 👑 **Priority System** - VIP and senior citizen priority handling
- 📈 **Analytics** - Real-time statistics and metrics
- ⚙️ **Settings Management** - Configurable shop settings
- 🛡️ **Error Handling** - Comprehensive error middleware
- 🌐 **CORS Enabled** - Cross-origin resource sharing configured

## ✨ Features

### Authentication
- Admin login with email/password
- JWT token generation and verification
- Password hashing with bcrypt
- Protected routes with middleware

### Queue Operations
- Join queue (public endpoint)
- Get queue status by ID
- Get current serving customer
- Get full queue list
- Start serving customer (admin)
- Complete serving (admin)
- Increase priority (admin)
- Remove from queue (admin)
- Get queue statistics (admin)

### Settings Management
- Get public settings (queue status)
- Get admin settings
- Update settings (pause, close, maintenance mode)
- Theme configuration

## 🛠️ Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose ODM 8.0
- **Authentication**: JSON Web Tokens (JWT) 9.0
- **Password Hashing**: bcryptjs 2.4
- **Environment**: dotenv 16.3
- **CORS**: cors 2.8
- **Dev Tools**: nodemon 3.0

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB (local installation or Atlas account)
- npm or yarn package manager

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qyra
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Create admin user**
   ```bash
   npm run create-admin
   ```
   
   Follow the interactive prompts:
   - Enter admin name
   - Enter admin email
   - Enter password (min 6 characters)
   - Set average time per customer (default: 10 minutes)

5. **Start the server**
   ```bash
   npm start
   ```
   
   **Note:** For development with auto-reload, use `npm run dev`

6. **Verify server is running**
   
   Visit: `http://localhost:5001/api/health`
   
   Expected response:
   ```json
   {
     "success": true,
     "message": "Qyra API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## 📡 API Reference

### Base URL
- **Development**: `http://localhost:5001/api`
- **Production**: `https://qyra.onrender.com/api`

### Authentication Endpoints

#### POST /api/auth/login
Admin login endpoint.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "avgTimePerCustomer": 10
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Queue Endpoints

#### POST /api/queue/join
Join the queue (public endpoint).

**Request:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "type": "Walk-in"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "queue_item_id",
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "type": "Walk-in",
    "tokenNumber": "QY-A1B2",
    "priorityLevel": 1,
    "status": "waiting",
    "position": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/queue/status/:id
Get queue status for a specific customer.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "queueItem": {
      "_id": "item_id",
      "name": "John Doe",
      "tokenNumber": "QY-A1B2",
      "status": "waiting"
    },
    "position": 3,
    "estimatedWaitTime": "15 minutes",
    "currentlyServing": {
      "_id": "current_id",
      "name": "Jane Smith",
      "tokenNumber": "QY-C3D4"
    }
  }
}
```

#### GET /api/queue/current
Get currently serving customer (public).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "Jane Smith",
    "tokenNumber": "QY-C3D4",
    "type": "VIP",
    "status": "serving"
  }
}
```

#### GET /api/queue/list
Get full queue list (public).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "item_id",
      "name": "Customer Name",
      "tokenNumber": "QY-E5F6",
      "type": "Walk-in",
      "status": "waiting",
      "priorityLevel": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PUT /api/queue/start/:id
Start serving a customer (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Started serving customer",
  "data": {
    "_id": "item_id",
    "name": "Customer Name",
    "tokenNumber": "QY-A1B2",
    "status": "serving"
  }
}
```

#### PUT /api/queue/complete/:id
Complete serving a customer (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Customer served successfully",
  "data": {
    "_id": "item_id",
    "name": "Customer Name",
    "tokenNumber": "QY-A1B2",
    "status": "completed",
    "completedAt": "2024-01-01T00:10:00.000Z"
  }
}
```

#### PUT /api/queue/priority/:id
Increase customer priority (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Priority increased",
  "data": {
    "_id": "item_id",
    "name": "Customer Name",
    "tokenNumber": "QY-A1B2",
    "priorityLevel": 11,
    "status": "waiting"
  }
}
```

#### DELETE /api/queue/:id
Remove customer from queue (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Customer removed from queue"
}
```

#### GET /api/queue/stats
Get queue statistics (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalWaiting": 12,
    "totalServed": 45,
    "totalToday": 57,
    "averageWaitTime": "8 minutes",
    "customerTypes": {
      "Walk-in": 30,
      "VIP": 15,
      "Senior": 12
    }
  }
}
```

---

### Settings Endpoints

#### GET /api/settings/public
Get public settings (queue status).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isPaused": false,
    "isClosed": false,
    "isMaintenanceMode": false
  }
}
```

#### GET /api/settings
Get all settings (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isPaused": false,
    "isClosed": false,
    "isMaintenanceMode": false,
    "theme": {
      "darkMode": true
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/settings/update
Update settings (protected).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "isPaused": true,
  "isClosed": false,
  "isMaintenanceMode": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "isPaused": true,
    "isClosed": false,
    "isMaintenanceMode": false
  }
}
```

---

## 🗄️ Database Models

### User Model
Admin user schema with authentication.

```javascript
{
  name: String,           // Admin name
  email: String,          // Unique email (login)
  password: String,       // Hashed password
  role: String,           // 'admin' or 'customer'
  avgTimePerCustomer: Number, // Default: 10 minutes
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)

**Methods:**
- `matchPassword(enteredPassword)` - Compare passwords

### QueueItem Model
Queue entry schema.

```javascript
{
  name: String,           // Customer name
  phone: String,          // Phone number
  email: String,          // Email address
  type: String,           // 'Walk-in', 'VIP', 'Senior'
  priorityLevel: Number,  // Priority (higher = more priority)
  status: String,         // 'waiting', 'serving', 'completed', 'removed'
  tokenNumber: String,    // Unique token (e.g., 'QY-A1B2')
  completedAt: Date,      // Completion timestamp
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ status: 1, priorityLevel: -1, createdAt: 1 }` - Queue ordering
- `{ tokenNumber: 1 }` (unique) - Token lookup

**Priority Levels:**
- Walk-in: 1
- VIP: 10
- Senior: 5

### ShopSettings Model
Shop configuration schema.

```javascript
{
  isPaused: Boolean,      // Queue paused
  isClosed: Boolean,      // Queue closed for new entries
  isMaintenanceMode: Boolean, // Maintenance mode
  theme: {
    darkMode: Boolean     // Dark mode enabled
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Static Methods:**
- `getSettings()` - Get or create settings (singleton pattern)

---

## 🔐 Authentication

### JWT Token Structure

```javascript
{
  id: "user_id",
  role: "admin",
  iat: 1234567890,
  exp: 1234567890
}
```

### Protected Routes

All admin endpoints require JWT authentication:

1. Include token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

2. Middleware verifies token and attaches user to `req.user`

3. Access denied if:
   - Token is missing
   - Token is invalid
   - Token is expired
   - User is not admin

### Token Expiration

Tokens expire after **30 days** by default.

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### Common Errors

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Queue item not found"
}
```

---

## 📜 Scripts

### Available Commands

```bash
# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev

# Create admin user
npm run create-admin

# Update admin's average time per customer
npm run update-admin-time
```

### Script Details

#### `npm start`
Runs the server using Node.js directly.
```bash
node server.js
```

#### `npm run dev`
Runs the server with nodemon for auto-reload on file changes (development only).
```bash
nodemon server.js
```

#### `npm run create-admin`
Interactive script to create a new admin user.
```bash
node utils/createAdmin.js
```

Prompts:
- Admin name
- Admin email
- Password (min 6 characters)
- Average time per customer (minutes)

#### `npm run update-admin-time`
Update the average service time for an admin.
```bash
node scripts/updateAdminTimePerCustomer.js
```

---

## 🚢 Deployment

### Render Deployment

1. **Create Web Service**
   - Connect GitHub repository
   - Select `server` as root directory

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   Add in Render dashboard:
   ```
   PORT=5001
   MONGO_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<your_secret_key>
   NODE_ENV=production
   ```

4. **Deploy**
   - Render will auto-deploy on push to main branch

### MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free tier cluster

2. **Create Database User**
   - Database Access → Add New User
   - Set username and password

3. **Whitelist IP**
   - Network Access → Add IP Address
   - Use `0.0.0.0/0` for all IPs (or specific IPs)

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Add to `.env` as `MONGO_URI`

### Environment Configuration

**Development (.env):**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/qyra
JWT_SECRET=dev_secret_key
NODE_ENV=development
```

**Production (Render):**
```env
PORT=5001
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/qyra
JWT_SECRET=production_secret_key_very_long_and_secure
NODE_ENV=production
```

---

## 🔧 Configuration

### CORS Configuration

Allowed origins:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5174` (Alternative port)
- `https://qyra-gamma.vercel.app` (Production frontend)

To add more origins, update `server.js`:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-url.com"
  ]
}));
```

### Database Connection

Connection options in `config/db.js`:
```javascript
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

---

## 📊 Monitoring

### Health Check

Endpoint: `GET /api/health`

Use for:
- Server uptime monitoring
- Load balancer health checks
- Deployment verification

### Logging

Server logs include:
- Server startup info
- Database connection status
- API request errors
- Authentication failures

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```
Error: MONGO_URI is not defined in .env file
```
**Solution:** Create `.env` file with valid `MONGO_URI`

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution:** Kill process on port 5001 or use different port

**3. JWT Secret Missing**
```
Error: JWT_SECRET is not defined in .env file
```
**Solution:** Add `JWT_SECRET` to `.env` file

**4. Admin Creation Failed**
```
Error: E11000 duplicate key error
```
**Solution:** Email already exists, use different email

---

## 📝 API Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Join Queue:**
```bash
curl -X POST http://localhost:5001/api/queue/join \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"1234567890","email":"john@example.com","type":"Walk-in"}'
```

**Get Queue List:**
```bash
curl http://localhost:5001/api/queue/list
```

### Using Postman

1. Import API collection
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:5001/api`
3. For protected routes, add token to Authorization header

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` file
   - Use strong JWT secret (32+ characters)
   - Rotate secrets regularly

2. **Password Security**
   - Minimum 6 characters enforced
   - Passwords hashed with bcrypt (10 rounds)
   - Never log passwords

3. **JWT Tokens**
   - Tokens expire after 30 days
   - Stored client-side only
   - Verified on every protected request

4. **Database**
   - Use MongoDB Atlas with authentication
   - Whitelist specific IPs when possible
   - Enable encryption at rest

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with Node.js, Express, and MongoDB**

[⬆ Back to Top](#qyra-server---backend-api)

</div>
