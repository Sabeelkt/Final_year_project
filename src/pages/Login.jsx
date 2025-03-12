import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import calendarIllustration from '../asset/loginlogo.png';
import {auth} from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'jane@organizer.com',
    password: 'organizer456'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // await login(formData);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/organizer');
      // On successful login, navigate to the dashboard or home page
      // navigate('/student'); // adjust the route as needed
    } catch (error) {
      // Display error message
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6">
          {/* Illustration */}
          <div className="mb-4">
            <img 
              src={calendarIllustration} 
              alt="Calendar illustration" 
              className="w-40 h-40"
            />
          </div>
          
          <h2 className="text-sm text-gray-500 mb-1">Hi there,</h2>
          <h1 className="text-xl font-bold mb-6">Login to continue</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-green-50 bg-opacity-30 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="markit@gmail.com"
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-green-50 bg-opacity-30 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right mb-6">
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link to="/contact-admin" className="text-green-600 hover:underline">Contact Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;