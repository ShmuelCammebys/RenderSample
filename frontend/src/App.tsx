import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
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
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/broker" /> : <Login onLogin={handleLogin} />} />
            <Route path="/broker/*" element={isAuthenticated ? <BrokerApp onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/prospect/*" element={<ProspectView />} />
            <Route path="/admin/*" element={isAuthenticated ? <AdminPortal onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/broker" : "/login"} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
