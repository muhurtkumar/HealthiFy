/**
 * API configuration and utility functions
 */

// Base API URL - adjusts automatically based on environment
export const getApiUrl = (path) => {
  // When using Vite proxy on localhost
  if (window.location.hostname === 'localhost') {
    return path;
  }
  
  // When accessed from network
  const backendHost = window.location.hostname;
  return `http://${backendHost}:8000${path}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  UPDATE_PROFILE: '/healthify/auth/update-profile',
  PROFILE: '/healthify/auth/profile',
  LOGIN: '/healthify/auth/login',
  REGISTER: '/healthify/auth/register',
  VERIFY_OTP: '/healthify/auth/verify-otp',
  LOGOUT: '/healthify/auth/logout',
};

// Helper to build image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Handle relative vs absolute URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Make sure the path has the leading slash
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // When using Vite proxy on localhost
  if (window.location.hostname === 'localhost') {
    return normalizedPath;
  }
  
  // When accessed from network
  const backendHost = window.location.hostname;
  return `http://${backendHost}:8000${normalizedPath}`;
}; 