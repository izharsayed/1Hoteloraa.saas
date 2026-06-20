import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  CreditCard, 
  Activity, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Edit3, 
  Settings, 
  Plus, 
  Check, 
  UserCheck, 
  TrendingUp, 
  Cpu 
} from 'lucide-react';

function SuperAdminPage() {
  // Mock Tenants State
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Grand Palace Resort', slug: 'grand-palace', type: 'HOTEL_RESTAURANT', plan: 'ENTERPRISE', status: 'ACTIVE', mrr: '₹14,999', dateJoined: '2025-01-12', features: { POS: true, ROOMS: true, HOUSEKEEPING: true } },
    { id: 2, name: 'Olive Garden Bistro', slug: 'olive-garden', type: 'RESTAURANT', plan: 'STARTER', status: 'ACTIVE', mrr: '₹4,999', dateJoined: '2025-03-24', features: { POS: true, ROOMS: false, HOUSEKEEPING: false } },
    { id: 3, name: 'Royal Residency Suites', slug: 'royal-residency', type: 'LODGING', plan: 'PROFESSIONAL', status: 'ACTIVE', mrr: '₹9,999', dateJoined: '2025-02-18', features: { POS: false, ROOMS: true, HOUSEKEEPING: true } },
    { id: 4, name: 'Heritage Heritage Hotel', slug: 'heritage-inn', type: 'HOTEL_RESTAURANT', plan: 'ENTERPRISE', status: 'ACTIVE', mrr: '₹14,999', dateJoined: '2024-11-05', features: { POS: true, ROOMS: true, HOUSEKEEPING: true } },
    { id: 5, name: 'Highway Diner', slug: 'highway-diner', type: 'RESTAURANT', plan: 'FREE', status: 'TRIAL', mrr: '₹0', dateJoined: '2026-06-01', features: { POS: true, ROOMS: false, HOUSEKEEPING: false } },
    { id: 6, name: 'Oakwood Cabins', slug: 'oakwood', type: 'LODGING', plan: 'STARTER', status: 'INACTIVE', mrr: '₹0', dateJoined: '2025-05-10', features: { POS: false, ROOMS: true, HOUSEKEEPING: true } },
  ]);

  const [activePlanFilter, setActivePlanFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Tenant for Config Modal
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // New Tenant Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newTenantType, setNewTenantType] = useState('HOTEL_RESTAURANT');
  const [newTenantPlan, setNewTenantPlan] = useState('STARTER');

  // Custom Notifications Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleTenantStatus = (id) => {
    const updated = tenants.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        showToast(`Tenant "${t.name}" status updated to ${newStatus}`);
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTenants(updated);
  };

  const handleUpdateTenantFeatures = (featureName) => {
    if (!selectedTenant) return;
    const updatedTenant = {
      ...selectedTenant,
      features: {
        ...selectedTenant.features,
        [featureName]: !selectedTenant.features[featureName]
      }
    };
    setSelectedTenant(updatedTenant);
    
    // Update main list
    setTenants(tenants.map(t => t.id === selectedTenant.id ? updatedTenant : t));
  };

  const handleUpdateTenantPlan = (plan) => {
    if (!selectedTenant) return;
    const mrrValues = { FREE: '₹0', STARTER: '₹4,999', PROFESSIONAL: '₹9,999', ENTERPRISE: '₹14,999' };
    const updatedTenant = {
      ...selectedTenant,
      plan,
      mrr: mrrValues[plan]
    };
    setSelectedTenant(updatedTenant);
    setTenants(tenants.map(t => t.id === selectedTenant.id ? updatedTenant : t));
    showToast(`Plan upgraded to ${plan}`);
  };

  const handleCreateTenant = (e) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSlug) return;

    const mrrValues = { FREE: '₹0', STARTER: '₹4,999', PROFESSIONAL: '₹9,999', ENTERPRISE: '₹14,999' };
    const newTenant = {
      id: Date.now(),
      name: newTenantName,
      slug: newTenantSlug.toLowerCase().replace(/\s+/g, '-'),
      type: newTenantType,
      plan: newTenantPlan,
      status: 'ACTIVE',
      mrr: mrrValues[newTenantPlan],
      dateJoined: new Date().toISOString().split('T')[0],
      features: {
        POS: newTenantType === 'RESTAURANT' || newTenantType === 'HOTEL_RESTAURANT',
        ROOMS: newTenantType === 'LODGING' || newTenantType === 'HOTEL_RESTAURANT',
        HOUSEKEEPING: newTenantType === 'LODGING' || newTenantType === 'HOTEL_RESTAURANT'
      }
    };

    setTenants([...tenants, newTenant]);
    setNewTenantName('');
    setNewTenantSlug('');
    setShowCreateModal(false);
    showToast(`Tenant "${newTenant.name}" created successfully!`);
  };

  // Filters calculation
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.slug.includes(searchQuery.toLowerCase());
    const matchesFilter = activePlanFilter === 'ALL' || t.plan === activePlanFilter;
    return matchesSearch && matchesFilter;
  });

  const totalMRR = tenants
    .filter(t => t.status === 'ACTIVE')
    .reduce((acc, curr) => acc + parseInt(curr.mrr.replace(/[^0-9]/g, '')) || 0, 0);

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
          <h1 className="font-display font-bold text-3xl text-navy">Super Admin Command Center</h1>
          <p className="text-slate text-sm font-medium mt-1">Monitor server resources, manage multi-tenant subscriptions, and control system flags</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Tenant
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tenants */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Total Tenants</p>
            <h3 className="font-display font-bold text-2xl text-navy">{tenants.length}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +2 this week
            </span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* ARR / MRR */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Monthly Recurring Revenue</p>
            <h3 className="font-display font-bold text-2xl text-navy">₹{totalMRR.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 8.4% growth MoM
            </span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* API Usage / Health */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Server Health Status</p>
            <h3 className="font-display font-bold text-2xl text-success flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-success" /> 99.98%
            </h3>
            <span className="text-[10px] text-slate font-medium">Uptime current monthly period</span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Database Node Latency */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">DB Cluster CPU Load</p>
            <h3 className="font-display font-bold text-2xl text-navy">12%</h3>
            <span className="text-[10px] text-slate font-medium font-mono">14ms latency response</span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Database Node Stats & Performance */}
      <div className="soft-card bg-white p-6 space-y-4">
        <h3 className="font-display font-semibold text-lg text-navy border-b border-border-cream pb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-gold" /> System Cluster Resources Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate">API Gateway CPU Core Load:</span>
              <span className="text-navy">14% / 100%</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2">
              <div className="bg-gold h-2 rounded-full" style={{ width: '14%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate">Memory Utilization:</span>
              <span className="text-navy">3.2 GB / 8.0 GB (40%)</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2">
              <div className="bg-gold h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate">Database Memory Pool Cache:</span>
              <span className="text-navy">65% Hit Ratio</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2">
              <div className="bg-gold h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Registry & Management Section */}
      <div className="soft-card bg-white p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-cream pb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-navy">Platform Tenants Registry</h3>
            <p className="text-[11px] text-slate mt-0.5">Manage and configure active multi-tenant restaurant and lodging operations properties</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <input 
              type="text" 
              placeholder="Search property name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold w-48 font-semibold"
            />

            {/* Filter Tabs */}
            <div className="flex border border-border-cream rounded-xl overflow-hidden text-[10px] font-bold uppercase tracking-wider">
              {['ALL', 'FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'].map((plan) => (
                <button
                  key={plan}
                  onClick={() => setActivePlanFilter(plan)}
                  className={`px-3 py-2 transition-all border-r last:border-0 border-border-cream ${
                    activePlanFilter === plan 
                      ? 'bg-gold text-white' 
                      : 'bg-white text-slate hover:bg-cream/10'
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream/70 text-[10px] font-bold text-navy uppercase tracking-wider bg-cream/10">
                <th className="py-3 px-4">Property Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">MRR</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-cream/5 transition-colors">
                  <td className="py-3.5 px-4 text-navy font-bold">{t.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate">
                      {t.type.replace('_', ' + ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate">{t.slug}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded border ${
                      t.plan === 'ENTERPRISE' ? 'bg-navy/5 text-navy border-navy/20' :
                      t.plan === 'PROFESSIONAL' ? 'bg-gold-pale/40 text-navy border-gold/20' :
                      t.plan === 'STARTER' ? 'bg-cream/40 text-charcoal border-border-cream' :
                      'bg-stone-50 text-slate border-stone-200'
                    }`}>
                      {t.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy">{t.mrr}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      t.status === 'ACTIVE' ? 'text-success' : 'text-danger'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate font-mono font-medium">{t.dateJoined}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedTenant(t);
                        setShowConfigModal(true);
                      }}
                      className="text-navy hover:text-navy/80 p-1.5 border border-border-cream hover:border-gold rounded-lg hover:bg-cream/10 transition-all inline-flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Settings className="w-3.5 h-3.5 text-gold" /> Config
                    </button>
                    <button
                      onClick={() => handleToggleTenantStatus(t.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        t.status === 'ACTIVE'
                          ? 'border-danger-pale text-danger hover:bg-danger-pale/50'
                          : 'border-success/20 text-success hover:bg-success/10'
                      }`}
                    >
                      {t.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate font-medium text-xs">
                    No tenants found matching search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: CONFIGURE TENANT ─────────────────────────────────── */}
      {showConfigModal && selectedTenant && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-border-cream pb-3">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">{selectedTenant.name}</h4>
                <p className="text-xs text-slate mt-0.5 font-mono">slug: {selectedTenant.slug}</p>
              </div>
              <span className="text-[10px] font-bold text-slate uppercase bg-cream/30 border border-border-cream px-2 py-0.5 rounded">
                Plan: {selectedTenant.plan}
              </span>
            </div>

            {/* Plan tier upgrade */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Upgrade Subscription Plan Tier</label>
              <div className="grid grid-cols-4 gap-2">
                {['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => handleUpdateTenantPlan(tier)}
                    className={`px-3 py-2 border rounded-xl text-[10px] font-bold transition-all uppercase tracking-wide ${
                      selectedTenant.plan === tier 
                        ? 'bg-gold border-gold text-white font-semibold' 
                        : 'border-border-cream hover:border-gold bg-white text-slate'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Allocations */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider block border-b border-border-cream/40 pb-1">Feature Flags & Allocation Modules</label>
              
              <div className="space-y-2">
                {/* POS Toggle */}
                <div className="flex justify-between items-center p-3 bg-cream/10 border border-border-cream/30 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-charcoal">POS Seating & Dining Seating Map</span>
                    <p className="text-[9px] text-slate">Allows Dine-In POS billing and KOT routing</p>
                  </div>
                  <button onClick={() => handleUpdateTenantFeatures('POS')}>
                    {selectedTenant.features.POS ? (
                      <ToggleRight className="w-10 h-10 text-gold fill-gold-pale" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-slate" />
                    )}
                  </button>
                </div>

                {/* ROOMS Toggle */}
                <div className="flex justify-between items-center p-3 bg-cream/10 border border-border-cream/30 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-charcoal">Room Directory & Reservations Calendar</span>
                    <p className="text-[9px] text-slate">Allows front desk check-in, check-out, and folios</p>
                  </div>
                  <button onClick={() => handleUpdateTenantFeatures('ROOMS')}>
                    {selectedTenant.features.ROOMS ? (
                      <ToggleRight className="w-10 h-10 text-gold fill-gold-pale" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-slate" />
                    )}
                  </button>
                </div>

                {/* HOUSEKEEPING Toggle */}
                <div className="flex justify-between items-center p-3 bg-cream/10 border border-border-cream/30 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-charcoal">Housekeeping Schedule Panel</span>
                    <p className="text-[9px] text-slate">Allows task creation, cleaning assignments, inspect flags</p>
                  </div>
                  <button onClick={() => handleUpdateTenantFeatures('HOUSEKEEPING')}>
                    {selectedTenant.features.HOUSEKEEPING ? (
                      <ToggleRight className="w-10 h-10 text-gold fill-gold-pale" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-slate" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex pt-3 border-t border-border-cream">
              <button 
                type="button" 
                onClick={() => {
                  setShowConfigModal(false);
                  setSelectedTenant(null);
                }}
                className="w-full btn-secondary py-2.5 text-xs flex justify-center items-center font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE TENANT ────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h4 className="font-display font-bold text-navy text-lg">Create SaaS Tenant</h4>
              <p className="text-xs text-slate mt-0.5">Register a new property node on the Hoteloraa platform cluster</p>
            </div>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Property / Hotel Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Grand Oberoi Inn"
                  value={newTenantName}
                  onChange={(e) => {
                    setNewTenantName(e.target.value);
                    setNewTenantSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
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
                  value={newTenantSlug}
                  onChange={(e) => setNewTenantSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Business Model Type</label>
                <select
                  value={newTenantType}
                  onChange={(e) => setNewTenantType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                >
                  <option value="HOTEL_RESTAURANT">Hotel + Restaurant (Covers both PMS & POS)</option>
                  <option value="RESTAURANT">Restaurant Only (POS, Tables, KOT)</option>
                  <option value="LODGING">Lodging Only (Reservations, Rooms, Check-In)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Initial Subscription Tier</label>
                <select
                  value={newTenantPlan}
                  onChange={(e) => setNewTenantPlan(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                >
                  <option value="FREE">Free Trial Plan</option>
                  <option value="STARTER">Starter Plan (₹4,999/mo)</option>
                  <option value="PROFESSIONAL">Professional Plan (₹9,999/mo)</option>
                  <option value="ENTERPRISE">Enterprise Suite (₹14,999/mo)</option>
                </select>
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
                  Create Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminPage;
