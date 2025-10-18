import React from 'react';

interface QyraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const QyraLogo: React.FC<QyraLogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo PNG */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img 
          src="/logo.png" 
          alt="Qyra Logo" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            Qyra
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-primary-300 hidden sm:block">
              Your turn, simplified.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default QyraLogo;
