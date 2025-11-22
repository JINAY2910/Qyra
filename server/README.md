# Qyra Backend Server

Complete backend API for the Qyra queue management system.

## 📁 Project Structure

```
/server
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── queueController.js # Queue management logic
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── models/
│   ├── User.js            # User model (Admin/Customer)
│   └── QueueItem.js       # Queue item model
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   └── queueRoutes.js     # Queue routes
├── utils/
│   ├── generateToken.js   # JWT token generation
│   └── generateTokenNumber.js # Token number generation
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── server.js              # Main server file
└── README.md
```

## 🚀 Setup Instructions

### 1. Configure MongoDB Connection

Edit the `.env` file and replace `<PASSWORD>` with your actual MongoDB Atlas password:

```env
MONGO_URI=<your_connection_string_here>
JWT_SECRET=supersecretkey
PORT=5000
```

**Important:** Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password, and update the cluster URL if needed.

### 2. Create Admin User

Before using the admin features, you need to create an admin user in MongoDB. You can do this by:

**Option A: Using MongoDB Compass or Atlas UI**
- Connect to your database
- Navigate to the `users` collection
- Insert a document:
```json
{
  "name": "Admin",
  "email": "admin@qyra.com",
  "password": "admin123",
  "role": "admin"
}
```
Note: The password will be automatically hashed when saved.

**Option B: Using a script (create admin script)**
Run this in Node.js or create a temporary script:
```javascript
import User from './models/User.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
await connectDB();

const admin = await User.create({
  name: 'Admin',
  email: 'admin@qyra.com',
  password: 'admin123',
  role: 'admin'
});

console.log('Admin created:', admin);
```

### 3. Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Public Endpoints (No Authentication)

#### Join Queue
```http
POST /api/queue/join
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "type": "Walk-in"
}
```
Note: Allowed values for "type": "Walk-in" | "VIP" | "Senior"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "tokenNumber": 1,
    "name": "John Doe",
    "type": "Walk-in",
    "position": 3,
  }
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
- **CORS**: Already configured for `http://localhost:5173`

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
- JWT tokens expire in 30 days
- Admin routes are protected by authentication middleware
- CORS is configured for the frontend origin only

## 🐛 Troubleshooting

1. **MongoDB Connection Error**: Check your `.env` file and ensure the password is correct
2. **Port Already in Use**: Change `PORT` in `.env` to a different port
3. **Authentication Fails**: Ensure admin user exists in database
4. **CORS Errors**: Verify frontend is running on `http://localhost:5173`

## 📝 Notes

- Token numbers are auto-incremented (1, 2, 3, ...)
- Priority levels: VIP = 3, Senior = 2, Walk-in = 1
- Only one customer can be "serving" at a time
- When starting a new service, the previous serving item is auto-completed

