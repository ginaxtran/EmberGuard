import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import AuthService from '../utils/auth';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Login form submitted');
    
    if (!validateForm()) {
      console.log('Login form validation failed');
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    
    try {
      console.log('Calling AuthService.login...');
      const result = await AuthService.login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        console.log('Login successful');

        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });

        onClose();
        navigate('/dashboard?page=map');
        
      } else {
        console.log('Login failed:', result);

        if (result.errors && Array.isArray(result.errors)) {
          const backendErrors = {};
          result.errors.forEach(error => {
            const field = error.path || error.param;
            if (field) {
              backendErrors[field] = error.msg;
            }
          });
          setErrors(backendErrors);
        }

        setGeneralError(result.message || 'Login failed. Please check your credentials.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      localStorage.setItem('userMode', 'authenticated');
      navigate("/dashboard?page=map");
    },
    onError: (error) => {
      console.log("Google login failed:", error);
      alert("Google login failed. Please try again.");
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000}}>
      <div className="bg-white rounded-4 w-100 auth-modal overflow-auto shadow-lg position-relative">
        <div className="p-3 d-flex justify-content-end">
          <button 
            className="btn-close"
            onClick={onClose}
            type="button"
            aria-label="Close"
            style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem'}}
            disabled={isLoading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18"/>
            </svg>
          </button>
        </div>

        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <h1 className="form-title mb-2">Sign in to your Account</h1>
          <p className="text-muted mb-4">Enter your email and password to log in</p>

          {generalError && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control form-control-lg custom-focus ${errors.email ? 'is-invalid' : ''}`}
                style={{zIndex: 1}}
                disabled={isLoading}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-control form-control-lg custom-focus ${errors.password ? 'is-invalid' : ''}`}
                  style={{zIndex: 1}}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{zIndex: 2}}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    {showPassword ? (
                      <path 
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <button 
              type="submit" 
              className="btn btn-gradient-primary btn-lg w-100 form-submit-btn mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <div className="loading-spinner"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="text-center my-4 position-relative">
            <hr className="my-0"/>
            <span className="bg-white px-3 text-muted position-absolute top-50 start-50 translate-middle">Or</span>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <button 
              type="button"
              className="btn btn-outline-secondary social-btn google-btn d-flex align-items-center justify-content-center gap-3"
              onClick={() => googleLogin()}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

          </div>

          <div className="text-center">
            <span className="text-muted">Don't have an account? </span>
            <button 
              type="button"
              className="btn btn-link p-0 text-decoration-underline"
              onClick={onSwitchToRegister}
              style={{verticalAlign: 'baseline'}}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;