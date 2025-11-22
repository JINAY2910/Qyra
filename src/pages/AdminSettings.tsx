import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Pause,
  XCircle,
  Wrench,
  Save,
  Clock
} from 'lucide-react';
import QyraLogo from '../components/QyraLogo';

interface AdminSettingsProps {
  onNavigate: (page: 'dashboard') => void;
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate, onLogout, showToast }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Shop settings
  const [isPaused, setIsPaused] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  
  // Admin settings
  const [avgTimePerCustomer, setAvgTimePerCustomer] = useState(10);
  
  // Mutually exclusive toggles
  const togglePaused = () => {
    setIsPaused(prev => {
      const next = !prev;
      if (next) {
        setIsClosed(false);
        setIsMaintenanceMode(false);
      }
      return next;
    });
  };

  const toggleClosed = () => {
    setIsClosed(prev => {
      const next = !prev;
      if (next) {
        setIsPaused(false);
        setIsMaintenanceMode(false);
      }
      return next;
    });
  };

  const toggleMaintenance = () => {
    setIsMaintenanceMode(prev => {
      const next = !prev;
      if (next) {
        setIsPaused(false);
        setIsClosed(false);
      }
      return next;
    });
  };
  
  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/settings', {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsPaused(data.data.isPaused);
          setIsClosed(data.data.isClosed);
          setIsMaintenanceMode(data.data.isMaintenanceMode);
          setAvgTimePerCustomer(data.data.avgTimePerCustomer || 10);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        showToast('Failed to load settings', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [showToast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/settings/update', {
        method: 'PUT',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isPaused,
          isClosed,
          isMaintenanceMode,
          avgTimePerCustomer,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Settings saved successfully', 'success');
      } else {
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 glass-dark z-20">
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <QyraLogo size="sm" />
            <p className="text-xs text-dark-400 mt-2 ml-1">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:bg-dark-800/50 hover:text-white transition-all duration-300"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 text-white transition-all duration-300">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-poppins">Settings</h1>
          <p className="text-dark-300 mt-2">Manage your shop settings and preferences</p>
        </div>

        
        {/* Shop Closure & Maintenance Mode Section */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Shop Closure & Maintenance Mode</h2>
          </div>

          <div className="space-y-6">
            {/* Pause Queue Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pause className="w-5 h-5 text-yellow-400" />
                <div>
                  <label className="text-white font-medium">Pause Queue</label>
                  <p className="text-sm text-dark-300">Stop new tokens from being issued</p>
                </div>
              </div>
              <button
                onClick={togglePaused}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                  isPaused ? 'bg-yellow-600' : 'bg-dark-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    isPaused ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Close Shop Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <label className="text-white font-medium">Close Shop for Today</label>
                  <p className="text-sm text-dark-300">Disable all new queue activity</p>
                </div>
              </div>
              <button
                onClick={toggleClosed}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                  isClosed ? 'bg-red-600' : 'bg-dark-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    isClosed ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-orange-400" />
                <div>
                  <label className="text-white font-medium">Maintenance Mode</label>
                  <p className="text-sm text-dark-300">Block all user pages, show maintenance message</p>
                </div>
              </div>
              <button
                onClick={toggleMaintenance}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                  isMaintenanceMode ? 'bg-orange-600' : 'bg-dark-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Average Time Per Customer Section */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Queue Management</h2>
          </div>

          <div>
            <label className="block text-white font-medium mb-3">
              Average Time Per Customer (minutes)
            </label>
            <p className="text-sm text-dark-300 mb-4">
              Set the average time it takes to serve each customer. This is used for wait time calculations.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                max="120"
                value={avgTimePerCustomer}
                onChange={(e) => setAvgTimePerCustomer(parseInt(e.target.value) || 10)}
                className="input-field w-32"
              />
              <span className="text-dark-300">minutes</span>
            </div>
            <p className="text-xs text-dark-400 mt-2">
              Range: 1-120 minutes
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`btn-primary flex items-center gap-2 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

