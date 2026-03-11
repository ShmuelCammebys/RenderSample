import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrokerApp } from './components/BrokerApp';
import { ProspectView } from './components/ProspectView';
import { AdminPortal } from './components/AdminPortal';
import { Login } from './components/Login';

const queryClient = new QueryClient();

// Configure axios globally to use the token from localStorage
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex gap-4">
              <Link to="/broker" className="text-blue-600 hover:underline">Broker</Link>
              <Link to="/prospect" className="text-blue-600 hover:underline">Prospect</Link>
              <Link to="/admin" className="text-blue-600 hover:underline">Admin</Link>
            </div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600">Logout</button>
            ) : (
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            )}
          </nav>

          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/broker" /> : <Login onLogin={handleLogin} />} />
            <Route path="/broker/*" element={isAuthenticated ? <BrokerApp /> : <Navigate to="/login" />} />
            <Route path="/prospect/*" element={<ProspectView />} />
            <Route path="/admin/*" element={isAuthenticated ? <AdminPortal /> : <Navigate to="/login" />} />
            <Route path="/" element={<div className="p-8 text-center text-xl">Welcome to BrokerShowings</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
