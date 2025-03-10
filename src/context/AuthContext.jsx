import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // For demo purposes, we'll create a mock user if token exists
      if (token) {
        const mockUser = JSON.parse(localStorage.getItem('user')) || {
          id: '1',
          name: 'Mark Johnson',
          email: 'mark@gmail.com',
          role: 'student'
        };
        setUser(mockUser);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // For demo purposes, we'll accept these specific credentials
      if (credentials.email === 'mark@gmail.com' && credentials.password === 'password123') {
        const mockUser = {
          id: '1',
          name: 'Mark Johnson',
          email: credentials.email,
          role: 'student' // You can change this to 'admin' or 'organizer' to test different roles
        };
        
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast.success('Login successful!');
        
        // Redirect based on role
        switch (mockUser.role) {
          case 'student':
            navigate('/student');
            break;
          case 'organizer':
            navigate('/organizer');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);