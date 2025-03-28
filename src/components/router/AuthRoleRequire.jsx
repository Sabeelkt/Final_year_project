import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from "sonner"
import { ImSpinner6 } from "react-icons/im";



const AuthRoleRequire = ({ role, children }) => {
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                const authRole = idTokenResult.claims.role;
                // console.log('User role:', idTokenResult.claims.role);
                if (role === 'user') {
                    if (authRole === 'admin') {
                        toast('You dont have permission to access this page');
                        navigate('/dashboard')
                    } else if (authRole !== 'user') {
                        await signOut(auth);
                        toast('You need to login to access this page');
                        navigate('/login');
                    }
                } else if (role === 'admin') {
                    if (authRole === 'user') {
                        toast('You dont have permission to access this page');
                        navigate('/')
                    } else if (authRole !== 'admin') {
                        await signOut(auth);
                        toast( 'You need to login as an admin to access this page');
                        navigate('/login');
                    }
                }
            } else {
                await signOut(auth);
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, []);


    if (loading) {
        return <div className='fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center z-50'>
            <p className='text-center dark:text-white flex items-center justify-center'><ImSpinner6 className='animate-spin h-8 w-8 text-gray-400 dark:text-white text-lg mx-2' /> Loading...</p>
        </div>;
    }

    return user ? children : <Navigate to="/signin" replace />;
};

export default AuthRoleRequire;
