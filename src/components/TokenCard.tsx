import React from 'react';
import { Play, CheckCircle, Users, Clock, User } from 'lucide-react';

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

interface TokenCardProps {
  serving: QueueItem | null;
  onStartServing: (item: QueueItem) => void;
  onComplete: (item: QueueItem) => void;
  queue: QueueItem[];
}

const TokenCard: React.FC<TokenCardProps> = ({ serving, onStartServing, onComplete, queue }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'vip':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'senior':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'online':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCustomerTypeLabel = (type: string) => {
    switch (type) {
      case 'vip':
        return 'VIP';
      case 'senior':
        return 'Senior Citizen';
      case 'online':
        return 'Online Booking';
      default:
        return 'Walk-in';
    }
  };

  if (serving) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Currently Serving</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-teal-600 mb-2">#{serving.tokenNumber}</div>
          <div className="text-xl font-semibold text-gray-900 mb-2">{serving.name}</div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCustomerTypeColor(serving.customerType)}`}>
            {getCustomerTypeLabel(serving.customerType)}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Started serving at:</span>
            <span className="font-medium text-gray-900">{formatTime(serving.joinedAt)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Service duration:</span>
            <span className="font-medium text-gray-900">
              {Math.floor((Date.now() - new Date(serving.joinedAt).getTime()) / 60000)} min
            </span>
          </div>

          {serving.phone && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{serving.phone}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onComplete(serving)}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Mark as Completed</span>
        </button>
      </div>
    );
  }

  // Show next customer to serve
  const nextCustomer = queue.find(item => item.status === 'waiting');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Current Service</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-500 font-medium">Waiting</span>
        </div>
      </div>

      {nextCustomer ? (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">Next: #{nextCustomer.tokenNumber}</div>
            <div className="text-lg text-gray-700 mb-2">{nextCustomer.name}</div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCustomerTypeColor(nextCustomer.customerType)}`}>
              {getCustomerTypeLabel(nextCustomer.customerType)}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Joined at:</span>
              <span className="font-medium text-gray-900">{formatTime(nextCustomer.joinedAt)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Waiting time:</span>
              <span className="font-medium text-gray-900">
                {Math.floor((Date.now() - new Date(nextCustomer.joinedAt).getTime()) / 60000)} min
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Priority:</span>
              <span className={`font-medium ${nextCustomer.priority > 3 ? 'text-red-600' : 'text-gray-900'}`}>
                {nextCustomer.priority > 3 ? 'High' : 'Normal'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onStartServing(nextCustomer)}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Serving</span>
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-lg font-semibold text-gray-500 mb-2">No customers waiting</div>
          <p className="text-gray-400 text-sm">New customers will appear here when they join the queue</p>
        </div>
      )}
    </div>
  );
};

export default TokenCard;