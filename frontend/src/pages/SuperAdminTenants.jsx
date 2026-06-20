import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Check, 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  Eye, 
  X,
  User,
  Activity
} from 'lucide-react';
import api from '../utils/api.js';

function SuperAdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Tenant Form States
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newType, setNewType] = useState('HOTEL_RESTAURANT');
  const [newPlan, setNewPlan] = useState('STARTER');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await api.get('/superadmin/tenants');
      setTenants(data);
    } catch (err) {
      setError(err.message || 'Failed to load tenants list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleToggleStatus = async (id, name) => {
    try {
      const updated = await api.patch(`/superadmin/tenants/${id}/status`, {});
      const newStatus = updated.isActive ? 'ACTIVE' : 'SUSPENDED';
      showToast(`Tenant "${name}" status set to ${newStatus}`);
      
      setTenants(tenants.map(t => {
        if (t.id === id) {
          return { 
            ...t, 
            status: updated.isActive ? (t.plan === 'FREE' ? 'TRIAL' : 'ACTIVE') : 'SUSPENDED' 
          };
        }
        return t;
      }));
    } catch (err) {
      showToast(`Error changing status: ${err.message}`);
    }
  };

  const handleDeleteTenant = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete tenant: ${name}? This will delete all its rooms, bookings, and users.`)) {
      try {
        await api.delete(`/superadmin/tenants/${id}`);
        setTenants(tenants.filter(t => t.id !== id));
        showToast(`Tenant "${name}" deleted.`);
      } catch (err) {
        showToast(`Error deleting tenant: ${err.message}`);
      }
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!newName || !newSlug || !newAdminEmail) return;

    setCreateLoading(true);
    try {
      const res = await api.post('/superadmin/tenants', {
        name: newName,
        slug: newSlug.toLowerCase().replace(/\s+/g, '-'),
        adminEmail: newAdminEmail,
        businessType: newType,
        plan: newPlan
      });

      setGeneratedPassword(res.generatedPassword);
      showToast(`Tenant "${newName}" created successfully!`);
      
      // Refresh list
      fetchTenants();
      
      // Reset form (except password visualization helper)
      setNewName('');
      setNewSlug('');
      setNewAdminEmail('');
    } catch (err) {
      showToast(`Error creating tenant: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSaveFeatures = async () => {
    if (!selectedTenant) return;
    try {
      await api.patch(`/superadmin/tenants/${selectedTenant.id}/config`, {
        businessType: selectedTenant.type,
        features: selectedTenant.features
      });

      showToast(`Features updated for ${selectedTenant.name}`);
      
      // Sync list
      setTenants(tenants.map(t => t.id === selectedTenant.id ? { 
        ...t, 
        businessType: selectedTenant.type,
        features: selectedTenant.features 
      } : t));
      
      setShowConfigModal(false);
    } catch (err) {
      showToast(`Error updating configuration: ${err.message}`);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.slug.includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-navy font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-gold" /> Loading property nodes registry...
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
          <h1 className="font-display font-bold text-3xl text-navy">Tenants Registry</h1>
          <p className="text-slate text-sm font-medium mt-1">Onboard and manage platform isolated business tenants and their structural module parameters</p>
        </div>
        <button 
          onClick={() => {
            setGeneratedPassword('');
            setShowCreateModal(true);
          }}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Business
        </button>
      </div>

      {/* Tenants Table */}
      <div className="soft-card bg-white p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-border-cream pb-4">
          <h3 className="font-display font-semibold text-lg text-navy">Isolated Properties</h3>
          <input 
            type="text" 
            placeholder="Search tenant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold w-64 font-semibold"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream/70 text-[10px] font-bold text-navy uppercase tracking-wider bg-cream/10">
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Operational Type</th>
                <th className="py-3 px-4">Database Slug</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Admin Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-cream/5 transition-colors">
                  <td className="py-3.5 px-4 text-navy font-bold">{t.name}</td>
                  <td className="py-3.5 px-4 text-slate">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-cream border border-border-cream/50 px-2 py-0.5 rounded">
                      {t.businessType.replace('_', ' + ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate">{t.slug}</td>
                  <td className="py-3.5 px-4 text-navy">{t.plan}</td>
                  <td className="py-3.5 px-4 text-slate font-mono font-medium">{t.adminEmail}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      t.status === 'ACTIVE' || t.status === 'TRIAL' ? 'text-success' : 'text-danger'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button 
                      onClick={() => {
                        setSelectedTenant(JSON.parse(JSON.stringify(t))); // deep copy
                        setShowConfigModal(true);
                      }}
                      className="text-navy hover:text-navy/80 p-1.5 border border-border-cream hover:border-gold rounded-lg hover:bg-cream/10 transition-all inline-flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Settings className="w-3.5 h-3.5 text-gold" /> Config
                    </button>
                    <button
                      onClick={() => handleToggleStatus(t.id, t.name)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        t.status === 'ACTIVE' || t.status === 'TRIAL'
                          ? 'border-red-100 text-red-500 hover:bg-red-50'
                          : 'border-green-100 text-green-500 hover:bg-green-50'
                      }`}
                      title={t.status === 'ACTIVE' || t.status === 'TRIAL' ? 'Suspend Tenant' : 'Activate Tenant'}
                    >
                      {t.status === 'ACTIVE' || t.status === 'TRIAL' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteTenant(t.id, t.name)}
                      className="text-danger hover:text-red-700 p-1.5 border border-red-50 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate font-medium">
                    No property nodes found matching search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: CONFIGURE FEATURES & BUSINESS TYPE ────────────────── */}
      {showConfigModal && selectedTenant && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-border-cream pb-3">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">{selectedTenant.name} Configuration</h4>
                <p className="text-xs text-slate mt-0.5 font-mono">Tenant Slug: {selectedTenant.slug}</p>
              </div>
              <button onClick={() => setShowConfigModal(false)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            {/* Business Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Business Type</label>
              <select
                value={selectedTenant.type || selectedTenant.businessType}
                onChange={(e) => {
                  const type = e.target.value;
                  setSelectedTenant({
                    ...selectedTenant,
                    type,
                    businessType: type,
                    features: {
                      POS: type === 'RESTAURANT' || type === 'HOTEL_RESTAURANT',
                      ROOMS: type === 'LODGING' || type === 'HOTEL_RESTAURANT',
                      HOUSEKEEPING: type === 'LODGING' || type === 'HOTEL_RESTAURANT'
                    }
                  });
                }}
                className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
              >
                <option value="HOTEL_RESTAURANT">Hotel + Restaurant (Covers both PMS & POS)</option>
                <option value="RESTAURANT">Restaurant Only (POS, Tables, KOT)</option>
                <option value="LODGING">Lodging Only (Reservations, Rooms, Check-In)</option>
              </select>
            </div>

            {/* Feature Allocations */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider block border-b border-border-cream/40 pb-1">Enabled Feature Flags</label>
              
              <div className="space-y-2">
                {Object.keys(selectedTenant.features).map((featureName) => (
                  <div key={featureName} className="flex justify-between items-center p-3 bg-cream/10 border border-border-cream/30 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wider">{featureName}</span>
                      <p className="text-[9px] text-slate mt-0.5">Toggle runtime availability of this operational module</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedTenant({
                          ...selectedTenant,
                          features: {
                            ...selectedTenant.features,
                            [featureName]: !selectedTenant.features[featureName]
                          }
                        });
                      }}
                    >
                      {selectedTenant.features[featureName] ? (
                        <ToggleRight className="w-10 h-10 text-gold fill-gold-pale" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-slate" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-border-cream">
              <button 
                type="button" 
                onClick={() => setShowConfigModal(false)}
                className="w-1/2 btn-secondary py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveFeatures}
                className="w-1/2 btn-primary py-2.5 text-xs font-bold"
              >
                Save Configurations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE TENANT ────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">Create SaaS Tenant</h4>
                <p className="text-xs text-slate mt-0.5">Register a new property and auto-provision the Tenant Admin account</p>
              </div>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            {/* Password notice */}
            {generatedPassword && (
              <div className="p-4 bg-gold-pale/40 border border-gold/30 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-navy block">🔑 Tenant Admin Credentials Provisioned</span>
                <p className="text-slate">Email: <span className="font-bold font-mono text-navy">{newAdminEmail}</span></p>
                <p className="text-slate">Temporary Password: <span className="font-bold font-mono text-navy">{generatedPassword}</span></p>
                <p className="text-[10px] text-slate/80 font-bold block pt-1 text-danger">⚠️ Copy password. It will not be shown again.</p>
              </div>
            )}

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Property / Hotel Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Grand Oberoi Inn"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Tenant Portal Slug</label>
                <input 
                  type="text" 
                  required
                  placeholder="grand-oberoi"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Tenant Admin Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@oberoi.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Business Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  >
                    <option value="HOTEL_RESTAURANT">Hotel + Restaurant</option>
                    <option value="RESTAURANT">Restaurant Only</option>
                    <option value="LODGING">Lodging Only</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Plan Tier</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  >
                    <option value="FREE">Free Trial</option>
                    <option value="STARTER">Starter</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
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
                  disabled={createLoading}
                  className="w-1/2 px-4 py-2.5 bg-navy disabled:bg-navy/70 text-white hover:bg-navy/90 rounded-xl text-xs font-bold"
                >
                  {createLoading ? 'Provisioning...' : 'Create Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminTenants;
