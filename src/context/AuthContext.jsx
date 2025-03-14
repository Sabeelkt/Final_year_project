// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.role || ''); // Default to empty string if no role
        } catch (error) {
          console.error("Error getting user role:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className='fixed top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center z-50'>
        <p className='text-center text-white flex items-center justify-center'>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
