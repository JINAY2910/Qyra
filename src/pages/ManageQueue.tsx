import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, MoreHorizontal, Play, CheckCircle, Star, Users, Clock, TrendingUp } from 'lucide-react';
import TokenCard from '../components/TokenCard';
import QueueTable from '../components/QueueTable';
import Modal from '../components/Modal';
import AdminControls from '../components/AdminControls';
import { sampleQueue, currentServing } from '../data/sampleQueue';

type Page = 'home' | 'join' | 'manage' | 'status';

interface ManageQueueProps {
  onNavigate: (page: Page) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface QueueItem {
  id: string;
  tokenNumber: number;
  name: string;
  customerType: 'walk-in' | 'online' | 'vip' | 'senior';
  joinedAt: string;
  phone?: string;
  email?: string;
  priority: number;
  status: 'waiting' | 'serving' | 'completed';
}

const ManageQueue: React.FC<ManageQueueProps> = ({ onNavigate, showToast }) => {
  const [queue, setQueue] = useState<QueueItem[]>(sampleQueue);
  const [serving, setServing] = useState(currentServing);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCompactView, setIsCompactView] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    item: QueueItem;
    action: 'serve' | 'complete' | 'priority' | 'remove';
  } | null>(null);

  // Filter and search queue
  const filteredQueue = queue.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tokenNumber.toString().includes(searchTerm);
    const matchesFilter = filterType === 'all' || item.customerType === filterType;
    return matchesSearch && matchesFilter && item.status === 'waiting';
  });

  // Sort by priority (higher first) and then by join time
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });

  // Stats calculations
  const todayServed = queue.filter(item => 
    item.status === 'completed' && 
    new Date(item.joinedAt).toDateString() === new Date().toDateString()
  ).length;

  const avgWaitTime = '12 min'; // In real app, calculate from completed items
  const currentWaiting = queue.filter(item => item.status === 'waiting').length;

  const handleStartServing = async (item: QueueItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/queue/start/${item.id}`, {
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
        // Move current serving back to queue if exists
        if (serving) {
          setQueue(prev => prev.map(q => 
            q.id === serving.id ? { ...q, status: 'waiting' } : q
          ));
        }

        // Set new serving
        setServing(item);
        setQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: 'serving' } : q
        ));
        
        showToast(`Now serving Token #${item.tokenNumber}`, 'success');
      } else {
        throw new Error(data.message || 'Failed to start serving');
      }
    } catch (error) {
      console.error('Error starting service:', error);
      showToast('Failed to start serving. Please try again.', 'error');
    }
    setSelectedAction(null);
  };

  const handleComplete = async (item: QueueItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/queue/complete/${item.id}`, {
        method: 'PUT',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete service');
      }
      
      setQueue(prev => prev.map(q => 
        q.id === item.id ? { ...q, status: 'completed' } : q
      ));
      
      // Clear serving if this was the current item
      if (serving && serving.id === item.id) {
        setServing(null);
      }
      
      showToast(`Token #${item.tokenNumber} completed!`, 'success');
    } catch (error) {
      console.error('Error completing service:', error);
      showToast('Failed to complete service. Please try again.', 'error');
    }
    setSelectedAction(null);
  };

  const handleMakePriority = async (item: QueueItem) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQueue(prev => prev.map(q => 
        q.id === item.id ? { ...q, priority: Math.max(q.priority, 5) } : q
      ));
      
      showToast(`Token #${item.tokenNumber} marked as priority`, 'success');
    } catch (error) {
      showToast('Failed to update priority. Please try again.', 'error');
    }
    setSelectedAction(null);
  };

  const handleRemove = async (item: QueueItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/queue/${item.id}`, {
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
        setQueue(prev => prev.filter(q => q.id !== item.id));
        
        // Clear serving if this was the current item
        if (serving && serving.id === item.id) {
          setServing(null);
        }
        
        showToast(`Token #${item.tokenNumber} removed from queue`, 'success');
      } else {
        throw new Error(data.message || 'Failed to remove from queue');
      }
    } catch (error) {
      console.error('Error removing customer:', error);
      showToast('Failed to remove from queue. Please try again.', 'error');
    }
    setSelectedAction(null);
  };

  const executeAction = () => {
    if (!selectedAction) return;

    switch (selectedAction.action) {
      case 'serve':
        handleStartServing(selectedAction.item);
        break;
      case 'complete':
        handleComplete(selectedAction.item);
        break;
      case 'priority':
        handleMakePriority(selectedAction.item);
        break;
      case 'remove':
        handleRemove(selectedAction.item);
        break;
    }
  };

  const getActionModalContent = () => {
    if (!selectedAction) return { title: '', message: '', confirmText: '', type: 'info' as const };

    const { item, action } = selectedAction;
    
    switch (action) {
      case 'serve':
        return {
          title: 'Start Serving Customer',
          message: `Are you ready to serve Token #${item.tokenNumber} (${item.name})?`,
          confirmText: 'Start Serving',
          type: 'info' as const
        };
      case 'complete':
        return {
          title: 'Complete Service',
          message: `Mark Token #${item.tokenNumber} (${item.name}) as completed?`,
          confirmText: 'Complete',
          type: 'success' as const
        };
      case 'priority':
        return {
          title: 'Make Priority',
          message: `Give Token #${item.tokenNumber} (${item.name}) priority status?`,
          confirmText: 'Make Priority',
          type: 'info' as const
        };
      case 'remove':
        return {
          title: 'Remove from Queue',
          message: `Remove Token #${item.tokenNumber} (${item.name}) from the queue? This action cannot be undone.`,
          confirmText: 'Remove',
          type: 'error' as const
        };
      default:
        return {
          title: 'Confirm Action',
          message: 'Are you sure you want to perform this action?',
          confirmText: 'Confirm',
          type: 'info' as const
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Queue Management</h1>
                <p className="text-gray-600 hidden sm:block">Manage your customer queue and service flow</p>
              </div>
            </div>

            <AdminControls 
              isCompactView={isCompactView}
              onToggleView={() => setIsCompactView(!isCompactView)}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Currently Waiting</p>
                  <p className="text-2xl font-bold">{currentWaiting}</p>
                </div>
                <Users className="w-8 h-8 text-teal-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Served Today</p>
                  <p className="text-2xl font-bold">{todayServed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-indigo-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Time Per Customer</p>
                  <p className="text-2xl font-bold">{avgWaitTime}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Efficiency</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or token number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none bg-white appearance-none min-w-[150px]"
              >
                <option value="all">All Types</option>
                <option value="walk-in">Walk-in</option>
                <option value="online">Online</option>
                <option value="vip">VIP</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${isCompactView ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
          {/* Current Serving Card */}
          <div className={`${isCompactView ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <TokenCard 
              serving={serving}
              onStartServing={(item) => setSelectedAction({ item, action: 'serve' })}
              onComplete={(item) => setSelectedAction({ item, action: 'complete' })}
              queue={sortedQueue}
            />
          </div>

          {/* Queue Table */}
          <div className={`${isCompactView ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <QueueTable 
              queue={sortedQueue}
              isCompactView={isCompactView}
              onStartServing={(item) => setSelectedAction({ item, action: 'serve' })}
              onComplete={(item) => setSelectedAction({ item, action: 'complete' })}
              onMakePriority={(item) => setSelectedAction({ item, action: 'priority' })}
              onRemove={(item) => setSelectedAction({ item, action: 'remove' })}
            />
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {selectedAction && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAction(null)}
          title={getActionModalContent().title}
          type={getActionModalContent().type}
        >
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              {getActionModalContent().message}
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
                  getActionModalContent().type === 'error'
                    ? 'bg-red-600 hover:bg-red-700'
                    : getActionModalContent().type === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {getActionModalContent().confirmText}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageQueue;