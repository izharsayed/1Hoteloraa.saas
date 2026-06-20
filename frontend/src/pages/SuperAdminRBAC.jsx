import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Check, 
  Trash2, 
  Settings2, 
  Key, 
  Users, 
  Lock, 
  FileLock2,
  X,
  Activity
} from 'lucide-react';
import api from '../utils/api.js';

// Mapping functions between frontend UI keys and backend/database keys
const mapToDbPermission = (key) => {
  const [mod, act] = key.split('.');
  const actionMap = {
    view: 'read',
    create: 'create',
    update: 'update',
    delete: 'delete'
  };
  const moduleMap = {
    room: 'rooms',
    reservation: 'reservations',
    guest: 'guests',
    housekeeping: 'housekeeping',
    table: 'tables',
    menu: 'menu',
    order: 'orders',
    kot: 'kot',
    billing: 'billing',
    inventory: 'inventory'
  };
  const dbMod = moduleMap[mod] || mod;
  const dbAct = actionMap[act] || act;
  return `${dbMod}.${dbAct}`;
};

const mapToUiPermission = (key) => {
  const [mod, act] = key.split('.');
  const actionMap = {
    read: 'view',
    create: 'create',
    update: 'update',
    delete: 'delete'
  };
  const moduleMap = {
    rooms: 'room',
    reservations: 'reservation',
    guests: 'guest',
    housekeeping: 'housekeeping',
    tables: 'table',
    menu: 'menu',
    orders: 'order',
    kot: 'kot',
    billing: 'billing',
    inventory: 'inventory'
  };
  const uiMod = moduleMap[mod] || mod;
  const uiAct = actionMap[act] || act;
  return `${uiMod}.${uiAct}`;
};

function SuperAdminRBAC() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Active Role for Permissions Matrix
  const [selectedRoleId, setSelectedRoleId] = useState('');
  
  // Modals state
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Predefined System Modules & Actions
  const modules = [
    { key: 'room', name: 'Room Directory' },
    { key: 'reservation', name: 'Reservations Calendar' },
    { key: 'guest', name: 'Guest Profiles' },
    { key: 'housekeeping', name: 'Housekeeping Tasks' },
    { key: 'table', name: 'Dining Table Map' },
    { key: 'menu', name: 'Menu Editor' },
    { key: 'order', name: 'Order Processing' },
    { key: 'kot', name: 'Kitchen Order Tickets' },
    { key: 'billing', name: 'POS Billing' },
    { key: 'inventory', name: 'Inventory & Stock' },
  ];

  const actions = ['view', 'create', 'update', 'delete'];

  const fetchRoles = async (selectFirst = false) => {
    try {
      if (selectFirst) setLoading(true);
      const data = await api.get('/superadmin/roles');
      
      // Translate permissions to UI formats
      const formatted = data.map(r => ({
        ...r,
        permissions: r.permissions.map(mapToUiPermission)
      }));

      setRoles(formatted);
      
      if (selectFirst && formatted.length > 0) {
        setSelectedRoleId(formatted[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(true);
  }, []);

  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = async (permKey) => {
    // Prevent modification of Tenant Admin
    if (activeRole.name === 'Tenant Admin') {
      showToast('Tenant Admin role must retain all system permissions.');
      return;
    }

    const hasPermission = activeRole.permissions.includes(permKey);
    const updatedUiPermissions = hasPermission
      ? activeRole.permissions.filter(p => p !== permKey)
      : [...activeRole.permissions, permKey];

    // Optimistically update state
    setRoles(roles.map(r => r.id === selectedRoleId ? { ...r, permissions: updatedUiPermissions } : r));

    try {
      // Translate back to db formats for the payload
      const dbPermissions = updatedUiPermissions.map(mapToDbPermission);
      await api.patch(`/superadmin/roles/${selectedRoleId}/permissions`, {
        permissions: dbPermissions
      });
      showToast(`Permission "${permKey}" updated for ${activeRole.name}`);
    } catch (err) {
      showToast(`Error updating permission: ${err.message}`);
      // Revert on error
      fetchRoles();
    }
  };

  const handleToggleAllModulePermissions = async (moduleKey, checkAll) => {
    if (activeRole.name === 'Tenant Admin') {
      showToast('Tenant Admin role must retain all system permissions.');
      return;
    }

    const modulePermKeys = actions.map(act => `${moduleKey}.${act}`);
    let updatedUiPermissions = [...activeRole.permissions];

    if (checkAll) {
      modulePermKeys.forEach(pk => {
        if (!updatedUiPermissions.includes(pk)) {
          updatedUiPermissions.push(pk);
        }
      });
    } else {
      updatedUiPermissions = updatedUiPermissions.filter(pk => !modulePermKeys.includes(pk));
    }

    // Optimistically update
    setRoles(roles.map(r => r.id === selectedRoleId ? { ...r, permissions: updatedUiPermissions } : r));

    try {
      const dbPermissions = updatedUiPermissions.map(mapToDbPermission);
      await api.patch(`/superadmin/roles/${selectedRoleId}/permissions`, {
        permissions: dbPermissions
      });
      showToast(`${checkAll ? 'Granted' : 'Revoked'} all "${moduleKey}" permissions for ${activeRole.name}`);
    } catch (err) {
      showToast(`Error updating permissions: ${err.message}`);
      fetchRoles();
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName) return;

    setActionLoading(true);
    try {
      const res = await api.post('/superadmin/roles', {
        name: newRoleName,
        description: newRoleDesc
      });

      showToast(`Global Role "${res.name}" created successfully.`);
      setShowAddRoleModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      
      // Refresh and select new
      await fetchRoles();
      setSelectedRoleId(res.id);
    } catch (err) {
      showToast(`Error creating role: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async (id, name, isSystem) => {
    if (isSystem) {
      showToast('System predefined roles cannot be deleted.');
      return;
    }
    if (window.confirm(`Delete global role "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/superadmin/roles/${id}`);
        setRoles(roles.filter(r => r.id !== id));
        setSelectedRoleId(roles[0]?.id || '');
        showToast(`Global Role "${name}" deleted.`);
      } catch (err) {
        showToast(`Failed to delete role: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-navy font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-gold" /> Loading RBAC permission matrix...
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
          <h1 className="font-display font-bold text-3xl text-navy">Global RBAC & Access Control</h1>
          <p className="text-slate text-sm font-medium mt-1">Configure systemic employee roles and map module permission parameters across all cluster tenants</p>
        </div>
        <button 
          onClick={() => setShowAddRoleModal(true)}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Roles directory */}
        <div className="lg:col-span-4 space-y-6">
          <div className="soft-card bg-white p-6 space-y-4">
            <h3 className="font-display font-semibold text-base text-navy flex items-center gap-2 border-b border-border-cream pb-3">
              <Users className="w-4 h-4 text-gold" /> Global Roles Registry
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {roles.map(r => (
                <div 
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative ${
                    selectedRoleId === r.id 
                      ? 'bg-navy border-navy text-white shadow-md' 
                      : 'border-border-cream hover:border-gold hover:bg-cream/5 text-charcoal'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold leading-none">{r.name}</span>
                    <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded leading-none ${
                      selectedRoleId === r.id 
                        ? 'bg-white/10 text-gold-light'
                        : 'bg-cream text-navy border border-border-cream/50'
                    }`}>
                      {r.isSystem ? 'System' : 'Custom'}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-2 font-medium line-clamp-2 leading-relaxed ${
                    selectedRoleId === r.id ? 'text-white/70' : 'text-slate'
                  }`}>
                    {r.description || 'No description provided.'}
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-border-cream/20">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                      selectedRoleId === r.id ? 'text-gold' : 'text-navy'
                    }`}>
                      {r.permissions.length} Permissions Active
                    </span>
                    {!r.isSystem && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(r.id, r.name, r.isSystem);
                        }}
                        className={`p-1 rounded hover:bg-red-500/10 transition-colors ${
                          selectedRoleId === r.id ? 'text-red-400 hover:text-red-300' : 'text-danger'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        {activeRole && (
          <div className="lg:col-span-8 space-y-6">
            <div className="soft-card bg-white p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-cream pb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-navy">
                    Permissions Matrix: <span className="text-gold font-bold">{activeRole.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate mt-0.5">Toggle runtime modules and read/write permission flags. System roles are pre-seeded.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Module Overrides</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${activeRole.name === 'Tenant Admin' ? 'bg-success' : 'bg-gold animate-pulse'}`} />
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-border-cream/40 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-cream text-[10px] font-bold text-navy uppercase tracking-wider bg-cream/20">
                      <th className="py-3 px-5 w-1/3">Module / Entity Path</th>
                      {actions.map(act => (
                        <th key={act} className="py-3 px-4 text-center capitalize">{act}</th>
                      ))}
                      <th className="py-3 px-5 text-right">Quick Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
                    {modules.map((mod) => {
                      const modulePerms = actions.map(act => `${mod.key}.${act}`);
                      const activeCount = modulePerms.filter(pk => activeRole.permissions.includes(pk)).length;
                      const allChecked = activeCount === actions.length;

                      return (
                        <tr key={mod.key} className="hover:bg-cream/5 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-charcoal flex items-center gap-2.5">
                            <Lock className="w-3.5 h-3.5 text-slate/60" />
                            <div>
                              <span className="text-navy">{mod.name}</span>
                              <span className="block text-[9px] text-slate font-mono uppercase mt-0.5">{mod.key}.*</span>
                            </div>
                          </td>
                          
                          {/* Checkboxes for Actions */}
                          {actions.map(act => {
                            const permKey = `${mod.key}.${act}`;
                            const isChecked = activeRole.permissions.includes(permKey);
                            return (
                              <td key={act} className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePermission(permKey)}
                                  disabled={activeRole.name === 'Tenant Admin'}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center mx-auto transition-all ${
                                    isChecked 
                                      ? 'bg-navy border-navy text-gold font-bold' 
                                      : 'border-border-cream hover:border-gold bg-white text-transparent'
                                  } ${activeRole.name === 'Tenant Admin' ? 'cursor-not-allowed opacity-80' : ''}`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                              </td>
                            );
                          })}

                          {/* Quick Control toggle entire module */}
                          <td className="py-3.5 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAllModulePermissions(mod.key, !allChecked)}
                              disabled={activeRole.name === 'Tenant Admin'}
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                                allChecked 
                                  ? 'bg-red-50 text-danger border border-red-100 hover:bg-red-100'
                                  : 'bg-gold-pale text-navy border border-gold/30 hover:bg-gold/10'
                              } ${activeRole.name === 'Tenant Admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {allChecked ? 'Revoke All' : 'Grant All'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-cream/35 border border-border-cream/60 rounded-2xl flex items-center gap-3">
                <FileLock2 className="w-5 h-5 text-gold shrink-0" />
                <p className="text-[10px] text-slate leading-relaxed">
                  <span className="font-bold text-navy">Security Policy Override:</span> Pre-loaded global roles serve as the blueprint defaults for new tenants. Individual Tenant Admins can override permissions for custom local roles inside their property, but cannot access unauthorized modules flag-restricted by their billing plan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL: CREATE GLOBAL ROLE ───────────────────────────────── */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">Create Global System Role</h4>
                <p className="text-xs text-slate mt-0.5">Define a systemic template role distributed to all tenant databases</p>
              </div>
              <button onClick={() => setShowAddRoleModal(false)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Role Identity Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Operational Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Role Description</label>
                <textarea 
                  rows="3"
                  placeholder="Reviews transaction logs, generates financial compliance reports, and audits inventories."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddRoleModal(false)}
                  className="w-1/2 px-4 py-2.5 border border-border-cream text-charcoal hover:bg-stone-50 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="w-1/2 px-4 py-2.5 bg-navy disabled:bg-navy/70 text-white hover:bg-navy/90 rounded-xl text-xs font-bold"
                >
                  {actionLoading ? 'Creating...' : 'Register Global Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminRBAC;
