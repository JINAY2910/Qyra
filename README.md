# Qyra - Digital Queue Management System

<div align="center">

![Qyra Logo](https://img.shields.io/badge/Qyra-Queue%20Management-8B5CF6?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://qyra-gamma.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Your turn, simplified.** 🚀

A modern, full-stack digital queue management system that eliminates physical waiting lines and provides real-time queue tracking for both customers and administrators.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Server Documentation](#-server-documentation)
- [Environment Variables](#-environment-variables)
- [UI Showcase](#-ui-showcase)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

Qyra is a comprehensive queue management solution designed for modern businesses. It replaces traditional physical queue systems with a digital platform that allows customers to join queues remotely, track their position in real-time, and receive notifications when it's their turn.

### Key Highlights

- 🎫 **Virtual Token System** - Unique tokens replace physical queue numbers
- 📱 **Real-time Updates** - Live queue position and wait time tracking
- 👑 **Priority Management** - VIP and senior citizen priority handling
- 📊 **Admin Dashboard** - Complete queue control and analytics
- 📄 **PDF Tickets** - Professional downloadable queue tickets
- 🔒 **Secure Authentication** - JWT-based admin authentication
- 🌐 **Public Display** - TV-optimized fullscreen queue status
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## ✨ Features

### 👥 Customer Features

- **Join Queue**
  - Simple form with name, phone, email, and customer type
  - Customer types: Walk-in, VIP, Senior (with priority levels)
  - Instant token generation with unique ID
  - Downloadable PDF ticket with just one click

- **Queue Status**
  - Real-time position tracking
  - Estimated wait time calculation
  - Current serving display
  - Fullscreen TV mode for public displays

- **Digital Ticket**
  - Professional PDF design
  - Includes token number, customer details, and queue info
  - Clickable tracking link
  - Optimized for printing and mobile viewing

### 🔐 Admin Features

- **Secure Dashboard**
  - JWT-based authentication
  - Protected routes with middleware
  - Session management

- **Queue Management**
  - Start serving customers
  - Complete/skip customers
  - Increase priority for special cases
  - Remove customers from queue
  - Real-time queue list with filters

- **Analytics**
  - Total customers served
  - Average wait time
  - Customer type distribution
  - Peak hours analysis
  - Performance metrics

- **Settings**
  - Pause/resume queue
  - Close queue for new entries
  - Maintenance mode
  - Average service time configuration
  - Theme customization

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF (programmatic generation)
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useEffect)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **CORS**: cors middleware

### DevOps

- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **Version Control**: Git & GitHub

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JINAY2910/Qyra.git
   cd Qyra
   ```

2. **Install client dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Create admin user**
   ```bash
   cd server
   npm run create-admin
   ```
   Follow the prompts to create your admin account.

6. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5001/api`

## 📁 Project Structure

```
Qyra/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── AdminControls.tsx    # Admin control buttons
│   │   ├── Logo.tsx             # Qyra logo component
│   │   ├── Modal.tsx            # Modal dialogs
│   │   ├── Navbar.tsx           # Main navigation bar
│   │   ├── QueueTable.tsx       # Admin queue table
│   │   ├── QueueTicket.tsx      # Digital ticket component
│   │   ├── QyraLogo.tsx         # Alternative logo
│   │   ├── Toast.tsx            # Notification system
│   │   └── TokenCard.tsx        # Token display card
│   ├── pages/                    # Application pages
│   │   ├── AdminAnalytics.tsx   # Analytics dashboard
│   │   ├── AdminDashboard.tsx   # Queue management
│   │   ├── AdminLogin.tsx       # Admin authentication
│   │   ├── AdminSettings.tsx    # Settings management
│   │   ├── Home.tsx             # Landing page
│   │   ├── JoinQueue.tsx        # Customer queue joining
│   │   ├── ManageQueue.tsx      # Queue operations
│   │   └── QueueStatus.tsx      # Public queue display
│   ├── contexts/                 # React contexts
│   ├── data/                     # Sample data and types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
├── server/                       # Backend source code
│   ├── config/                   # Configuration files
│   │   └── db.js                # MongoDB connection
│   ├── controllers/              # Route controllers
│   │   ├── authController.js    # Authentication logic
│   │   ├── queueController.js   # Queue operations
│   │   └── settingsController.js # Settings management
│   ├── middleware/               # Express middleware
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/                   # Mongoose models
│   │   ├── QueueItem.js         # Queue entry model
│   │   ├── ShopSettings.js      # Settings model
│   │   └── User.js              # Admin user model
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── queueRoutes.js       # Queue endpoints
│   │   └── settingsRoutes.js    # Settings endpoints
│   ├── scripts/                  # Utility scripts
│   │   ├── createAdmin.js       # Create admin user
│   │   └── updateAdminTimePerCustomer.js # Update service time
│   ├── utils/                    # Utility functions
│   │   ├── createAdmin.js       # Admin creation helper
│   │   ├── generateToken.js     # JWT token generator
│   │   └── generateTokenNumber.js # Queue token generator
│   ├── .env                      # Environment variables
│   ├── package.json              # Server dependencies
│   ├── README.md                 # Server documentation
│   └── server.js                 # Server entry point
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
└── README.md                     # This file
```

## 🎯 Usage

### For Customers
1. **Join Queue** - Fill out the form with your details and customer type
2. **Get Token** - Receive your virtual token number and position
3. **Check Status** - Monitor your position and estimated wait time
4. **TV Display** - View the public queue status on large screens

### For Admins
1. **Login** - Use your admin credentials to access the dashboard
2. **Manage Queue** - Start serving, complete, or skip customers
3. **View Analytics** - Monitor performance metrics and customer insights
4. **Priority Handling** - Manage VIP and senior citizen priorities

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features

### Smart Queue Management
- **Priority System** - VIP and senior citizens get priority
- **Real-time Updates** - Live position tracking
- **Wait Time Estimation** - Intelligent time calculations
- **Token System** - Virtual tokens replace physical numbers

### Admin Controls
- **Queue Operations** - Start, complete, skip customers
- **Analytics Dashboard** - Performance metrics and insights
- **Customer Management** - View and manage all customers
- **Priority Handling** - Special treatment for VIPs and seniors

### Public Display
- **TV Mode** - Fullscreen optimized for large displays
- **Real-time Updates** - Live queue status
- **Large Text** - Easy to read from distance
- **Responsive Design** - Works on any screen size

## 📡 API Documentation

### Base URL

#### Join Queue (Public)
```http
POST /api/queue/join
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "type": "Walk-in"
}
```

#### Get Queue Status (Public)
```http
GET /api/queue/status/:id
```

#### Get Current Serving (Public)
```http
GET /api/queue/current
```

#### Get Queue List (Public)
```http
GET /api/queue/list
```

#### Start Serving (Protected)
```http
PUT /api/queue/start/:id
Authorization: Bearer <token>
```

#### Complete Serving (Protected)
```http
PUT /api/queue/complete/:id
Authorization: Bearer <token>
```

#### Increase Priority (Protected)
```http
PUT /api/queue/priority/:id
Authorization: Bearer <token>
```

#### Remove from Queue (Protected)
```http
DELETE /api/queue/:id
Authorization: Bearer <token>
```

#### Get Queue Stats (Protected)
```http
GET /api/queue/stats
Authorization: Bearer <token>
```

### Settings

#### Get Public Settings
```http
GET /api/settings/public
```

#### Get Settings (Protected)
```http
GET /api/settings
Authorization: Bearer <token>
```

#### Update Settings (Protected)
```http
PUT /api/settings/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "isPaused": false,
  "isClosed": false,
  "isMaintenanceMode": false
}
```


## 📚 Server Documentation

Detailed documentation for the backend API, database schema, and server configuration can be found in the [Server README](server/README.md).

## 🔐 Environment Variables

### Server (.env)

```env
# Server Configuration
PORT=5001

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qyra

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Optional
NODE_ENV=development
```

### Client

The application uses a centralized configuration file at `src/config/api.ts`.
To change the API URL:

1. Open `src/config/api.ts`
2. Update the `API_BASE_URL` constant:
   ```typescript
   export const API_BASE_URL = 'http://localhost:5001/api'; // For local development
   // export const API_BASE_URL = 'https://your-backend.example.com/api'; // For production
   ```

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Backend (Render)

1. Push your code to GitHub
2. Create new Web Service in Render
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `server`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)

1. Create cluster in MongoDB Atlas
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Add to server `.env` file

## 📸 UI Showcase

### Customer Interface
- Modern landing page with gradient design
- Simple queue joining form
- Real-time queue status display
- Professional PDF ticket generation

### Admin Dashboard
- Secure login with JWT authentication
- Real-time queue management
- Analytics and performance metrics
- Settings and configuration panel

## 🎨 Design System

### Colors
- **Primary Purple**: `#8B5CF6` - Brand color, CTAs
- **Dark Background**: `#0F172A` - Main background
- **Light Purple**: `#F5F3FF` - Highlights, cards
- **Gray Scale**: Various shades for text and borders

### Typography
- **Headings**: Helvetica Bold
- **Body**: Helvetica Normal
- **Monospace**: Courier (for tokens)

## 🧪 Testing

### Manual Testing

1. **Customer Flow**:
   - Join queue with different customer types
   - Check queue status
   - Download PDF ticket
   - Verify token number visibility

2. **Admin Flow**:
   - Login with credentials
   - Manage queue (start, complete, skip)
   - View analytics
   - Update settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jinay Shah**
- GitHub: [@JINAY2910](https://github.com/JINAY2910)

## 🤝 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern SaaS applications
- PDF generation powered by [jsPDF](https://github.com/parallax/jsPDF)

---

<div align="center">

**Built with ❤️ using React, TypeScript, Express, and MongoDB**

[⬆ Back to Top](#qyra---digital-queue-management-system)

</div>