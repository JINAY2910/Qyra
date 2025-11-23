import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize, Minimize2, Users, Clock, Crown, Heart, User, Sparkles, Pause } from 'lucide-react';
import QyraLogo from '../components/QyraLogo';

type UserPage = 'home' | 'join' | 'status';

interface QueueStatusProps {
  onNavigate: (page: UserPage) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const QueueStatus: React.FC<QueueStatusProps> = ({ onNavigate, onFullscreenChange }) => {
  const [serving, setServing] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Fetch currently serving token
  useEffect(() => {
    const fetchCurrentServing = async () => {
      try {
        const response = await fetch('https://qyra.onrender.com/api/queue/current');
        const data = await response.json();

        if (response.ok && data.success && data.data) {
          // Map backend data to frontend format
          const typeMap: { [key: string]: string } = {
            'Walk-in': 'walk-in',
            'VIP': 'vip',
            'Senior': 'senior'
          };
          
          setServing({
            id: data.data.id,
            tokenNumber: data.data.tokenNumber,
            name: data.data.name,
            customerType: typeMap[data.data.type] || 'walk-in',
            joinedAt: data.data.startedAt || new Date().toISOString(),
            phone: data.data.phone,
            email: data.data.email,
            priority: 1,
            status: 'serving'
          });
        } else {
          setServing(null);
        }
      } catch (error) {
        console.error('Error fetching current serving:', error);
        setServing(null);
      }
    };

    fetchCurrentServing();
    // Refresh every 1 second for real-time updates
    const interval = setInterval(fetchCurrentServing, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch queue list
  useEffect(() => {
    const fetchQueueList = async () => {
      try {
        const response = await fetch('https://qyra.onrender.com/api/queue/list');
        const data = await response.json();

        if (response.ok && data.success && data.data && data.data.queue) {
          // Filter for waiting status, sort by tokenNumber ascending, take first 6
          const typeMap: { [key: string]: string } = {
            'Walk-in': 'walk-in',
            'VIP': 'vip',
            'Senior': 'senior'
          };

          const waitingItems = data.data.queue
            .filter((item: any) => item.status === 'waiting')
            .sort((a: any, b: any) => a.tokenNumber - b.tokenNumber)
            .slice(0, 6)
            .map((item: any) => ({
              id: item.id,
              tokenNumber: item.tokenNumber,
              name: item.name,
              customerType: typeMap[item.type] || 'walk-in',
              joinedAt: item.joinedAt || item.createdAt,
              phone: item.phone,
              email: item.email,
              priority: item.priority || item.priorityLevel || 1,
              status: item.status
            }));

          setQueue(waitingItems);
        } else {
          console.error('Queue list response error:', data);
          setQueue([]);
        }
      } catch (error) {
        console.error('Error fetching queue list:', error);
        setQueue([]);
      }
    };

    fetchQueueList();
    // Refresh every 1 second for real-time updates
    const interval = setInterval(fetchQueueList, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch queue pause/closed status from backend
  useEffect(() => {
    const fetchQueuePauseStatus = async () => {
      try {
        const response = await fetch('https://qyra.onrender.com/api/settings/public');
        const data = await response.json();

        if (response.ok && data.success) {
          // Backend returns isPaused: true = paused, false = active
          // Set state directly; closed takes precedence when rendering
          setIsPaused(Boolean(data.data?.isPaused));
          setIsClosed(Boolean(data.data?.isClosed));
        }
      } catch (error) {
        console.error('Error fetching queue pause status:', error);
        // On error, assume queue is active (not paused)
        setIsPaused(false);
        setIsClosed(false);
      }
    };

    // Fetch immediately on mount
    fetchQueuePauseStatus();
    // Refresh every 1 second to check pause status (same as queue updates)
    const interval = setInterval(fetchQueuePauseStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Fullscreen not supported:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenNow);
      if (onFullscreenChange) {
        onFullscreenChange(isFullscreenNow);
      }
      // Prevent body scrolling when in fullscreen
      if (isFullscreenNow) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = '';
    };
  }, [onFullscreenChange]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCustomerTypeInfo = (type: string) => {
    switch (type) {
      case 'vip':
        return { label: 'VIP', color: 'yellow', icon: Crown, iconClass: 'text-yellow-400', textClass: 'text-yellow-300' };
      case 'senior':
        return { label: 'Senior', color: 'red', icon: Heart, iconClass: 'text-red-400', textClass: 'text-red-300' };
      case 'online':
        return { label: 'Online', color: 'green', icon: Sparkles, iconClass: 'text-green-400', textClass: 'text-green-300' };
      default:
        return { label: 'Walk-in', color: 'blue', icon: User, iconClass: 'text-blue-400', textClass: 'text-blue-300' };
    }
  };

  if (isFullscreen) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 text-white overflow-hidden relative flex flex-col">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div className="flex items-center space-x-6">
              <QyraLogo size="xl" showText={true} />
            </div>
            <div className="text-right">
              <div className="text-4xl font-mono text-white">{formatTime(currentTime)}</div>
              <div className="text-primary-300 text-lg">{currentTime.toLocaleDateString()}</div>
            </div>
          </div>

          {/* Queue Closed/Paused Message (Fullscreen) */}
          {(isClosed || isPaused) && (
            <div className="mb-6 flex-shrink-0">
              <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 mx-auto max-w-4xl text-center">
                <h3 className="text-3xl font-bold text-yellow-300 mb-2">
                  {isClosed ? 'Shop is closed for today' : 'Queue is Paused'}
                </h3>
                <p className="text-xl text-yellow-200">
                  {isClosed ? 'Please come back tomorrow' : 'New tokens are not being issued at this time'}
                </p>
              </div>
            </div>
          )}

          {/* Currently Serving (hide when closed) */}
          {!isClosed && (
          <div className="text-center mb-8 flex-shrink-0">
            <h2 className="text-5xl font-bold mb-6 text-white">Now Serving</h2>
            {serving ? (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 mx-auto max-w-5xl border-2 border-primary-400">
                <div className="text-8xl font-bold mb-4">#{serving.tokenNumber}</div>
                <div className="text-3xl mb-4">{serving.name}</div>
                <div className="flex items-center justify-center gap-3">
                  {(() => {
                    const typeInfo = getCustomerTypeInfo(serving.customerType);
                    const Icon = typeInfo.icon;
                    return (
                      <>
                        <Icon className={`w-7 h-7 ${typeInfo.iconClass}`} />
                        <span className={`text-xl ${typeInfo.textClass}`}>
                          {typeInfo.label} Customer
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="glass-dark rounded-3xl p-12 mx-auto max-w-5xl">
                <div className="text-6xl font-bold mb-4 text-dark-300">No one being served</div>
                <div className="text-2xl text-dark-400">Please wait for the next customer</div>
              </div>
            )}
          </div>
          )}

          {/* Next in Queue (hide when closed) */}
          {!isClosed && (
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <h3 className="text-4xl font-bold text-center mb-6 text-white flex-shrink-0">Next in Queue</h3>
            {queue.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto flex-shrink-0">
                {queue.map((item, index) => {
                  const typeInfo = getCustomerTypeInfo(item.customerType);
                  const Icon = typeInfo.icon;
                  const position = index + 1;
                  const positionColors = [
                    'from-yellow-500/20 to-yellow-600/30 border-yellow-400/40',
                    'from-gray-400/20 to-gray-500/30 border-gray-300/40',
                    'from-orange-500/20 to-orange-600/30 border-orange-400/40',
                    'from-blue-500/20 to-blue-600/30 border-blue-400/40',
                    'from-purple-500/20 to-purple-600/30 border-purple-400/40',
                    'from-pink-500/20 to-pink-600/30 border-pink-400/40',
                  ];
                  const positionColor = positionColors[index] || positionColors[5];
                  
                  return (
                    <div
                      key={item.id}
                      className={`relative bg-gradient-to-br ${positionColor} backdrop-blur-md rounded-2xl p-4 text-center hover:scale-110 transition-all duration-300 shadow-2xl border-2 hover:shadow-primary-500/50 group min-w-0`}
                    >
                      {/* Position Badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20">
                        {position}
                      </div>
                      
                      {/* Token Number */}
                      <div className="text-2xl font-bold mb-2 text-primary-300 group-hover:scale-110 transition-transform duration-300 whitespace-nowrap overflow-visible min-w-0">
                        #{item.tokenNumber}
                      </div>
                      
                      {/* Name */}
                      <div className="queue-next-name text-base font-semibold mb-2 truncate drop-shadow-lg">
                        {item.name}
                      </div>
                      
                      {/* Customer Type */}
                      <div className="queue-next-type flex items-center justify-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1 backdrop-blur-sm">
                        <Icon className={`w-4 h-4 ${typeInfo.iconClass} drop-shadow-lg`} />
                        <span className={`text-xs font-medium ${typeInfo.textClass}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-2xl text-dark-400 flex-shrink-0">
                No customers waiting
              </div>
            )}
          </div>
          )}

          {/* Exit Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="fixed bottom-8 right-8 glass hover:bg-white/20 text-white p-4 rounded-xl transition-all duration-300 opacity-70 hover:opacity-100 z-50 shadow-xl border border-white/10"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="glass-dark border-b border-dark-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Queue Status</h1>
                  <p className="text-primary-200">Public display view</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-mono text-white font-bold">{formatTime(currentTime)}</div>
                  <div className="text-lg text-primary-300">{currentTime.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Queue Closed/Paused Message */}
          {(isClosed || isPaused) && (
            <div className="mb-8">
              <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 mx-auto max-w-3xl text-center">
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                  {isClosed ? 'Shop is closed for today' : 'Queue is Paused'}
                </h3>
                <p className="text-lg text-yellow-200">
                  {isClosed ? 'Please come back tomorrow' : 'New tokens are not being issued at this time'}
                </p>
              </div>
            </div>
          )}

          {/* Currently Serving (hide when closed) */}
          {!isClosed && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 text-white">Now Serving</h2>
            {serving ? (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white mx-auto max-w-2xl shadow-xl border-2 border-primary-400">
                <div className="text-7xl font-bold mb-4">#{serving.tokenNumber}</div>
                <div className="text-2xl mb-3">{serving.name}</div>
                <div className="flex items-center justify-center gap-2">
                  {(() => {
                    const typeInfo = getCustomerTypeInfo(serving.customerType);
                    const Icon = typeInfo.icon;
                    return (
                      <>
                        <Icon className={`w-6 h-6 ${typeInfo.iconClass}`} />
                        <span className={`text-lg ${typeInfo.textClass}`}>
                          {typeInfo.label} Customer
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="card mx-auto max-w-2xl">
                <Users className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2 text-white">No one being served</div>
                <div className="text-lg text-dark-300">Please wait for the next customer</div>
              </div>
            )}
          </div>
          )}

          {/* Next in Queue (hide when closed) */}
          {!isClosed && (
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-white">Next in Queue</h3>
            {queue.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {queue.map((item, index) => {
                  const typeInfo = getCustomerTypeInfo(item.customerType);
                  const Icon = typeInfo.icon;
                  const position = index + 1;
                  const positionColors = [
                    'from-yellow-500/20 to-yellow-600/30 border-yellow-400/40',
                    'from-gray-400/20 to-gray-500/30 border-gray-300/40',
                    'from-orange-500/20 to-orange-600/30 border-orange-400/40',
                    'from-blue-500/20 to-blue-600/30 border-blue-400/40',
                    'from-purple-500/20 to-purple-600/30 border-purple-400/40',
                    'from-pink-500/20 to-pink-600/30 border-pink-400/40',
                  ];
                  const positionColor = positionColors[index] || positionColors[5];
                  
                  return (
                    <div
                      key={item.id}
                      className={`relative bg-gradient-to-br ${positionColor} backdrop-blur-md rounded-2xl p-5 text-center hover:scale-110 transition-all duration-300 shadow-xl border-2 hover:shadow-primary-500/50 group min-w-0`}
                    >
                      {/* Position Badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20">
                        {position}
                      </div>
                      
                      {/* Token Number */}
                      <div className="text-2xl font-bold mb-2 text-primary-300 group-hover:scale-110 transition-transform duration-300 whitespace-nowrap overflow-visible min-w-0">
                        #{item.tokenNumber}
                      </div>
                      
                      {/* Name */}
                      <div className="text-base font-semibold mb-2 truncate text-white drop-shadow-md">
                        {item.name}
                      </div>
                      
                      {/* Customer Type */}
                      <div className="flex items-center justify-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1 backdrop-blur-sm">
                        <Icon className={`w-4 h-4 ${typeInfo.iconClass} drop-shadow-md`} />
                        <span className={`text-xs font-medium ${typeInfo.textClass}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <div className="text-xl text-dark-300">No customers waiting</div>
              </div>
            )}
          </div>
          )}

          {/* Instructions */}
          <div className="mt-16 card p-8 text-center bg-gradient-to-br from-primary-600/20 to-primary-800/20 border-primary-500/30">
            <h4 className="text-lg font-semibold text-white mb-2">
              For the best TV display experience
            </h4>
            <p className="text-primary-200 mb-4">
              Click the fullscreen button to optimize this view for large screens and public displays.
            </p>
            <button
              onClick={toggleFullscreen}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Maximize className="w-5 h-5" />
              <span>Enter Fullscreen Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;