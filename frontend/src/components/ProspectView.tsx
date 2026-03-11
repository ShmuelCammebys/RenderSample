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
    <div className="max-w-md mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Verify Your Visit</h2>

      {status === 'idle' && (
        <button
          onClick={handleVerify}
          className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700"
        >
          Confirm Visit
        </button>
      )}

      {status === 'verifying' && <p>Verifying your visit...</p>}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="text-green-600 text-xl font-bold">✓ Visit Verified!</div>
          <p className="text-gray-600">Please help us advocate for better housing by contacting your local legislators.</p>
          <LegislatorEmailButton
            showingId={showingId!}
            targetEmail="legislator@ny.gov"
            subject="Housing Advocacy"
            bodyTemplate="I recently visited a unit and believe..."
          />
        </div>
      )}

      {status === 'error' && (
        <div className="text-red-600">
          Invalid or expired verification link.
        </div>
      )}
    </div>
  );
};
