import { API_URLS, HTTP_HEADERS, MESSAGES, STORAGE_KEYS } from '../constants/api';

class AuthService {
  // Register User
  async register(userData) {
    try {
      const response = await fetch(API_URLS.REGISTER, {
        method: 'POST',
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        if (data.data.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.data.token);
        }
        if (data.data.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.data.user));
        }
        
        return {
          success: true,
          message: MESSAGES.SUCCESS.REGISTER,
          data: data.data
        };
      } else {
        return {
          success: false,
          message: data.message || MESSAGES.ERROR.SERVER
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: MESSAGES.ERROR.NETWORK
      };
    }
  }

  // Login User
  async login(credentials) {
    try {
      const response = await fetch(API_URLS.LOGIN, {
        method: 'POST',
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        if (data.data.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.data.token);
        }
        if (data.data.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.data.user));
        }
        
        return {
          success: true,
          message: MESSAGES.SUCCESS.LOGIN,
          data: data.data
        };
      } else {
        return {
          success: false,
          message: data.message || MESSAGES.ERROR.INVALID_CREDENTIALS
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: MESSAGES.ERROR.NETWORK
      };
    }
  }

  // Forgot Password
  async forgotPassword(email) {
    try {
      const response = await fetch(API_URLS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          message: MESSAGES.SUCCESS.FORGOT_PASSWORD
        };
      } else {
        return {
          success: false,
          message: data.message || MESSAGES.ERROR.SERVER
        };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: MESSAGES.ERROR.NETWORK
      };
    }
  }

  // Get Current User
  getCurrentUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get Token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Logout
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Clear all storage
  clearStorage() {
    localStorage.clear();
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
