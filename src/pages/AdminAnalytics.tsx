import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut, 
  TrendingUp,
  Users,
  Clock,
  Star,
  Activity,
  Calendar,
  Target
} from 'lucide-react';
import QyraLogo from '../components/QyraLogo';

interface AdminAnalyticsProps {
  onNavigate: (page: 'dashboard' | 'analytics') => void;
  onLogout: () => void;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onNavigate, onLogout }) => {
  // Dummy data for analytics
  const stats = {
    totalServed: 156,
    avgWaitTime: 8.5,
    peakHour: '2:00 PM',
    satisfaction: 4.7,
    todayServed: 24,
    weeklyGrowth: 12.5
  };

  const hourlyData = [
    { hour: '9 AM', served: 8, waiting: 3 },
    { hour: '10 AM', served: 12, waiting: 5 },
    { hour: '11 AM', served: 15, waiting: 7 },
    { hour: '12 PM', served: 18, waiting: 4 },
    { hour: '1 PM', served: 22, waiting: 6 },
    { hour: '2 PM', served: 25, waiting: 8 },
    { hour: '3 PM', served: 20, waiting: 5 },
    { hour: '4 PM', served: 16, waiting: 3 },
  ];

  const customerTypes = [
    { type: 'Walk-in', count: 89, percentage: 57 },
    { type: 'VIP', count: 45, percentage: 29 },
    { type: 'Senior', count: 22, percentage: 14 },
  ];

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
            <button
              onClick={() => onNavigate('analytics')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 text-white"
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
          <h1 className="text-3xl font-bold text-white font-poppins">Analytics Dashboard</h1>
          <p className="text-dark-300 mt-2">Insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Served Today</p>
                <p className="text-3xl font-bold text-white">{stats.todayServed}</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.weeklyGrowth}% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Average Wait Time</p>
                <p className="text-3xl font-bold text-white">{stats.avgWaitTime}m</p>
                <p className="text-blue-400 text-sm flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  Peak: {stats.peakHour}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Customer Satisfaction</p>
                <p className="text-3xl font-bold text-white">{stats.satisfaction}</p>
                <p className="text-yellow-400 text-sm flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4" />
                  Out of 5.0
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" />
              Hourly Performance
            </h3>
            <div className="space-y-4">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-dark-300 text-sm w-16">{data.hour}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex gap-1">
                      <div 
                        className="h-6 bg-primary-500 rounded-l"
                        style={{ width: `${(data.served / 25) * 100}%` }}
                      ></div>
                      <div 
                        className="h-6 bg-primary-300 rounded-r"
                        style={{ width: `${(data.waiting / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-white">{data.served} served</div>
                    <div className="text-dark-400">{data.waiting} waiting</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded"></div>
                <span className="text-dark-300">Served</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-300 rounded"></div>
                <span className="text-dark-300">Waiting</span>
              </div>
            </div>
          </div>

          {/* Customer Types */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-400" />
              Customer Distribution
            </h3>
            <div className="space-y-4">
              {customerTypes.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{type.type}</span>
                    <span className="text-dark-300 text-sm">{type.count} customers</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-dark-400">{type.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            Weekly Overview
          </h3>
          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const height = [120, 140, 160, 180, 200, 150, 100][index];
              return (
                <div key={day} className="text-center">
                  <div className="text-dark-300 text-sm mb-2">{day}</div>
                  <div className="flex flex-col items-center justify-end h-32">
                    <div 
                      className="w-8 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg mb-2"
                      style={{ height: `${height}px` }}
                    ></div>
                    <div className="text-white text-sm font-medium">{height}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

