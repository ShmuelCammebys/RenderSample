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
      className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
    >
      Email NY Legislators
    </button>
  );
};
