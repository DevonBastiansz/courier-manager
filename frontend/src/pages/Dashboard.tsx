import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import apiClient from '../utils/api';

interface Shipment {
  _id: string;
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  shipmentDetails: string;
  status: 'Pending' | 'In Transit' | 'Delivered';
  createdAt: string;
}

export const Dashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientAddress: '',
    shipmentDetails: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/shipments');
      setShipments(response.data);
    } catch (err) {
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await apiClient.post('/shipments', formData);
      setFormData({
        recipientName: '',
        recipientAddress: '',
        shipmentDetails: '',
      });
      setShowModal(false);
      await fetchShipments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create shipment');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Delivered') return 'status-delivered';
    if (status === 'In Transit') return 'status-in-transit';
    return 'status-pending';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Shipments</h1>
            <p className="text-slate-600 dark:text-gray-400 mt-1">Track and manage your deliveries</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-white dark:bg-slate-800 text-[#0c1738] dark:text-white font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Shipment</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c1738] dark:border-white"></div>
          </div>
        ) : shipments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No shipments yet</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6">Create your first shipment to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-white dark:bg-slate-800 text-[#0c1738] dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              Create Shipment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shipments.map((shipment) => (
              <div
                key={shipment._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="font-mono text-sm font-semibold text-[#0c1738] dark:text-white">
                    {shipment.trackingNumber}
                  </div>
                  <span className={`status-badge ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Recipient</div>
                    <div className="font-medium text-slate-900 dark:text-white">{shipment.recipientName}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Address</div>
                    <div className="text-sm text-slate-700 dark:text-gray-300">{shipment.recipientAddress}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Details</div>
                    <div className="text-sm text-slate-700 dark:text-gray-300 line-clamp-2">{shipment.shipmentDetails}</div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 dark:border-gray-700">
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      Created {new Date(shipment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Shipment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0c1738] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="recipientAddress" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  id="recipientAddress"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0c1738] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="shipmentDetails" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Shipment Details
                </label>
                <textarea
                  id="shipmentDetails"
                  name="shipmentDetails"
                  value={formData.shipmentDetails}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0c1738] focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0c1738] text-white font-medium rounded-lg hover:bg-[#0a0f26] transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
