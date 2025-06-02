const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  static async register(userData) {
    try {
      console.log('Attempting registration...');
      console.log('Data:', { 
        email: userData.email, 
        firstName: userData.firstName,
        lastName: userData.lastName 
      });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
        console.log('User:', data.user);
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
      console.log('🔄 Attempting login...');
      console.log('📝 Email:', credentials.email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      console.log('📊 Login response:', data);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userMode', 'authenticated');
        
        console.log('Login successful, data stored');
        console.log('User:', data.user);
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

      console.log('🔄 Fetching current user...');

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
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
      
      console.log('🔄 Logging out...');

      if (token) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
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
      
      console.log('Logout complete, all data cleared');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userMode');
    }
  }

  static isAuthenticated() {
    const token = this.getToken();
    const user = this.getStoredUser();
    const isAuth = !!(token && user);
    console.log('🔍 Authentication check:', isAuth);
    return isAuth;
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

  static debugAuthState() {
    console.log('Token:', this.getToken() ? 'Present' : 'Missing');
    console.log('User:', this.getStoredUser());
    console.log('User Mode:', this.getUserMode());
    console.log('Is Authenticated:', this.isAuthenticated());
  }
}

export default AuthService;