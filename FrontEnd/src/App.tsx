import './App.css';
import './index.css';
import Dashboard from './components/dashboard/DashboardPage';
import Auth from './components/authentication/AuthPage';
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import type React from 'react';

function App() {

  return (
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        </Routes>
  )
}

function ProtectedRoute({children} : {children: React.ReactNode}) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}


export default App
