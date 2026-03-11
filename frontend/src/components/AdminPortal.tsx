import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Papa from 'papaparse';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const AdminPortal = () => {
  const [uploading, setUploading] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/Admin/stats`);
      return res.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: (units: any[]) => axios.post(`${API_BASE_URL}/api/Admin/units/upload`, units),
    onSuccess: () => {
      alert('Units uploaded successfully!');
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
        const units = results.data.map((row: any) => ({
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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm uppercase">Total Showings</div>
          <div className="text-2xl font-bold">{stats?.totalShowings ?? 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-gray-500 text-sm uppercase">Verified</div>
          <div className="text-2xl font-bold">{stats?.verifiedShowings ?? 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-gray-500 text-sm uppercase">Flagged</div>
          <div className="text-2xl font-bold">{stats?.flaggedShowings ?? 0}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Upload Eligible Units (CSV)</h3>
        <p className="text-gray-600 mb-4 text-sm">CSV should have headers: BuildingName, UnitNumber, IsEligible</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <p className="mt-2 text-blue-600">Processing upload...</p>}
      </div>
    </div>
  );
};
