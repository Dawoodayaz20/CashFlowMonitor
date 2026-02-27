import './App.css';
import './index.css';
import { useEffect } from 'react';
import Dashboard from './components/dashboard/DashboardPage';
import Auth from './components/authentication/AuthPage';
import TransactionPage from './components/TransactionPage/transactionPage';
import ForecastPage from './pages/ForecastPage/forecastPage';
import SettingsPage from './pages/SettingsPage/settingsPage';
import AppLayout from './AppLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import type React from 'react';

function App() {
  const { user, clearUser } = useAuthStore();

  function ProtectedLayout() {
    if (!user) return <Navigate to="/" replace />;
    return <AppLayout />;  // AppLayout contains <Outlet /> internally
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
          <Route element={<ProtectedLayout />}>
        <Route path="/dashboard"element={<Dashboard />} />
        <Route path="/income"element={<TransactionPage type="income" />} />
        <Route path="/expense"element={<TransactionPage type="expense" />} />
        <Route path="/forecast"  element={<ForecastPage />} />
        <Route path="/settings"  element={<SettingsPage />} />
        {/*<Route path="/profile"   element={<ProfilePage />} /> */}
        <Route path="*"element={<Navigate to="/dashboard" />} />
      </Route>
        </Routes>
  )
}


export default App
