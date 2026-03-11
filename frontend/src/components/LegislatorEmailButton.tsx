import React from 'react';
import axios from 'axios';

interface LegislatorEmailButtonProps {
  showingId: string;
  targetEmail: string;
  subject: string;
  bodyTemplate: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const LegislatorEmailButton: React.FC<LegislatorEmailButtonProps> = ({
  showingId,
  targetEmail,
  subject,
  bodyTemplate
}) => {
  const handleOutreachClick = async () => {
    try {
      // 1. Fire-and-forget telemetry to the backend
      axios.post(`${API_BASE_URL}/api/telemetry/outreach-clicked`, { showingId })
        .catch(err => console.error('Telemetry failed', err));

      // 2. Open native mail client
      const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTemplate)}`;
      window.location.href = mailtoLink;
    } catch (error) {
      console.error('Error in outreach click', error);
    }
  };

  return (
    <button
      onClick={handleOutreachClick}
      className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-6 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shadow-sm"
    >
      <span className="material-symbols-outlined mr-2">alternate_email</span>
      <span>Email NY Legislators</span>
    </button>
  );
};
