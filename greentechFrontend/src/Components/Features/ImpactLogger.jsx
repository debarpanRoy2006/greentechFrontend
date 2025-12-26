import React, { useState } from 'react';
import axios from 'axios';
import { Leaf, CheckCircle, Send, AlertTriangle } from 'lucide-react';

const ImpactLogger = ({ onSuccess }) => {
  const [actionType, setActionType] = useState('recycle');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // 1. Send data to Backend
      // Ensure this URL matches your Django setting
      await axios.post('http://127.0.0.1:8000/api/log-impact/', {
        action: actionType
      });
      
      setStatus('success');
      
      // 2. Refresh the Dashboard XP
      if (onSuccess) {
          onSuccess(); 
      }
      
      setTimeout(() => setStatus(null), 3000);
      
    } catch (error) {
      console.error("Submission failed", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent p-2">
      <h3 className="text-sm font-bold mb-4 text-cyan-400 flex items-center gap-2 font-press-start">
        <Leaf size={16} /> LOG CONTRIBUTION
      </h3>
      
      <form onSubmit={handleSubmit} className="impact-form-container">
        
        {/* CUSTOM DROPDOWN */}
        <div className="relative">
          <select 
            value={actionType} 
            onChange={(e) => setActionType(e.target.value)}
            className="cyber-select"
          >
            <option value="recycle">♻️ RECYCLE PLASTIC/PAPER</option>
            <option value="plant_tree">🌳 PLANTED A TREE (+100 XP)</option>
            <option value="save_water">💧 SAVED WATER</option>
            <option value="public_transport">🚌 PUBLIC TRANSPORT</option>
            <option value="energy_save">💡 SAVED ENERGY</option>
          </select>
        </div>

        {/* CUSTOM BUTTON */}
        <button 
          type="submit" 
          disabled={loading}
          className="cyber-btn-submit"
        >
          {loading ? 'UPLOADING...' : 'SUBMIT DATA'}
          {!loading && <Send size={14} strokeWidth={3} />}
        </button>

        {/* STATUS MESSAGES */}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-400 bg-green-900/30 p-2 border border-green-700 mt-2 text-[0.6rem] font-press-start animate-pulse">
            <CheckCircle size={12} />
            <span>UPLOAD COMPLETE.</span>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/30 p-2 border border-red-700 mt-2 text-[0.6rem] font-press-start">
            <AlertTriangle size={12} />
            <span>CONNECTION ERROR.</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ImpactLogger;