import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Users, Crown, Heart, User, Sparkles } from 'lucide-react';

type UserPage = 'home' | 'join' | 'status';

interface JoinQueueProps {
  onNavigate: (page: UserPage) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  customerType: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
}

const JoinQueue: React.FC<JoinQueueProps> = ({ onNavigate, showToast }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    customerType: 'walk-in'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedToken, setAssignedToken] = useState<string>('');
  const [position, setPosition] = useState<number>(0);
  const [estimatedWait, setEstimatedWait] = useState<string>('');
  const [shopSettings, setShopSettings] = useState<{
    isPaused: boolean;
    isClosed: boolean;
    isMaintenanceMode: boolean;
  } | null>(null);

  // Fetch shop settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/settings/public');
        const data = await response.json();

        if (response.ok && data.success) {
          setShopSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
    // Refresh every 5 seconds
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  const customerTypes = [
    { value: 'walk-in', label: 'Walk-in Customer', icon: User, color: 'blue' },
    { value: 'vip', label: 'VIP Customer', icon: Crown, color: 'yellow' },
    { value: 'senior', label: 'Senior Citizen', icon: Heart, color: 'red' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check shop settings
    if (shopSettings?.isClosed) {
      showToast('Shop is closed for today', 'error');
      return;
    }
    
    if (shopSettings?.isPaused) {
      showToast('Queue is currently paused', 'error');
      return;
    }
    
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map customerType to backend format
      const typeMap: { [key: string]: string } = {
        'walk-in': 'Walk-in',
        'vip': 'VIP',
        'senior': 'Senior'
      };
      
      const response = await fetch('http://localhost:5001/api/queue/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          type: typeMap[formData.customerType] || 'Walk-in'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to join queue');
      }

      // Store the data from API response
      setAssignedToken(data.data.tokenNumber);
      setPosition(data.data.position || 0);
      setEstimatedWait(data.data.estimatedWait || '');
      setIsSubmitted(true);
      showToast('Successfully joined the queue!', 'success');
      
    } catch (error) {
      console.error('Error joining queue:', error);
      showToast('Failed to join queue. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                You're in the queue!
              </h1>
              <p className="text-primary-200 mb-8">Welcome to Qyra's smart queue system</p>
              
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-8 mb-8 animate-glow">
                <p className="text-primary-200 text-sm mb-2">Your Token Number</p>
                <p className="text-4xl sm:text-5xl font-bold mb-2 whitespace-nowrap">#{assignedToken}</p>
                <p className="text-primary-200 text-sm">Keep this number handy</p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">Position in queue</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-400">#{position}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white font-medium">Expected wait</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-400">{estimatedWait || 'Calculating...'}</span>
                </div>
              </div>

              <div className="glass rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-primary-400" />
                  <h3 className="text-white font-semibold">What's Next?</h3>
                </div>
                <p className="text-dark-300 text-sm leading-relaxed">
                  You'll receive updates if you provided your phone number or email. 
                  You can also check the queue status screen for real-time updates.
                </p>
              </div>

              <button
                onClick={() => onNavigate('status')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Check Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if queue is paused or shop is closed
  const showQueueMessage = shopSettings?.isClosed || shopSettings?.isPaused;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Join the Queue</h1>
              <p className="text-primary-200">Fill in your details to get your virtual token</p>
            </div>
          </div>

          {/* Queue Status Message */}
          {showQueueMessage && (
            <div className="card p-6 mb-6 bg-yellow-500/20 border-yellow-500/30">
              <div className="text-center">
                <p className="text-yellow-300 font-semibold text-lg mb-2">
                  {shopSettings?.isClosed 
                    ? 'Shop is closed for today' 
                    : 'Queue is currently paused'}
                </p>
                <p className="text-yellow-200/80 text-sm">
                  {shopSettings?.isClosed 
                    ? 'Please come back tomorrow' 
                    : 'New tokens are not being issued at the moment'}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-white mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`input-field ${
                    errors.fullName ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  required
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-red-400 text-sm mt-1" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`input-field ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="+1 (555) 123-4567"
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  required
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-400 text-sm mt-1" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="your.email@example.com"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email && (
                  <p id="email-error" className="text-red-400 text-sm mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Customer Type */}
              <div>
                <label className="block text-sm font-semibold text-white mb-4">
                  Customer Type
                </label>
                <div className="grid gap-3">
                  {customerTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.customerType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('customerType', type.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          isSelected
                            ? `border-${type.color}-500 bg-${type.color}-500/20`
                            : 'border-dark-600 hover:border-dark-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? `bg-${type.color}-500/30` : 'bg-dark-700'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isSelected ? `text-${type.color}-400` : 'text-dark-300'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              isSelected ? 'text-white' : 'text-dark-300'
                            }`}>
                              {type.label}
                            </p>
                            {type.value === 'vip' && (
                              <p className="text-xs text-yellow-400">Priority service</p>
                            )}
                            {type.value === 'senior' && (
                              <p className="text-xs text-red-400">Priority service</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || shopSettings?.isPaused || shopSettings?.isClosed}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isSubmitting || shopSettings?.isPaused || shopSettings?.isClosed
                    ? 'bg-dark-600 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining Queue...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Join Queue
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-400">
              Having trouble? Contact support or visit our{' '}
              <button
                onClick={() => onNavigate('status')}
                className="text-primary-400 hover:text-primary-300 underline transition-colors"
              >
                queue status screen
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinQueue;