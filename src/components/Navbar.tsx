import React, { useState } from 'react';
import { Menu, X, Home, Users, Monitor } from 'lucide-react';
import QyraLogo from './QyraLogo';

type UserPage = 'home' | 'join' | 'status';

interface NavbarProps {
  currentPage: UserPage;
  onNavigate: (page: UserPage) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as UserPage, label: 'Home', icon: Home },
    { id: 'join' as UserPage, label: 'Join Queue', icon: Users },
    { id: 'status' as UserPage, label: 'Queue Status', icon: Monitor },
  ];

  const handleNavClick = (page: UserPage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="glass-dark sticky top-0 z-50 border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
            <QyraLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700/50 py-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ${
                      currentPage === item.id
                        ? 'bg-primary-600 text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;