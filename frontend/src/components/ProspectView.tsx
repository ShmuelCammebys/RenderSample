import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { LegislatorEmailButton } from './LegislatorEmailButton';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const ProspectView = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  const showingId = searchParams.get('showingId');
  const token = searchParams.get('token');

  const handleVerify = async () => {
    if (!showingId || !token) return;
    setStatus('verifying');
    try {
      await axios.post(`${API_BASE_URL}/api/Verification/verify`, { showingId, token });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101522] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-20 lg:px-40 py-4 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-[#1142d4] text-white">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Visit Verification</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="h-8 w-8 rounded-full bg-[#1142d4]/20 flex items-center justify-center border border-[#1142d4]/30">
                <span className="material-symbols-outlined text-[#1142d4] text-sm">person</span>
              </div>
            </div>
          </header>

          <main className="flex-1 flex justify-center py-8 px-4 md:px-10">
            <div className="max-w-[800px] w-full flex flex-col gap-8">
              <div className="flex flex-col gap-4 text-center md:text-left">
                <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">Confirm Your Visit</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-normal max-w-2xl">
                  Please verify your attendance to finalize the official record for this legislative session. Your confirmation ensures compliance with state transparency requirements.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="grid grid-cols-1 md:flex md:flex-row">
                  <div className="w-full md:w-1/3 min-h-[200px] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCy5EgfCiAOYfbjwQkEnizPvQqC9LzJ-h1ve1VyTrJePLNkTHaeCNG5eLHSZE83c5tkP4j99GqHM42B0b50I15DstJjblZAUauovvQD0oLeD1nEbveygi9QCtx3mshUg-71NoVKg7LWERjAh02Q2X0q9glSpse2F52f4_md2bbd_uXfnxbs8Md6zTjugddzLLIvSkcg1uz0RqZOUyCEiGDx5j3oX-roJf47JZve7-Eo-FmUvxXj4KIotezEg_fwVcm3YY7oe4xEkYQO")' }}>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#1142d4] text-sm">event_available</span>
                        <span className="text-[#1142d4] font-bold text-xs uppercase tracking-widest">Official Record</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">Session Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-slate-400">location_on</span>
                        <div className="flex flex-col">
                          <p className="text-slate-500 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Location</p>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">NY State Legislature Headquarters</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm">Albany, NY</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                        <div className="flex flex-col">
                          <p className="text-slate-500 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Schedule</p>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">October 24, 2023</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm">10:00 AM — 12:30 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#1142d4]/5 dark:bg-[#1142d4]/10 border border-[#1142d4]/20 rounded-lg p-4 flex gap-3 items-center">
                      <span className="material-symbols-outlined text-[#1142d4]">info</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Your GPS coordinates at the time of session entry have been logged for validation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                {status === 'idle' && (
                  <button
                    onClick={handleVerify}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-6 bg-[#1142d4] text-white text-lg font-bold shadow-lg shadow-[#1142d4]/20 hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined mr-2">verified_user</span>
                    <span>Verify Visit</span>
                  </button>
                )}

                {status === 'verifying' && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[#1142d4] text-4xl">sync</span>
                    <p className="font-bold">Verifying your visit...</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <span className="material-symbols-outlined font-bold text-2xl">check_circle</span>
                      <span className="text-lg font-bold">Visit Verified Successfully!</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-center text-sm font-medium">
                      Please help us advocate for better housing by contacting your local legislators.
                    </p>
                    <LegislatorEmailButton
                      showingId={showingId!}
                      targetEmail="legislator@ny.gov"
                      subject="Housing Advocacy"
                      bodyTemplate="I recently visited a unit and believe..."
                    />
                  </div>
                )}

                {status === 'error' && (
                  <div className="w-full flex items-center justify-center gap-2 text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800">
                    <span className="material-symbols-outlined font-bold text-2xl">error</span>
                    <span className="font-bold">Invalid or expired verification link.</span>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2 items-center">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">security</span>
                    <p className="text-sm font-medium">Secure Verification Process</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-500 text-sm text-center">
                    By verifying, you confirm that the information above is accurate and follows enterprise compliance guidelines and legislative protocols.
                  </p>
                </div>
              </div>

              <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                  <a className="text-xs font-semibold text-slate-500 hover:text-[#1142d4] uppercase tracking-widest" href="#">Privacy Policy</a>
                  <a className="text-xs font-semibold text-slate-500 hover:text-[#1142d4] uppercase tracking-widest" href="#">Help Center</a>
                  <a className="text-xs font-semibold text-slate-500 hover:text-[#1142d4] uppercase tracking-widest" href="#">Terms</a>
                </div>
                <p className="text-xs text-slate-400">© 2023 New York State Legislative Information Services</p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
