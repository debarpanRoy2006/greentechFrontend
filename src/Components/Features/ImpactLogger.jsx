import React, { useState } from 'react';
import axios from 'axios';
import { Leaf, Droplets, Recycle, Send, CheckCircle } from 'lucide-react';

const ImpactLogger = () => {
  const [actionType, setActionType] = useState('recycle');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Replace with your actual Django endpoint
      await axios.post('http://127.0.0.1:8000/api/log-impact/', {
        action: actionType,
        // In a real app, you'd get this ID from your Auth Context/Session
        user_id: 1, 
        timestamp: new Date().toISOString()
      });
      
      setStatus('success');
      // Reset success message after 3 seconds
      setTimeout(() => setStatus(null), 3000);
      
    } catch (error) {
      console.error("Submission failed", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Leaf className="text-green-500" /> Log Contribution
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            What did you do today?
          </label>
          <div className="relative">
            <select 
              value={actionType} 
              onChange={(e) => setActionType(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="recycle">♻️ Recycled Plastic/Paper</option>
              <option value="plant_tree">🌳 Planted a Tree</option>
              <option value="save_water">💧 Saved Water (Bucket Bath)</option>
              <option value="public_transport">🚌 Used Public Transport</option>
              <option value="energy_save">💡 Turned Off Unused Lights</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 hover:shadow-md'
            }`}
        >
          {loading ? 'Logging...' : 'Submit Impact'}
          {!loading && <Send size={18} />}
        </button>

        {/* Feedback Messages */}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm animate-fade-in">
            <CheckCircle size={16} />
            <span>Success! Points added to leaderboard.</span>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm text-center">
            Failed to connect to server. Is Django running?
          </div>
        )}
      </form>

      {/* Mini Stat Preview */}
      
    </div>
  );
};

export default ImpactLogger;