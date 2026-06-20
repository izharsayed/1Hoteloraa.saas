import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Check, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  X,
  Activity
} from 'lucide-react';
import api from '../utils/api.js';

function SuperAdminSubscriptions() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMonthlyPrice, setNewMonthlyPrice] = useState('');
  const [newYearlyPrice, setNewYearlyPrice] = useState('');
  const [newUserLimit, setNewUserLimit] = useState('');
  const [newStorageLimit, setNewStorageLimit] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api.get('/superadmin/subscriptions');
      setPlans(data);
    } catch (err) {
      setError(err.message || 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleTogglePlanStatus = (id) => {
    // Simply simulate status toggle for mock/preconfigured tiers
    setPlans(plans.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        showToast(`Plan status updated to ${newStatus}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newName || !newMonthlyPrice) return;

    // Simulate creation of new plan node in local state
    const newPlan = {
      id: Date.now(),
      name: newName,
      monthlyPrice: parseFloat(newMonthlyPrice),
      yearlyPrice: parseFloat(newYearlyPrice) || parseFloat(newMonthlyPrice) * 10,
      userLimit: parseInt(newUserLimit) || 10,
      storageLimit: parseInt(newStorageLimit) || 5,
      status: 'ACTIVE',
      features: ['pos', 'rooms'],
      activeTenantsCount: 0
    };

    setPlans([...plans, newPlan]);
    setShowCreateModal(false);
    showToast(`Pricing plan "${newName}" registered successfully!`);
    
    setNewName('');
    setNewMonthlyPrice('');
    setNewYearlyPrice('');
    setNewUserLimit('');
    setNewStorageLimit('');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-navy font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-gold" /> Loading subscription plans...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-danger-pale border border-danger/10 text-danger rounded-2xl text-xs font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-navy border border-gold text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-stone-900/10 animate-slideIn">
          <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Subscription Plans</h1>
          <p className="text-slate text-sm font-medium mt-1">Configure subscription pricing plans, user seat counts, database limits, and feature permissions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Pricing Plan
        </button>
      </div>

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div 
            key={p.id} 
            className={`soft-card bg-white p-6 flex flex-col justify-between border relative overflow-hidden ${
              p.status === 'DISABLED' ? 'border-dashed border-slate/40 opacity-70' : 'border-border-cream'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-navy uppercase tracking-wider bg-cream border px-2 py-0.5 rounded">
                  {p.status}
                </span>
                <button 
                  onClick={() => handleTogglePlanStatus(p.id)}
                  className="text-slate hover:text-navy transition-colors"
                >
                  {p.status === 'ACTIVE' ? <ToggleRight className="w-9 h-9 text-gold fill-gold-pale" /> : <ToggleLeft className="w-9 h-9 text-slate" />}
                </button>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-navy">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-display font-bold text-navy">₹{p.monthlyPrice.toLocaleString()}</span>
                  <span className="text-slate text-[10px] font-bold uppercase">/ month</span>
                </div>
                <p className="text-[10px] text-slate font-medium mt-0.5">Yearly: ₹{p.yearlyPrice.toLocaleString()}</p>
              </div>

              <div className="border-t border-border-cream/50 pt-3 space-y-2 text-xs font-semibold text-charcoal">
                <div className="flex justify-between">
                  <span className="text-slate">User Seats Limit:</span>
                  <span>{p.userLimit} Users</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Database Storage:</span>
                  <span>{p.storageLimit} GB</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-border-cream/55 pt-1.5 mt-1">
                  <span className="text-slate">Active Tenants:</span>
                  <span className="text-gold font-bold">{p.activeTenantsCount} Properties</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-bold text-navy uppercase tracking-wider block">Allocated Modules</span>
                <div className="flex flex-wrap gap-1">
                  {p.features.map(f => (
                    <span key={f} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-cream rounded border border-border-cream/40">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MODAL: CREATE PLAN ───────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">Create Subscription Plan</h4>
                <p className="text-xs text-slate mt-0.5">Define a new pricing level and module configurations</p>
              </div>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Plan Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Professional Plan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Monthly Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="9999"
                    value={newMonthlyPrice}
                    onChange={(e) => setNewMonthlyPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Yearly Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="99990"
                    value={newYearlyPrice}
                    onChange={(e) => setNewYearlyPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Max Users</label>
                  <input 
                    type="number" 
                    placeholder="30"
                    value={newUserLimit}
                    onChange={(e) => setNewUserLimit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Max Storage (GB)</label>
                  <input 
                    type="number" 
                    placeholder="20"
                    value={newStorageLimit}
                    onChange={(e) => setNewStorageLimit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 px-4 py-2.5 border border-border-cream text-charcoal hover:bg-stone-50 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 px-4 py-2.5 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminSubscriptions;
