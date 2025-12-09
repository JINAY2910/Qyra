/**
 * Centralized API configuration used throughout the application.
 */
export const API_BASE_URL = 'https://qyra.onrender.com/api';

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};
