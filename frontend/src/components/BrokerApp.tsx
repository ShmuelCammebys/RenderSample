import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NavLink, Routes, Route } from 'react-router-dom';
import { savePendingShowing } from '../lib/db';
import { syncPendingShowings } from '../lib/sync';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const EmailConnection = ({ connectOAuth }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-bold mb-2">Email Connection</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Connect your email to send verification links directly from your account.</p>
    <div className="flex gap-3">
      <button
        onClick={() => connectOAuth('google')}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2nYdzpTobamwJmg4EooeNpZRXulp-8PCupheugDlwTsyOjzQWzNdazq1B5MJvHmpc6zwXhb8iX_jYd3-oUUjsqOHfwIjNnNUkWbSBh0VWJ0TMtUSBiKRlVjgW6ipZ8Kn_rZj-kydUHmnKw6IyIU1w5mlZtNj-0DZVEtd2K7Jo210BZ546bv464Vjq4WWsXrMzs4O4Qme9B-oUr8Sq6yalI5buYJsFzuApGr5s1Vljp8lr1LgYvlpTFhMVoJKa8vb_dnGru6AltV6q" className="w-4 h-4" alt="Google" />
        Google
      </button>
      <button
        onClick={() => connectOAuth('microsoft')}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <svg height="16" viewBox="0 0 23 23" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M1 1h10v10H1z" fill="#f35325"></path><path d="M12 1h10v10H12z" fill="#81bc06"></path><path d="M1 12h10v10H1z" fill="#05a6f0"></path><path d="M12 12h10v10H12z" fill="#ffba08"></path></svg>
        Microsoft
      </button>
    </div>
  </div>
);

const RecentLogs = ({ myShowings }: any) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Logs</h3>
    <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
      {myShowings?.map((showing: any) => (
        <div key={showing.id} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-sm">history</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Unit {showing.unitId}</p>
              <p className="text-xs text-slate-500">{showing.prospectEmail}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-slate-400">{new Date(showing.createdAtUtc).toLocaleDateString()}</span>
            <span className={`text-[10px] font-bold uppercase ${showing.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'}`}>
              {showing.status}
            </span>
          </div>
        </div>
      ))}
      {(!myShowings || myShowings.length === 0) && (
        <div className="p-8 text-center text-slate-500 italic text-sm">No recent visits recorded.</div>
      )}
    </div>
  </div>
);

const RegisterVisit = ({ units, handleSubmit, email, setEmail, unitId, setUnitId, mutation }: any) => (
  <div className="max-w-[600px] w-full flex flex-col gap-8 mx-auto">
    <div className="flex flex-col gap-2">
      <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Register Unit Visit</h1>
      <p className="text-slate-500 dark:text-slate-400 text-base">Please record the site visit by entering the unit details and the responsible broker's contact information.</p>
    </div>

    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 lg:p-8 shadow-sm">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="unit-number">Select Unit</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-lg">door_front</span>
            </div>
            <select
              className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1142d4]/20 focus:border-[#1142d4] transition-all appearance-none"
              id="unit-number"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              required
            >
              <option value="">-- Choose a Unit --</option>
              {units?.map((u: any) => (
                <option key={u.id} value={u.id}>{u.buildingName} - {u.unitNumber}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="prospect-email">Prospect Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-lg">mail</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1142d4]/20 focus:border-[#1142d4] transition-all"
              id="prospect-email"
              type="email"
              placeholder="prospect@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800 my-2" />

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => { setEmail(''); setUnitId(''); }}
            className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-8 py-3 bg-[#1142d4] text-white text-sm font-semibold rounded-lg shadow-lg shadow-[#1142d4]/20 hover:opacity-90 focus:ring-4 focus:ring-[#1142d4]/30 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 min-w-[200px]"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Confirm Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>

    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1142d4]/5 border border-[#1142d4]/10">
      <span className="material-symbols-outlined text-[#1142d4]">info</span>
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">System Information</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Once submitted, an automated confirmation email will be sent to the prospect. The visit will be logged in the enterprise dashboard for reporting purposes.</p>
      </div>
    </div>
  </div>
);

export const BrokerApp = ({ onLogout }: { onLogout: () => void }) => {
  const [unitId, setUnitId] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => syncPendingShowings();
    window.addEventListener('online', handleOnline);
    syncPendingShowings();
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/Showings/units`);
      return res.data;
    }
  });

  const { data: myShowings } = useQuery({
    queryKey: ['showings'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/Showings`);
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newShowing: { unitId: number, prospectEmail: string }) => {
      if (!navigator.onLine) {
        await savePendingShowing(newShowing);
        alert('Offline: Showing saved and will sync when online.');
        return;
      }
      return axios.post(`${API_BASE_URL}/api/Showings`, newShowing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showings'] });
      setEmail('');
      setUnitId('');
      if (navigator.onLine) alert('Showing created successfully!');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitId || !email) return;
    mutation.mutate({ unitId: parseInt(unitId), prospectEmail: email });
  };

  const connectOAuth = async (provider: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/OAuth/connect/${provider}`);
      window.open(res.data.url, '_blank');
    } catch (err) {
      alert('Failed to initiate OAuth connection.');
    }
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-[#1142d4]/10 text-[#1142d4] font-semibold' 
        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium'
    }`;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#f6f6f8] dark:bg-[#101522] text-slate-900 dark:text-slate-100 antialiased font-display">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3">
          <div className="flex items-center gap-4 text-slate-900 dark:text-slate-100">
            <div className="size-8 flex items-center justify-center rounded-lg bg-[#1142d4] text-white">
              <span className="material-symbols-outlined text-2xl">apartment</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">Broker Portal</h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0">
            <div className="flex flex-col gap-2">
              <NavLink to="/broker/dashboard" className={navItemClass}>
                <span className="material-symbols-outlined text-xl">dashboard</span>
                <p className="text-sm">Dashboard</p>
              </NavLink>
              <NavLink to="/broker" end className={navItemClass}>
                <span className="material-symbols-outlined text-xl">calendar_today</span>
                <p className="text-sm">Register Visit</p>
              </NavLink>
              <NavLink to="/broker/units" className={navItemClass}>
                <span className="material-symbols-outlined text-xl">domain</span>
                <p className="text-sm">Units</p>
              </NavLink>
              <NavLink to="/broker/brokers" className={navItemClass}>
                <span className="material-symbols-outlined text-xl">group</span>
                <p className="text-sm">Brokers</p>
              </NavLink>
              <NavLink to="/broker/settings" className={navItemClass}>
                <span className="material-symbols-outlined text-xl">settings</span>
                <p className="text-sm">Settings</p>
              </NavLink>
            </div>
          </aside>

          <main className="flex-1 flex flex-col items-center justify-start p-6 lg:p-12 overflow-y-auto">
            <div className="max-w-[600px] w-full flex flex-col gap-8">
              <Routes>
                <Route index element={
                  <RegisterVisit 
                    units={units} 
                    handleSubmit={handleSubmit}
                    email={email}
                    setEmail={setEmail}
                    unitId={unitId}
                    setUnitId={setUnitId}
                    mutation={mutation}
                  />
                } />
                <Route path="dashboard" element={
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Dashboard</h1>
                      <p className="text-slate-500 dark:text-slate-400 text-base">Overview of your activity and site visit logs.</p>
                    </div>
                    <RecentLogs myShowings={myShowings} />
                  </div>
                } />
                <Route path="units" element={<div className="text-center p-12"><h2 className="text-2xl font-bold">Units Management</h2><p className="text-slate-500">Content coming soon...</p></div>} />
                <Route path="brokers" element={<div className="text-center p-12"><h2 className="text-2xl font-bold">Brokers Directory</h2><p className="text-slate-500">Content coming soon...</p></div>} />
                <Route path="settings" element={
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight">Settings</h1>
                      <p className="text-slate-500 dark:text-slate-400 text-base">Manage your account preferences and integrations.</p>
                    </div>
                    <EmailConnection connectOAuth={connectOAuth} />
                  </div>
                } />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
