import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize, Users, Clock, Crown, Heart, User, Sparkles } from 'lucide-react';
import { currentServing, sampleQueue } from '../data/sampleQueue';
import QyraLogo from '../components/QyraLogo';

type UserPage = 'home' | 'join' | 'status';

interface QueueStatusProps {
  onNavigate: (page: UserPage) => void;
}

const QueueStatus: React.FC<QueueStatusProps> = ({ onNavigate }) => {
  const [serving] = useState(currentServing);
  const [queue] = useState(sampleQueue.filter(item => item.status === 'waiting').slice(0, 6));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
        return { label: 'VIP', color: 'yellow', icon: Crown };
      case 'senior':
        return { label: 'Senior', color: 'red', icon: Heart };
      case 'online':
        return { label: 'Online', color: 'green', icon: Sparkles };
      default:
        return { label: 'Walk-in', color: 'blue', icon: User };
    }
  };

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 text-white p-8 overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-6">
              <QyraLogo size="xl" showText={true} />
              <div className="text-3xl text-primary-200">Queue Status</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-mono text-white">{formatTime(currentTime)}</div>
              <div className="text-primary-300 text-lg">{currentTime.toLocaleDateString()}</div>
            </div>
          </div>

          {/* Currently Serving */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-12 text-white">Now Serving</h2>
            {serving ? (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-20 mx-auto max-w-5xl animate-glow">
                <div className="text-9xl font-bold mb-6">#{serving.tokenNumber}</div>
                <div className="text-4xl mb-6">{serving.name}</div>
                <div className="flex items-center justify-center gap-3">
                  {(() => {
                    const typeInfo = getCustomerTypeInfo(serving.customerType);
                    const Icon = typeInfo.icon;
                    return (
                      <>
                        <Icon className={`w-8 h-8 text-${typeInfo.color}-400`} />
                        <span className={`text-2xl text-${typeInfo.color}-300`}>
                          {typeInfo.label} Customer
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="glass-dark rounded-3xl p-20 mx-auto max-w-5xl">
                <div className="text-7xl font-bold mb-6 text-dark-300">No one being served</div>
                <div className="text-3xl text-dark-400">Please wait for the next customer</div>
              </div>
            )}
          </div>

          {/* Next in Queue */}
          <div>
            <h3 className="text-4xl font-bold text-center mb-12 text-white">Next in Queue</h3>
            {queue.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
                {queue.map((item, index) => {
                  const typeInfo = getCustomerTypeInfo(item.customerType);
                  const Icon = typeInfo.icon;
                  return (
                    <div
                      key={item.id}
                      className="glass rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
                    >
                      <div className="text-5xl font-bold mb-4 text-primary-400">#{item.tokenNumber}</div>
                      <div className="text-xl mb-3 truncate text-white">{item.name}</div>
                      <div className="flex items-center justify-center gap-2">
                        <Icon className={`w-5 h-5 text-${typeInfo.color}-400`} />
                        <span className={`text-sm text-${typeInfo.color}-300`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-3xl text-dark-400">
                No customers waiting
              </div>
            )}
          </div>

          {/* Exit Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="fixed top-8 right-8 glass hover:bg-white/20 text-white p-4 rounded-xl transition-all duration-300 opacity-70 hover:opacity-100"
            aria-label="Exit fullscreen"
          >
            <Maximize className="w-6 h-6" />
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
          {/* Currently Serving */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 text-white">Now Serving</h2>
            {serving ? (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white mx-auto max-w-2xl shadow-xl animate-glow">
                <div className="text-7xl font-bold mb-4">#{serving.tokenNumber}</div>
                <div className="text-2xl mb-3">{serving.name}</div>
                <div className="flex items-center justify-center gap-2">
                  {(() => {
                    const typeInfo = getCustomerTypeInfo(serving.customerType);
                    const Icon = typeInfo.icon;
                    return (
                      <>
                        <Icon className={`w-6 h-6 text-${typeInfo.color}-400`} />
                        <span className={`text-lg text-${typeInfo.color}-300`}>
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

          {/* Next in Queue */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-white">Next in Queue</h3>
            {queue.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {queue.map((item, index) => {
                  const typeInfo = getCustomerTypeInfo(item.customerType);
                  const Icon = typeInfo.icon;
                  return (
                    <div
                      key={item.id}
                      className="card text-center hover:scale-105 transition-transform duration-300"
                    >
                      <div className="text-4xl font-bold mb-2 text-primary-400">#{item.tokenNumber}</div>
                      <div className="text-sm mb-2 truncate font-medium text-white">{item.name}</div>
                      <div className="flex items-center justify-center gap-1">
                        <Icon className={`w-4 h-4 text-${typeInfo.color}-400`} />
                        <span className={`text-xs font-semibold text-${typeInfo.color}-300`}>
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