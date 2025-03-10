import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000); // Changed from 200000 to 2000 (2 seconds)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center w-full px-4">
        <div className="flex flex-col items-center justify-center">
          <CalendarCheck className="w-20 h-20 text-green-600 mb-4" />
          <h1 className="text-4xl font-bold text-green-600 mb-2">Mark It</h1>
          <p className="text-gray-600 text-lg">Program Attendance Management</p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;