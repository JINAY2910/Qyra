/**
 * Centralized API configuration used throughout the application.
 */
export const API_BASE_URL = 'http://localhost:5001/api';

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};
