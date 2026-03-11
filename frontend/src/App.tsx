import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrokerApp } from './components/BrokerApp';
import { ProspectView } from './components/ProspectView';
import { AdminPortal } from './components/AdminPortal';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm p-4 flex gap-4">
            <Link to="/broker" className="text-blue-600 hover:underline">Broker</Link>
            <Link to="/prospect" className="text-blue-600 hover:underline">Prospect</Link>
            <Link to="/admin" className="text-blue-600 hover:underline">Admin</Link>
          </nav>

          <Routes>
            <Route path="/broker/*" element={<BrokerApp />} />
            <Route path="/prospect/*" element={<ProspectView />} />
            <Route path="/admin/*" element={<AdminPortal />} />
            <Route path="/" element={<div className="p-8 text-center text-xl">Welcome to BrokerShowings</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
