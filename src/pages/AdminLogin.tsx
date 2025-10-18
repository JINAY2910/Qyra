import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import QyraLogo from '../components/QyraLogo';

interface AdminLoginProps {
  onLogin: () => void;
  onBackToUser: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-primary-800/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Back Button */}
      <button
        onClick={onBackToUser}
        className="absolute top-6 left-6 btn-secondary flex items-center gap-2 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to User View
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <QyraLogo size="lg" showText={false} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-poppins">Admin Access</h1>
              <p className="text-dark-300 mt-2">Sign in to manage your queue</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@qyra.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="text-center">
            <p className="text-sm text-dark-400">
              Demo: admin@qyra.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

