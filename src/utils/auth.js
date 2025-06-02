const AUTH_API_URL = import.meta.env.VITE_AUTH_BACKEND_URL || 'https://emberguard-auth-backend.onrender.com/api';
const MAP_API_URL = import.meta.env.VITE_BACKEND_URL || 'https://emberguard.onrender.com';

class AuthService {
  static async register(userData) {
    try {
      console.log('Attempting registration with auth backend:', AUTH_API_URL);
      console.log('Registration data:', { 
        email: userData.email, 
        firstName: userData.firstName,
        lastName: userData.lastName 
      });

      const response = await fetch(`${AUTH_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Registration response:', data);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userMode', 'authenticated');
        
        console.log('Registration successful, data stored');
        return { success: true, user: data.user, token: data.token };
      } else {
        console.log('Registration failed:', data.message);
        return { 
          success: false, 
          message: data.message, 
          errors: data.errors 
        };
      }
    } catch (error) {
      console.error('Registration network error:', error);
      return { 
        success: false, 
        message: 'Network error. Please check your connection and try again.' 
      };
    }
  }

  static async login(credentials) {
    try {
      console.log('Attempting login with auth backend:', AUTH_API_URL);
      console.log('Login data:', { email: credentials.email });

      const response = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userMode', 'authenticated');
        
        console.log('Login successful, data stored');
        return { success: true, user: data.user, token: data.token };
      } else {
        console.log('Login failed:', data.message);
        return { 
          success: false, 
          message: data.message, 
          errors: data.errors 
        };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { 
        success: false, 
        message: 'Network error. Please check your connection and try again.' 
      };
    }
  }

  static async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        console.log('No token found');
        return null;
      }

      console.log('Fetching current user from auth backend:', AUTH_API_URL);

      const response = await fetch(`${AUTH_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Current user fetched successfully');
        return data.user;
      } else {
        console.log('Failed to get current user, logging out');
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return null;
    }
  }

  static async logout() {
    try {
      const token = this.getToken();
      
      if (token) {
        try {
          await fetch(`${AUTH_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('Backend logout successful');
        } catch (error) {
          console.log('Backend logout failed, continuing with client logout');
        }
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userMode');
      
      console.log('Logout successful, all data cleared');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userMode');
    }
  }

  static async updateProfilePicture(profilePictureData) {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, message: 'Not authenticated' };
      }

      console.log('Updating profile picture via auth backend');

      const response = await fetch(`${AUTH_API_URL}/auth/profile-picture`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profilePictureData)
      });

      const data = await response.json();

      if (data.success) {
        const currentUser = this.getStoredUser();
        if (currentUser) {
          currentUser.profilePicture = data.profilePicture;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        console.log('Profile picture updated successfully');
        return { success: true, profilePicture: data.profilePicture };
      } else {
        console.log('Profile picture update failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Profile picture update error:', error);
      return { 
        success: false, 
        message: 'Network error while updating profile picture' 
      };
    }
  }

  static isAuthenticated() {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  static getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUserMode() {
    return localStorage.getItem('userMode') || 'guest';
  }

  static getBackendURLs() {
    return {
      auth: AUTH_API_URL,
      map: MAP_API_URL
    };
  }

  static debugAuthState() {
    console.log('Auth Backend URL:', AUTH_API_URL);
    console.log('Map Backend URL:', MAP_API_URL);
    console.log('Token:', this.getToken());
    console.log('User:', this.getStoredUser());
    console.log('User Mode:', this.getUserMode());
    console.log('Is Authenticated:', this.isAuthenticated());
  }

  static async testAuthBackend() {
    try {
      console.log('Testing auth backend connection...');
      const response = await fetch(`${AUTH_API_URL}/auth/test`);
      const data = await response.json();
      console.log('Auth backend test result:', data);
      return data;
    } catch (error) {
      console.error('Auth backend test failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async testMapBackend() {
    try {
      console.log('Testing map backend connection...');
      const response = await fetch(`${MAP_API_URL}/api/health`);
      const data = await response.json();
      console.log('Map backend test result:', data);
      return data;
    } catch (error) {
      console.error('Map backend test failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async testAllBackends() {
    console.log('=== TESTING ALL BACKENDS ===');
    
    const authTest = await this.testAuthBackend();
    const mapTest = await this.testMapBackend();
    
    console.log('Auth Backend Result:', authTest);
    console.log('Map Backend Result:', mapTest);
    
    return {
      auth: authTest,
      map: mapTest,
      bothWorking: authTest.success && mapTest.success
    };
  }
}

export default AuthService;

export const BACKEND_URLS = {
  AUTH: AUTH_API_URL,
  MAP: MAP_API_URL
};