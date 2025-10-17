// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    FORGOT_PASSWORD: '/api/users/forgot-password',
    RESET_PASSWORD: '/api/users/reset-password',
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/update-profile'
  }
};

// API URLs
export const API_URLS = {
  REGISTER: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
  LOGIN: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
  FORGOT_PASSWORD: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`,
  RESET_PASSWORD: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESET_PASSWORD}`,
  PROFILE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}`
};

// HTTP Headers
export const HTTP_HEADERS = {
  JSON: {
    'Content-Type': 'application/json'
  },
  AUTH: (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};

// Response Messages
export const MESSAGES = {
  SUCCESS: {
    REGISTER: 'Account created successfully! Welcome to Group Chat!',
    LOGIN: 'Login successful! Welcome back!',
    FORGOT_PASSWORD: 'Password reset link sent to your email',
    PROFILE_UPDATE: 'Profile updated successfully'
  },
  ERROR: {
    NETWORK: 'Network error. Please check your connection and try again.',
    SERVER: 'Server error. Please try again later.',
    VALIDATION: 'Please fill all required fields correctly.',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User with this email already exists',
    USER_NOT_FOUND: 'User not found'
  }
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{9,14}$/,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15
  },
  EMAIL: {
    PATTERN: /\S+@\S+\.\S+/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'group_chat_token',
  USER: 'group_chat_user',
  THEME: 'group_chat_theme',
  LANGUAGE: 'group_chat_language'
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Group Chat',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional Group Chat Application',
  DEFAULT_THEME: 'light',
  SUPPORTED_LANGUAGES: ['en', 'hi'],
  DEFAULT_LANGUAGE: 'en'
};
