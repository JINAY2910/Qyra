import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Play,
  Pause,
  SkipForward,
  UserCheck,
  Crown,
  Heart,
  Trash2
} from 'lucide-react';
import QyraLogo from '../components/QyraLogo';

interface QueueItem {
  id: string;
  token: string;
  name: string;
  type: 'walk-in' | 'vip' | 'senior';
  priority: number;
  joinTime: string;
  status: 'waiting' | 'serving' | 'completed';
}

interface AdminDashboardProps {
  onNavigate: (page: 'dashboard' | 'settings') => void;
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout, showToast }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isQueuePaused, setIsQueuePaused] = useState(false);

  // Fetch queue pause status from backend
  useEffect(() => {
    const fetchQueueStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/settings', {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Backend stores isPaused: true = paused, false = active
          setIsQueuePaused(Boolean(data.data.isPaused));
        }
      } catch (error) {
        console.error('Error fetching queue status:', error);
      }
    };

    fetchQueueStatus();
  }, []);

  // Fetch queue list function
  const fetchQueueList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/queue/list', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Map backend data to frontend format
        const mappedQueue = data.data.queue.map((item: any) => ({
          id: item.id,
          token: `#${item.tokenNumber}`,
          name: item.name,
          type: item.customerType || item.type.toLowerCase().replace('-', '-') as 'walk-in' | 'vip' | 'senior',
          priority: item.priority || item.priorityLevel,
          joinTime: new Date(item.joinedAt || item.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: item.status
        }));
        setQueue(mappedQueue);
      }
    } catch (error) {
      console.error('Error fetching queue list:', error);
    }
  };

  // Fetch queue list on component mount
  useEffect(() => {
    fetchQueueList();
  }, []);


  // Handle queue pause/unpause toggle
  const handleQueueToggle = async () => {
    // Toggle pause state: if currently paused, resume it; if active, pause it
    const newPauseState = !isQueuePaused;
    
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
          isPaused: newPauseState,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state with the new pause status
        setIsQueuePaused(newPauseState);
        
        // Show appropriate message based on the action taken
        if (newPauseState) {
          showToast('Queue paused', 'success');
        } else {
          showToast('Queue resumed', 'success');
        }
      } else {
        throw new Error(data.message || 'Failed to update queue status');
      }
    } catch (error) {
      console.error('Error updating queue status:', error);
      showToast('Failed to update queue status. Please try again.', 'error');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vip': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'senior': return <Heart className="w-4 h-4 text-red-400" />;
      default: return <Users className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vip': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'senior': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const handleStartServing = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/queue/start/${id}`, {
        method: 'PUT',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh queue list to get the latest state from backend
        await fetchQueueList();
        showToast('Started serving customer', 'success');
      } else {
        throw new Error(data.message || 'Failed to start serving');
      }
    } catch (error) {
      console.error('Error starting service:', error);
      showToast('Failed to start serving. Please try again.', 'error');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/queue/complete/${id}`, {
        method: 'PUT',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQueue(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'completed' as const } : item
        ));
        showToast('Customer served successfully', 'success');
      } else {
        throw new Error(data.message || 'Failed to complete service');
      }
    } catch (error) {
      console.error('Error completing service:', error);
      showToast('Failed to complete service. Please try again.', 'error');
    }
  };

  const handleSkip = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'waiting' as const } : item
    ));
    showToast('Customer skipped', 'info');
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this customer from the queue? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/queue/${id}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove from local state
        setQueue(prev => prev.filter(item => item.id !== id));
        // Refresh queue list to get the latest state from backend
        await fetchQueueList();
        showToast('Customer removed from queue', 'success');
      } else {
        // Show the specific error message from backend
        const errorMessage = data.message || 'Failed to remove customer';
        showToast(errorMessage, 'error');
      }
    } catch (error: any) {
      console.error('Error removing customer:', error);
      const errorMessage = error.message || 'Failed to remove customer. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const currentlyServing = queue.find(item => item.status === 'serving');
  const waitingQueue = queue.filter(item => item.status === 'waiting').sort((a, b) => a.priority - b.priority);

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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 text-white transition-all duration-300"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:bg-dark-800/50 hover:text-white transition-all duration-300"
            >
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-poppins">Welcome back, Admin!</h1>
              <p className="text-dark-300 mt-2">Manage your queue efficiently</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleQueueToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  !isQueuePaused 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {!isQueuePaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {!isQueuePaused ? 'Queue Active' : 'Queue Paused'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Currently Serving</p>
                <p className="text-2xl font-bold text-white whitespace-nowrap overflow-hidden">{currentlyServing?.token || 'None'}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Waiting</p>
                <p className="text-2xl font-bold text-white">{waitingQueue.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Avg Time Per Customer</p>
                <p className="text-2xl font-bold text-white">10m</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Currently Serving */}
        {currentlyServing && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Currently Serving</h2>
            <div className="card bg-gradient-to-r from-primary-600/20 to-primary-700/20 border-primary-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-auto min-w-24 h-16 bg-primary-600 rounded-2xl flex items-center justify-center px-4 text-2xl font-bold text-white animate-pulse whitespace-nowrap">
                    {currentlyServing.token}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{currentlyServing.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(currentlyServing.type)}
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getTypeColor(currentlyServing.type)}`}>
                        {currentlyServing.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleComplete(currentlyServing.id)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleSkip(currentlyServing.id)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queue Table */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Queue Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Token</th>
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Join Time</th>
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-dark-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-lg font-bold text-primary-400">{item.token}</span>
                    </td>
                    <td className="py-4 px-4 text-white">{item.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getTypeColor(item.type)}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-yellow-400 font-semibold">#{item.priority}</span>
                    </td>
                    <td className="py-4 px-4 text-dark-300">{item.joinTime}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        item.status === 'serving' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        item.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {item.status === 'waiting' && (
                          <button
                            onClick={() => handleStartServing(item.id)}
                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {item.status === 'serving' && (
                          <button
                            onClick={() => handleComplete(item.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                          title="Remove from queue"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

