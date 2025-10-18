# Qyra - Next-Gen Queue Management System

Qyra is a digital queue management system designed to minimize waiting times. Users can join and monitor queues from their devices in real-time. Admins can manage and optimize queues efficiently, enhancing overall service.

## ✨ Features

### 🧍‍♂️ User Interface
- **Modern Home Page** - Futuristic design with purple gradients and animations
- **Join Queue** - Smart form with customer type selection (Walk-in, VIP, Senior)
- **Queue Status** - TV-friendly display with fullscreen mode for public areas
- **Real-time Updates** - Live queue position and wait time estimates

### 🧑‍💼 Admin Interface
- **Secure Login** - Admin authentication with demo credentials
- **Dashboard** - Complete queue management with real-time controls
- **Analytics** - Performance metrics and customer insights
- **Queue Management** - Start serving, complete, skip customers with priority handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JINAY2910/Qyra.git
   cd Qyra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Main navigation
│   └── Toast.tsx       # Notification system
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page
│   ├── JoinQueue.tsx   # Customer queue joining
│   ├── QueueStatus.tsx # Public queue display
│   ├── AdminLogin.tsx  # Admin authentication
│   ├── AdminDashboard.tsx # Queue management
│   └── AdminAnalytics.tsx # Performance metrics
├── data/               # Sample data and types
└── App.tsx            # Main application component
```

## 🎯 Usage

### For Customers
1. **Join Queue** - Fill out the form with your details and customer type
2. **Get Token** - Receive your virtual token number and position
3. **Check Status** - Monitor your position and estimated wait time
4. **TV Display** - View the public queue status on large screens

### For Admins
1. **Login** - Use demo credentials: `admin@qyra.com` / `admin123`
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

## 🔮 Future Enhancements

- **Backend Integration** - Connect to real database and APIs
- **Push Notifications** - SMS and email alerts
- **Multi-location Support** - Manage multiple queues
- **Advanced Analytics** - Detailed reporting and insights
- **Mobile App** - Native mobile applications
- **QR Code Integration** - Easy queue joining

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

## 📱 Responsive Design

The application is built with a mobile-first approach and works seamlessly across:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 📺 Large displays (4K TV support)

## 🎭 Demo Credentials

**Admin Login:**
- Email: `admin@qyra.com`
- Password: `admin123`

## 📄 License

## License

This project is licensed under the [MIT License](LICENSE).

---

**Qyra** - Your turn, simplified. 🚀