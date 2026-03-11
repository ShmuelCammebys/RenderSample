import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NavLink, Routes, Route } from 'react-router-dom';
import Papa from 'papaparse';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const DashboardView = ({ stats, recentShowings, uploading, handleFileUpload }: any) => (
  <div className="flex flex-col gap-8">
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold tracking-tight">Showings Overview</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance metrics for your managed properties.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg material-symbols-outlined">group</span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Showings</h3>
        <p className="text-3xl font-bold mt-1">{stats?.totalShowings ?? 0}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg material-symbols-outlined">verified</span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Verified Showings</h3>
        <p className="text-3xl font-bold mt-1">{stats?.verifiedShowings ?? 0}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg material-symbols-outlined">flag</span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Flagged Showings</h3>
        <p className="text-3xl font-bold mt-1">{stats?.flaggedShowings ?? 0}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold">Account Connections</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sync your calendar and contacts with external providers.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="size-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-sm">
                <svg height="20" viewbox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold">Google Workspace</p>
                <p className="text-xs text-slate-500">Sync Google Calendar & Drive</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-[#1142d4] hover:text-white transition-all">Connect</button>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold">Bulk Unit Import</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Upload CSV or XLSX files to update unit data.</p>
        </div>
        <div className="p-6">
          <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 group hover:border-[#1142d4] transition-colors cursor-pointer text-center">
            <div className="size-14 bg-[#1142d4]/10 text-[#1142d4] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {uploading ? 'Processing...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Headers: BuildingName, UnitNumber, IsEligible</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </section>
    </div>

    <div className="mt-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Showings</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined text-sm">ios_share</span>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Unit ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Prospect Email</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date/Time</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentShowings?.map((showing: any) => (
              <tr key={showing.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-bold">Unit {showing.unitId}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{showing.prospectEmail}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                  {new Date(showing.createdAtUtc).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                    showing.status === 'Verified' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {showing.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="material-symbols-outlined text-slate-400 hover:text-[#1142d4]">more_vert</button>
                </td>
              </tr>
            ))}
            {(!recentShowings || recentShowings.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No recent showings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const AdminPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [uploading, setUploading] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/Admin/stats`);
      return res.data;
    }
  });

  const { data: recentShowings } = useQuery({
    queryKey: ['admin-recent-showings'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/Showings`);
      return res.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: (units: any[]) => axios.post(`${API_BASE_URL}/api/Admin/units/upload`, units),
    onSuccess: () => {
      alert('Units uploaded successfully!');
      setUploading(false);
    },
    onError: () => {
      alert('Failed to upload units.');
      setUploading(false);
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results: Papa.ParseResult<any>) => {
        const units = results.data
          .filter((row: any) => row.BuildingName && row.UnitNumber)
          .map((row: any) => ({
            buildingName: row.BuildingName,
            unitNumber: row.UnitNumber,
            isEligible: row.IsEligible === true || row.IsEligible === 'true'
          }));
        uploadMutation.mutate(units);
      },
      error: (error: Error) => {
        console.error('CSV Parsing Error:', error);
        setUploading(false);
      }
    });
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive 
        ? 'bg-[#1142d4]/10 text-[#1142d4] font-semibold' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101522] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-[#1142d4] rounded-lg p-2 text-white">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Admin Panel</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Showings Tracker v2.0</p>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavLink to="/admin" end className={navItemClass}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm">Dashboard</span>
            </NavLink>
            <NavLink to="/admin/showings" className={navItemClass}>
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="text-sm">Showings</span>
            </NavLink>
            <NavLink to="/admin/units" className={navItemClass}>
              <span className="material-symbols-outlined">apartment</span>
              <span className="text-sm">Units</span>
            </NavLink>
            <NavLink to="/admin/integrations" className={navItemClass}>
              <span className="material-symbols-outlined">hub</span>
              <span className="text-sm">Integrations</span>
            </NavLink>
            <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Systems</div>
            <NavLink to="/admin/settings" className={navItemClass}>
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm">Settings</span>
            </NavLink>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div
              onClick={onLogout}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer group transition-colors"
              title="Logout"
            >
              <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40">
                <span className="material-symbols-outlined text-slate-500 group-hover:text-rose-600">logout</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-rose-600">Logout</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Alex Rivera</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64">
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1142d4]" placeholder="Search showings, units, or leads..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              <NavLink to="/broker" className="bg-[#1142d4] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                New Showing
              </NavLink>
            </div>
          </header>

          <div className="p-8">
            <Routes>
              <Route index element={
                <DashboardView 
                  stats={stats} 
                  recentShowings={recentShowings} 
                  uploading={uploading} 
                  handleFileUpload={handleFileUpload} 
                />
              } />
              <Route path="showings" element={<div className="text-center p-12"><h2 className="text-2xl font-bold">Showings Management</h2><p className="text-slate-500">Content coming soon...</p></div>} />
              <Route path="units" element={<div className="text-center p-12"><h2 className="text-2xl font-bold">Units Management</h2><p className="text-slate-500">Content coming soon...</p></div>} />
              <Route path="integrations" element={<div className="text-center p-12"><h2 className="text-2xl font-bold">Integrations</h2><p className="text-slate-500">Content coming soon...</p></div>} />
              <Route path="settings" element={<div className="text-center p-12"><h2 className="text-2xl font-bold">Settings</h2><p className="text-slate-500">Content coming soon...</p></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
