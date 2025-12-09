import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Crown, Heart, User, Sparkles, Download } from 'lucide-react';

import jsPDF from 'jspdf';
import { API_BASE_URL } from '../config/api';
import QueueTicket from '../components/QueueTicket';

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
  const [joinedAt, setJoinedAt] = useState<string>('');
  const [shopSettings, setShopSettings] = useState<{
    isPaused: boolean;
    isClosed: boolean;
    isMaintenanceMode: boolean;
  } | null>(null);

  // Fetch shop settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/public`);
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

      const response = await fetch(`${API_BASE_URL}/queue/join`, {
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

      // Store join timestamp
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setJoinedAt(formattedTime);

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

  const downloadTicket = async () => {
    try {
      console.log('=== PDF GENERATION ===');
      console.log('Token:', assignedToken);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = 210;
      const margin = 25;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Background - Light gray
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, pageWidth, 297, 'F');

      // Main ticket container - White card with shadow effect
      const cardMargin = 15;
      const cardWidth = pageWidth - (cardMargin * 2);

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(cardMargin, cardMargin, cardWidth, 270, 3, 3, 'F');

      // Subtle border around the card
      pdf.setDrawColor(220, 220, 230);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(cardMargin, cardMargin, cardWidth, 270, 3, 3);

      // Subtle shadow effect (multiple gray rectangles)
      pdf.setFillColor(0, 0, 0);
      (pdf as any).setGState((pdf as any).GState({ opacity: 0.03 }));
      pdf.roundedRect(cardMargin + 0.5, cardMargin + 0.5, cardWidth, 270, 3, 3, 'F');
      (pdf as any).setGState((pdf as any).GState({ opacity: 1 }));

      y = cardMargin + 15;

      // ============ HEADER SECTION ============
      // Title
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QYRA SERVICE TICKET', pageWidth / 2, y, { align: 'center' });

      y += 6;

      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Digital Queue Management System', pageWidth / 2, y, { align: 'center' });

      y += 8;

      // Elegant purple accent bar (moved below subtitle)
      pdf.setFillColor(139, 92, 246);
      pdf.rect(cardMargin + 15, y, cardWidth - 30, 3, 'F');

      y += 15;

      // Divider line
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.line(cardMargin + 15, y, cardMargin + cardWidth - 15, y);

      y += 15;

      // ============ TOKEN SECTION ============
      // Light purple background box
      pdf.setFillColor(245, 243, 255);
      pdf.roundedRect(cardMargin + 20, y, cardWidth - 40, 45, 4, 4, 'F');

      // Label
      pdf.setTextColor(109, 40, 217);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('YOUR TOKEN NUMBER', pageWidth / 2, y + 8, { align: 'center' });

      // Token number - large and prominent (changed to Helvetica)
      pdf.setTextColor(109, 40, 217);
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      pdf.text(assignedToken, pageWidth / 2, y + 27, { align: 'center' });

      // Subtitle
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Keep this number for reference', pageWidth / 2, y + 38, { align: 'center' });

      y += 55;

      // ============ DETAILS GRID ============
      const leftColX = cardMargin + 20;
      const rightColX = pageWidth / 2 + 5;
      const colWidth = (cardWidth - 50) / 2;

      // Helper function for field cards
      const addFieldCard = (x: number, yPos: number, label: string, value: string, highlight: boolean = false) => {
        // Card background - all same light purple as token box
        pdf.setFillColor(245, 243, 255);
        pdf.roundedRect(x, yPos, colWidth, 16, 2, 2, 'F');

        // Label
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text(label, x + 4, yPos + 5);

        // Value
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');

        // Truncate if too long
        const maxWidth = colWidth - 8;
        let displayValue = value;
        while (pdf.getTextWidth(displayValue) > maxWidth && displayValue.length > 0) {
          displayValue = displayValue.slice(0, 0 - 1);
        }
        if (displayValue !== value) displayValue += '...';

        pdf.text(displayValue, x + 4, yPos + 12);
      };

      // Section: Customer Details
      pdf.setTextColor(109, 40, 217);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Details', leftColX, y);

      y += 8;

      // Name (full width)
      pdf.setFillColor(245, 243, 255);
      pdf.roundedRect(leftColX, y, cardWidth - 40, 16, 2, 2, 'F');
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Name', leftColX + 4, y + 5);
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formData.fullName, leftColX + 4, y + 12);

      y += 20;

      // Customer Type & Phone (side by side)
      const customerTypeLabel = formData.customerType === 'walk-in' ? 'Walk-in' : formData.customerType === 'vip' ? 'VIP' : 'Senior';
      addFieldCard(leftColX, y, 'Customer Type', customerTypeLabel, true);
      addFieldCard(rightColX, y, 'Phone Number', formData.phone);

      y += 20;

      // Email (full width)
      pdf.setFillColor(245, 243, 255);
      pdf.roundedRect(leftColX, y, cardWidth - 40, 16, 2, 2, 'F');
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Email Address', leftColX + 4, y + 5);
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formData.email, leftColX + 4, y + 12);

      y += 25;

      // Section: Queue Information
      pdf.setTextColor(109, 40, 217);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Queue Information', leftColX, y);

      y += 8;

      // Position & Joined At
      addFieldCard(leftColX, y, 'Current Position', `#${position}`, true);
      addFieldCard(rightColX, y, 'Joined At', joinedAt);

      y += 20;

      // Service Time & Estimated Wait
      addFieldCard(leftColX, y, 'Avg Service Time', '10 minutes');
      addFieldCard(rightColX, y, 'Estimated Wait', estimatedWait || 'Calculating...', true);

      y += 25;

      // ============ FOOTER ============
      // Divider
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.line(cardMargin + 15, y, cardMargin + cardWidth - 15, y);

      y += 8;

      // Footer content - left side
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Track your status online', leftColX, y);

      // Clickable link
      pdf.setTextColor(109, 40, 217);
      pdf.setFont('helvetica', 'bold');
      pdf.textWithLink('qyra-gamma.vercel.app', leftColX, y + 5, { url: 'https://qyra-gamma.vercel.app' });

      // Branding - right side (stacked vertically)
      const brandingX = cardMargin + cardWidth - 20;

      // Draw 'Powered by' on top
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Powered by', brandingX, y, { align: 'right' });

      // Draw 'QYRA' below it
      pdf.setTextColor(109, 40, 217);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QYRA', brandingX, y + 5, { align: 'right' });

      pdf.save(`Qyra-Ticket-${assignedToken}.pdf`);

      console.log('PDF saved successfully');
      showToast('Ticket downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      showToast('Failed to download ticket', 'error');
    }
  };

  if (isSubmitted) {
    const ticketData = {
      tokenNumber: assignedToken,
      name: formData.fullName,
      customerType: formData.customerType === 'walk-in' ? 'Walk-in' : formData.customerType === 'vip' ? 'VIP' : 'Senior',
      phone: formData.phone,
      email: formData.email,
      position: position,
      joinedAt: joinedAt,
      estimatedWait: estimatedWait || 'Calculating...',
      statusLink: 'https://qyra-gamma.vercel.app'
    };

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                You're in the queue!
              </h1>
              <p className="text-primary-200 mb-4">Your ticket has been generated successfully</p>
            </div>

            {/* Ticket Component */}
            <div className="mb-8">
              <QueueTicket data={ticketData} />
            </div>

            {/* Action Buttons */}
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={downloadTicket}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Ticket
              </button>
              <button
                onClick={() => onNavigate('status')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Check Status
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-dark-400">
                Keep your ticket safe. You can download it anytime or check your status online.
              </p>
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
                  className={`input-field ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''
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
                  className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''
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
                  className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''
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
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                          ? `border-${type.color}-500 bg-${type.color}-500/20`
                          : 'border-dark-600 hover:border-dark-500'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? `bg-${type.color}-500/30` : 'bg-dark-700'
                            }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? `text-${type.color}-400` : 'text-dark-300'
                              }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-dark-300'
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
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${isSubmitting || shopSettings?.isPaused || shopSettings?.isClosed
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