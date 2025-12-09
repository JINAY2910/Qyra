import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JoinQueue from './pages/JoinQueue';
import QueueStatus from './pages/QueueStatus';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import Toast from './components/Toast';

import { API_BASE_URL } from './config/api';

type UserPage = 'home' | 'join' | 'status';
type AdminPage = 'login' | 'dashboard' | 'settings';
type AppMode = 'user' | 'admin';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('user');
  const [currentUserPage, setCurrentUserPage] = useState<UserPage>('home');
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPage>('login');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Check maintenance mode
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/public`);
        const data = await response.json();
        if (response.ok && data.success) {
          setIsMaintenanceMode(data.data.isMaintenanceMode);
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      }
    };

    checkMaintenanceMode();
    const interval = setInterval(checkMaintenanceMode, 5000);
    return () => clearInterval(interval);
  }, []);

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
    // Show maintenance message if maintenance mode is enabled
    if (isMaintenanceMode && appMode === 'user') {
      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">Shop Under Maintenance</h1>
            <button
              onClick={() => setAppMode('admin')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Login
            </button>
          </div>
        </div>
      );
    }

    switch (currentUserPage) {
      case 'home':
        return <Home onNavigate={setCurrentUserPage} onSwitchToAdmin={() => setAppMode('admin')} />;
      case 'join':
        return <JoinQueue onNavigate={setCurrentUserPage} showToast={showToast} />;
      case 'status':
        return <QueueStatus onNavigate={setCurrentUserPage} onFullscreenChange={setIsFullscreen} />;
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
      case 'settings':
        return <AdminSettings onNavigate={setCurrentAdminPage} onLogout={handleAdminLogout} showToast={showToast} />;
      default:
        return <AdminDashboard onNavigate={setCurrentAdminPage} onLogout={handleAdminLogout} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen">
      {appMode === 'user' && !isFullscreen && <Navbar currentPage={currentUserPage} onNavigate={setCurrentUserPage} />}
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