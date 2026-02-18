import './App.css';
import './index.css';
import { useEffect } from 'react';
import Dashboard from './components/dashboard/DashboardPage';
import Auth from './components/authentication/AuthPage';
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import type React from 'react';

function App() {
  const { user, clearUser } = useAuthStore();

  function ProtectedRoute({children} : {children: React.ReactNode}) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
  }

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/verify',{
          credentials: 'include'
        });

        if (!res.ok){
          clearUser();
        }
      }
      catch(error){
       clearUser();
      }
    }

    if(user) verifyAuth();
  }, [])

  return (
        <Routes>
          <Route path='/' element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        </Routes>
  )
}


export default App
