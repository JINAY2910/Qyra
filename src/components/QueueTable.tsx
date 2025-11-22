import React from 'react';
import { Play, CheckCircle, Star, MoreHorizontal, Clock, User } from 'lucide-react';

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

interface QueueTableProps {
  queue: QueueItem[];
  isCompactView: boolean;
  onStartServing: (item: QueueItem) => void;
  onComplete: (item: QueueItem) => void;
  onMakePriority: (item: QueueItem) => void;
  onRemove: (item: QueueItem) => void;
}

const QueueTable: React.FC<QueueTableProps> = ({
  queue,
  isCompactView,
  onStartServing,
  onComplete,
  onMakePriority,
  onRemove
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getWaitingTime = (joinedAt: string) => {
    const minutes = Math.floor((Date.now() - new Date(joinedAt).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'vip':
        return 'bg-purple-100 text-purple-700';
      case 'senior':
        return 'bg-blue-100 text-blue-700';
      case 'online':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCustomerTypeLabel = (type: string) => {
    switch (type) {
      case 'vip':
        return 'VIP';
      case 'senior':
        return 'Senior';
      case 'online':
        return 'Online';
      default:
        return 'Walk-in';
    }
  };

  const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    className?: string;
  }> = ({ onClick, icon, text, className = '' }) => (
    <button
      onClick={onClick}
      className={`btn-action flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${className}`}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );

  if (isCompactView) {
    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Waiting Queue ({queue.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {queue.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No customers in queue</p>
            </div>
          ) : (
            queue.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-bold text-teal-600">#{item.tokenNumber}</span>
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      {item.priority > 3 && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded text-xs ${getCustomerTypeColor(item.customerType)}`}>
                        {getCustomerTypeLabel(item.customerType)}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getWaitingTime(item.joinedAt)}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <ActionButton
                      onClick={() => onStartServing(item)}
                      icon={<Play className="w-4 h-4" />}
                      text="Serve"
                      className="bg-teal-100 text-teal-700 hover:bg-teal-200"
                    />
                    <ActionButton
                      onClick={() => onMakePriority(item)}
                      icon={<Star className="w-4 h-4" />}
                      text="Priority"
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Waiting Queue ({queue.length})
        </h3>
      </div>
      
      {queue.length === 0 ? (
        <div className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No customers in queue</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wait Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-teal-600">#{item.tokenNumber}</span>
                      {item.priority > 3 && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                      {item.phone && (
                        <div className="text-sm text-gray-500">{item.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(item.customerType)}`}>
                      {getCustomerTypeLabel(item.customerType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(item.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getWaitingTime(item.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <ActionButton
                        onClick={() => onStartServing(item)}
                        icon={<Play className="w-4 h-4" />}
                        text="Serve"
                        className="bg-teal-100 text-teal-700 hover:bg-teal-200"
                      />
                      <ActionButton
                        onClick={() => onComplete(item)}
                        icon={<CheckCircle className="w-4 h-4" />}
                        text="Complete"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      />
                      <ActionButton
                        onClick={() => onMakePriority(item)}
                        icon={<Star className="w-4 h-4" />}
                        text="Priority"
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      />
                      <div className="relative">
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QueueTable;