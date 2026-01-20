import React, { useState } from 'react';
import apiClient from '../utils/api';
import { Navigation } from '../components/Navigation';

interface TrackingResult {
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  shipmentDetails: string;
  status: 'Pending' | 'In Transit' | 'Delivered';
  createdAt: string;
  updatedAt: string;
}

export const Track: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    
    if (!trackingNumber || trackingNumber.trim().length < 5) {
      setError('Please enter a valid tracking number (minimum 5 characters).');
      return;
    }
    
    setLoading(true);

    try {
      const response = await apiClient.get(`/shipments/${trackingNumber.trim()}`);
      setResult(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Unable to track your shipment. Please check the tracking number and try again.';
      setError(errorMessage);
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'Pending':
        return 33;
      case 'In Transit':
        return 66;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1738] dark:bg-gray-950">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Track Your Shipment</h2>
          <p className="text-slate-300 dark:text-gray-400">Enter your tracking number to get real-time updates</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter tracking number (e.g., TRK-ABC12345)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0c1738] dark:focus:ring-white focus:border-[#0c1738] dark:focus:border-white outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#0c1738] text-white rounded-lg hover:bg-[#0a0f26] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Tracking Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-2">Please verify your tracking number and try again.</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{result.trackingNumber}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Last updated: {new Date(result.updatedAt).toLocaleString()}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <div className={`flex flex-col items-center ${result.status === 'Pending' || result.status === 'In Transit' || result.status === 'Delivered' ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${result.status === 'Pending' || result.status === 'In Transit' || result.status === 'Delivered' ? 'bg-[#0c1738] text-white' : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'}`}>
                      ✓
                    </div>
                    <p className="text-xs font-medium mt-2 text-slate-700 dark:text-gray-300">Pending</p>
                  </div>
                  <div className={`flex flex-col items-center ${result.status === 'In Transit' || result.status === 'Delivered' ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${result.status === 'In Transit' || result.status === 'Delivered' ? 'bg-[#0c1738] text-white' : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'}`}>
                      {result.status === 'In Transit' || result.status === 'Delivered' ? '✓' : '2'}
                    </div>
                    <p className="text-xs font-medium mt-2 text-slate-700 dark:text-gray-300">In Transit</p>
                  </div>
                  <div className={`flex flex-col items-center ${result.status === 'Delivered' ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${result.status === 'Delivered' ? 'bg-[#0c1738] text-white' : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'}`}>
                      {result.status === 'Delivered' ? '✓' : '3'}
                    </div>
                    <p className="text-xs font-medium mt-2 text-slate-700 dark:text-gray-300">Delivered</p>
                  </div>
                </div>
                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 dark:bg-gray-700 -z-10">
                  <div
                    className="h-full bg-[#0c1738] dark:bg-white transition-all duration-500"
                    style={{ width: `${getProgressPercentage(result.status)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase mb-3">From</h4>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{result.senderName}</p>
                  <p className="text-slate-600 dark:text-gray-300">{result.senderAddress}</p>
                </div>
                <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase mb-3">To</h4>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{result.recipientName}</p>
                  <p className="text-slate-600 dark:text-gray-300">{result.recipientAddress}</p>
                </div>
              </div>

              <div className="bg-[#0c1738] bg-opacity-5 dark:bg-opacity-20 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-[#0c1738] dark:text-white uppercase mb-2">Shipment Details</h4>
                <p className="text-slate-700 dark:text-gray-300">{result.shipmentDetails}</p>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Created: {new Date(result.createdAt).toLocaleString()}</p>
              </div>

              <button
                onClick={() => {
                  setResult(null);
                  setTrackingNumber('');
                }}
                className="w-full py-3 border-2 border-[#0c1738] text-[#0c1738] rounded-lg hover:bg-[#0c1738] hover:text-white transition-colors font-medium"
              >
                Search Another Shipment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
