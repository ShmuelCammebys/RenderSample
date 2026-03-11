import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { savePendingShowing } from '../lib/db';
import { syncPendingShowings } from '../lib/sync';
import { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const BrokerApp = () => {
  const [unitId, setUnitId] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Attempt to sync when the component mounts or when coming online
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

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Create New Showing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Unit</label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">-- Choose a Unit --</option>
            {units?.map((u: any) => (
              <option key={u.id} value={u.id}>{u.buildingName} - {u.unitNumber}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prospect Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prospect@example.com"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Saving...' : 'Create Showing'}
        </button>
      </form>
    </div>
  );
};
