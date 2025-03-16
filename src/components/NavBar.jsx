import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, User } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = async () => {
    await signOut(auth)
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <nav className="bg-[#0c1221] border-b border-[#1e3450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-[#00E5B7] font-bold text-xl">Mark It</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium rounded-full focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#008170] flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-gray-300">{user.name || 'User'}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#102336] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1e3450]"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </div>
            </div>
            
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#102336]">
            <div className="px-3 py-2 text-sm text-gray-300">
              Signed in as <span className="font-medium">{user.email || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-300 hover:bg-[#1e3450]"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
