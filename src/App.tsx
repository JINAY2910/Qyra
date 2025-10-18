import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JoinQueue from './pages/JoinQueue';
import QueueStatus from './pages/QueueStatus';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import Toast from './components/Toast';

type UserPage = 'home' | 'join' | 'status';
type AdminPage = 'login' | 'dashboard' | 'analytics';
type AppMode = 'user' | 'admin';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('user');
  const [currentUserPage, setCurrentUserPage] = useState<UserPage>('home');
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPage>('login');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentAdminPage('dashboard');
    setAppMode('admin');
    showToast('Welcome back, Admin!', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentAdminPage('login');
    setAppMode('user');
    showToast('Logged out successfully', 'info');
  };

  const renderUserPage = () => {
    switch (currentUserPage) {
      case 'home':
        return <Home onNavigate={setCurrentUserPage} onSwitchToAdmin={() => setAppMode('admin')} />;
      case 'join':
        return <JoinQueue onNavigate={setCurrentUserPage} showToast={showToast} />;
      case 'status':
        return <QueueStatus onNavigate={setCurrentUserPage} />;
      default:
        return <Home onNavigate={setCurrentUserPage} onSwitchToAdmin={() => setAppMode('admin')} />;
    }
  };

  const renderAdminPage = () => {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} onBackToUser={() => setAppMode('user')} />;
    }

    switch (currentAdminPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setCurrentAdminPage} onLogout={handleAdminLogout} showToast={showToast} />;
      case 'analytics':
        return <AdminAnalytics onNavigate={setCurrentAdminPage} onLogout={handleAdminLogout} />;
      default:
        return <AdminDashboard onNavigate={setCurrentAdminPage} onLogout={handleAdminLogout} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen">
      {appMode === 'user' && <Navbar currentPage={currentUserPage} onNavigate={setCurrentUserPage} />}
      {appMode === 'user' ? renderUserPage() : renderAdminPage()}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;