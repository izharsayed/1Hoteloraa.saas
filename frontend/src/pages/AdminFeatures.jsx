import React, { useState, useEffect } from 'react';
import { Sliders, ToggleLeft, ToggleRight, Info, AlertTriangle } from 'lucide-react';
import api from '../utils/api.js';

function AdminFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFeatures = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/tenant/features');
      setFeatures(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load property features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleToggle = async (featureName) => {
    setError('');
    setSuccess('');
    try {
      await api.patch(`/tenant/features/${featureName}/toggle`, {});
      setSuccess(`Feature "${featureName}" toggled successfully`);
      fetchFeatures();
    } catch (err) {
      setError(err.message || 'Failed to toggle feature');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="font-display font-bold text-3xl text-navy">Feature Toggles</h1>
        <p className="text-slate text-sm font-medium mt-1">Enable or disable specific operational modules for your staff.</p>
      </div>

      {error && <div className="p-3 bg-danger-pale border border-danger/10 text-danger rounded-xl text-xs font-bold">{error}</div>}
      {success && <div className="p-3 bg-success-pale border border-success/10 text-success rounded-xl text-xs font-bold">{success}</div>}

      <div className="p-4 bg-gold-pale/50 border border-gold/20 rounded-2xl flex gap-3 text-xs text-charcoal max-w-3xl">
        <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block">About Feature Management</span>
          <p className="text-slate text-[11px] mt-0.5">
            Disabling a feature will immediately remove its routes and menu links from the staff sidebar. Subscriptions allow up to the maximum number of modules included in your pricing plan.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate font-semibold text-xs animate-pulse">Loading features...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {features.map((feat) => (
            <div key={feat.id} className="soft-card p-5 flex items-center justify-between hover:border-gold transition-all duration-300">
              <div className="space-y-1 pr-4 min-w-0">
                <h3 className="font-display font-semibold text-sm text-navy truncate">{feat.feature} Module</h3>
                <p className="text-[10px] text-slate">Allows staff access to the {feat.feature.toLowerCase()} management screens.</p>
              </div>
              
              <button 
                onClick={() => handleToggle(feat.feature)}
                className="shrink-0 focus:outline-none transition-transform active:scale-95"
              >
                {feat.isEnabled ? (
                  <ToggleRight className="w-12 h-12 text-gold" />
                ) : (
                  <ToggleLeft className="w-12 h-12 text-slate/40" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminFeatures;
