import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
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
  Heart
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
  onNavigate: (page: 'dashboard' | 'analytics') => void;
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout, showToast }) => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics'>('dashboard');
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', token: 'A001', name: 'John Smith', type: 'vip', priority: 1, joinTime: '10:30 AM', status: 'serving' },
    { id: '2', token: 'A002', name: 'Sarah Johnson', type: 'walk-in', priority: 3, joinTime: '10:35 AM', status: 'waiting' },
    { id: '3', token: 'A003', name: 'Robert Davis', type: 'senior', priority: 2, joinTime: '10:40 AM', status: 'waiting' },
    { id: '4', token: 'A004', name: 'Emily Wilson', type: 'walk-in', priority: 4, joinTime: '10:45 AM', status: 'waiting' },
    { id: '5', token: 'A005', name: 'Michael Brown', type: 'vip', priority: 1, joinTime: '10:50 AM', status: 'waiting' },
  ]);

  const [isQueueActive, setIsQueueActive] = useState(true);

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

  const handleStartServing = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'serving' as const } : 
      item.status === 'serving' ? { ...item, status: 'waiting' as const } : item
    ));
    showToast('Started serving customer', 'success');
  };

  const handleComplete = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'completed' as const } : item
    ));
    showToast('Customer served successfully', 'success');
  };

  const handleSkip = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'waiting' as const } : item
    ));
    showToast('Customer skipped', 'info');
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
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentPage === 'dashboard' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-dark-300 hover:bg-dark-800/50 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentPage === 'analytics' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-dark-300 hover:bg-dark-800/50 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:bg-dark-800/50 hover:text-white transition-all duration-300">
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
                onClick={() => setIsQueueActive(!isQueueActive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isQueueActive 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {isQueueActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isQueueActive ? 'Queue Active' : 'Queue Paused'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Currently Serving</p>
                <p className="text-2xl font-bold text-white">{currentlyServing?.token || 'None'}</p>
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
                <p className="text-dark-400 text-sm">Completed Today</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Avg Wait Time</p>
                <p className="text-2xl font-bold text-white">8m</p>
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
                  <div className="w-24 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white animate-pulse">
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

