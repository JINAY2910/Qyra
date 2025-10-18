// Sample data for queue management
// In a real application, this would come from your API

export interface QueueItem {
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

// Current customer being served
export const currentServing: QueueItem | null = {
  id: '1',
  tokenNumber: 45,
  name: 'Sarah Johnson',
  customerType: 'vip',
  joinedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  phone: '+1 (555) 123-4567',
  email: 'sarah.j@email.com',
  priority: 5,
  status: 'serving'
};

// Sample queue data
export const sampleQueue: QueueItem[] = [
  {
    id: '2',
    tokenNumber: 46,
    name: 'Michael Chen',
    customerType: 'online',
    joinedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@email.com',
    priority: 3,
    status: 'waiting'
  },
  {
    id: '3',
    tokenNumber: 47,
    name: 'Emma Rodriguez',
    customerType: 'senior',
    joinedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    phone: '+1 (555) 345-6789',
    priority: 4,
    status: 'waiting'
  },
  {
    id: '4',
    tokenNumber: 48,
    name: 'James Wilson',
    customerType: 'walk-in',
    joinedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    priority: 2,
    status: 'waiting'
  },
  {
    id: '5',
    tokenNumber: 49,
    name: 'Lisa Thompson',
    customerType: 'vip',
    joinedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
    phone: '+1 (555) 456-7890',
    email: 'lisa.thompson@email.com',
    priority: 5,
    status: 'waiting'
  },
  {
    id: '6',
    tokenNumber: 50,
    name: 'David Park',
    customerType: 'online',
    joinedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
    email: 'david.park@email.com',
    priority: 3,
    status: 'waiting'
  },
  {
    id: '7',
    tokenNumber: 51,
    name: 'Maria Garcia',
    customerType: 'senior',
    joinedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 minutes ago
    phone: '+1 (555) 567-8901',
    priority: 4,
    status: 'waiting'
  },
  {
    id: '8',
    tokenNumber: 52,
    name: 'Robert Kim',
    customerType: 'walk-in',
    joinedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    priority: 2,
    status: 'waiting'
  }
];

// API Configuration
// Replace with your actual API base URL when integrating with backend
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3001/api';

// API Integration Points
// These are the endpoints where you would integrate with your backend:

export const API_ENDPOINTS = {
  // Queue Management
  getQueue: `${API_BASE_URL}/queue`,
  joinQueue: `${API_BASE_URL}/queue/join`,
  startServing: `${API_BASE_URL}/queue/serve`,
  completeService: `${API_BASE_URL}/queue/complete`,
  updatePriority: `${API_BASE_URL}/queue/priority`,
  removeFromQueue: `${API_BASE_URL}/queue/remove`,
  
  // Current Status
  getCurrentServing: `${API_BASE_URL}/queue/current`,
  getQueueStats: `${API_BASE_URL}/queue/stats`,
  
  // Real-time Updates (WebSocket)
  websocketUrl: process.env.NODE_ENV === 'production' 
    ? 'wss://your-api-domain.com/ws' 
    : 'ws://localhost:3001/ws'
};

// Utility functions for API integration
export const queueAPI = {
  // Join queue
  async joinQueue(customerData: {
    fullName: string;
    phone?: string;
    email?: string;
    customerType: string;
  }) {
    // Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.joinQueue, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(customerData)
    // });
    // return response.json();
    
    // Simulated response
    return {
      success: true,
      tokenNumber: Math.floor(Math.random() * 999) + 1,
      position: Math.floor(Math.random() * 10) + 1,
      estimatedWait: '15-20 minutes'
    };
  },

  // Get current queue
  async getQueue() {
    // Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.getQueue);
    // return response.json();
    
    return {
      queue: sampleQueue,
      currentServing: currentServing,
      stats: {
        totalWaiting: sampleQueue.filter(item => item.status === 'waiting').length,
        servedToday: 25,
        averageWaitTime: 12
      }
    };
  },

  // Start serving a customer
  async startServing(tokenId: string) {
    // Replace with actual API call
    // const response = await fetch(`${API_ENDPOINTS.startServing}/${tokenId}`, {
    //   method: 'POST'
    // });
    // return response.json();
    
    return { success: true };
  },

  // Complete service
  async completeService(tokenId: string) {
    // Replace with actual API call
    // const response = await fetch(`${API_ENDPOINTS.completeService}/${tokenId}`, {
    //   method: 'POST'
    // });
    // return response.json();
    
    return { success: true };
  }
};