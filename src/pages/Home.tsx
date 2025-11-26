import React from 'react';
import { Users, Clock, Monitor, Shield, Sparkles, Zap } from 'lucide-react';
import QyraLogo from '../components/QyraLogo';

type UserPage = 'home' | 'join' | 'status';

interface HomeProps {
  onNavigate: (page: UserPage) => void;
  onSwitchToAdmin: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onSwitchToAdmin }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'Virtual Tokens',
      description: 'Skip physical queues with smart digital tokens that track your position automatically.'
    },
    {
      icon: Zap,
      title: 'Smart Priority',
      description: 'VIP and senior citizen priority management with intelligent wait time estimation.'
    },
    {
      icon: Monitor,
      title: 'Real-Time Updates',
      description: 'Large screen displays for public areas with live queue status updates.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl animate-float"></div>

      {/* Hero Section */}
      <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent animate-glow">
                  Qyra
                </span>
              </h1>
              <p className="text-lg text-dark-300 mt-6 max-w-2xl leading-relaxed">
                Experience the future of queue management with our intelligent system that puts customers first and gives businesses complete control.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <button
                  onClick={() => onNavigate('join')}
                  className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                >
                  <Users className="w-5 h-5" />
                  Join Queue
                </button>
                <button
                  onClick={() => onNavigate('status')}
                  className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
                >
                  <Monitor className="w-5 h-5" />
                  Check Status
                </button>
              </div>

              {/* Admin Access */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                <span className="text-dark-400 text-sm">Business Owner?</span>
                <button
                  onClick={onSwitchToAdmin}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-primary-300 hover:text-white hover:bg-primary-500/20 transition-all duration-300"
                >
                  <Shield className="w-4 h-4" />
                  Admin Access
                </button>
              </div>
            </div>

            {/* 3D Card Illustration */}
            <div className="flex justify-center lg:justify-center">
              <div className="relative w-full max-w-xl">
                <div className="w-full card p-12 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl flex flex-col items-center justify-center relative overflow-visible min-h-[350px] sm:min-h-[450px]">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10 animate-pulse rounded-2xl"></div>

                    <div className="text-center relative z-10 w-full">
                      <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-10 animate-glow">
                        <Users className="w-24 h-24 text-white" />
                      </div>
                      <h3 className="text-3xl font-semibold text-white mb-4">Smart Queue</h3>
                      <p className="text-primary-200 text-xl mb-6">Intelligent Management</p>
                      <div className="flex justify-center gap-4 text-base text-primary-300">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                          Real-time Updates
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                          Priority Handling
                        </span>
                      </div>

                      {/* Floating Elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-400 rounded-full animate-float"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-300 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="hidden sm:flex absolute -top-8 -left-8 w-24 h-24 glass rounded-xl items-center justify-center animate-float">
                  <Clock className="w-10 h-10 text-primary-400" />
                </div>
                <div className="hidden sm:flex absolute -bottom-8 -right-8 w-24 h-24 glass rounded-xl items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
                  <Zap className="w-10 h-10 text-primary-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Everything you need for
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"> modern queue management</span>
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto leading-relaxed">
              Powerful features designed to create seamless experiences for both customers and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card group hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="card p-12 bg-gradient-to-br from-primary-600/20 to-primary-800/20 border-primary-500/30">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to transform your queue management?
            </h2>
            <p className="text-xl text-primary-200 mb-8 leading-relaxed">
              Join thousands of businesses already using Qyra to improve customer satisfaction and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('join')}
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Today
              </button>
              <button
                onClick={onSwitchToAdmin}
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
              >
                <Shield className="w-5 h-5" />
                Business Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;