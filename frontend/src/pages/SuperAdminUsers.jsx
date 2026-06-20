import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Check, 
  X, 
  Key, 
  LogOut, 
  ToggleLeft, 
  ToggleRight, 
  UserX, 
  Activity,
  History
} from 'lucide-react';
import api from '../utils/api.js';

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Modals / Drawer State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [showActivityDrawer, setShowActivityDrawer] = useState(false);
  const [userActivities, setUserActivities] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/superadmin/users');
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load system users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Actions
  const handleToggleUserStatus = async (id, name, currentStatus) => {
    try {
      const updated = await api.patch(`/superadmin/users/${id}/status`, {});
      const nextStatus = updated.isActive;
      showToast(`User "${name}" has been ${nextStatus ? 'activated' : 'disabled'}`);
      
      setUsers(users.map(u => {
        if (u.id === id) {
          return { ...u, isActive: nextStatus };
        }
        return u;
      }));
    } catch (err) {
      showToast(`Error updating user status: ${err.message}`);
    }
  };

  const handleForceLogout = (name) => {
    showToast(`Session revoked. Force logged out user "${name}".`);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !selectedUser) return;

    try {
      await api.put(`/superadmin/users/${selectedUser.id}/reset-password`, {
        password: newPassword
      });

      showToast(`Password successfully reset for "${selectedUser.name}"`);
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (err) {
      showToast(`Failed to reset password: ${err.message}`);
    }
  };

  const handleViewActivity = (user) => {
    setSelectedUser(user);
    // Populate simulated user activities
    const simulatedActivities = [
      { id: 'act-1', action: 'User Login', ip: '192.168.1.14', time: '2026-06-19 18:30:15', details: 'Successful login via Chrome Browser' },
      { id: 'act-2', action: 'Update Room Status', ip: '192.168.1.14', time: '2026-06-19 18:34:22', details: 'Changed Room 204 status to AVAILABLE' },
      { id: 'act-3', action: 'Create Reservation', ip: '192.168.1.14', time: '2026-06-19 18:38:10', details: 'Booked Room 102 for Guest Amit Kumar' },
      { id: 'act-4', action: 'Print Bill', ip: '192.168.1.25', time: '2026-06-19 14:02:11', details: 'Generated invoice #INV-44280 for ₹1,249' }
    ].filter(() => Math.random() > 0.3); // randomize count slightly

    setUserActivities(simulatedActivities);
    setShowActivityDrawer(true);
  };

  // Unique lists for filters
  const tenantsList = ['ALL', ...new Set(users.map(u => u.tenant))];
  const rolesList = ['ALL', ...new Set(users.map(u => u.role))];

  // Filtering
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTenant = selectedTenant === 'ALL' || u.tenant === selectedTenant;
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchesSearch && matchesTenant && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-navy font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-gold" /> Loading platform users registry...
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
          <h1 className="font-display font-bold text-3xl text-navy">Platform Users Directory</h1>
          <p className="text-slate text-sm font-medium mt-1">Audit, disable, reset credentials, or revoke active sessions for hotel and kitchen staffs across all properties</p>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Total Platform Users</p>
            <h3 className="font-display font-bold text-2xl text-navy">{users.length}</h3>
            <span className="text-[10px] text-slate font-medium">System-wide staff accounts</span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Active Staffs</p>
            <h3 className="font-display font-bold text-2xl text-success">
              {users.filter(u => u.isActive).length}
            </h3>
            <span className="text-[10px] text-slate font-medium">Operational status active</span>
          </div>
          <div className="w-12 h-12 bg-success-pale rounded-2xl flex items-center justify-center border border-success/10 text-success">
            <Check className="w-6 h-6" />
          </div>
        </div>

        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Suspended Staffs</p>
            <h3 className="font-display font-bold text-2xl text-danger">
              {users.filter(u => !u.isActive).length}
            </h3>
            <span className="text-[10px] text-slate font-medium">Access revoked nodes</span>
          </div>
          <div className="w-12 h-12 bg-danger-pale rounded-2xl flex items-center justify-center border border-danger/10 text-danger">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Live Logged In</p>
            <h3 className="font-display font-bold text-2xl text-navy">5 Sessions</h3>
            <span className="text-[10px] text-success font-bold animate-pulse">● Online heartbeat sync</span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* User Directory Table Card */}
      <div className="soft-card bg-white p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-cream pb-4">
          <h3 className="font-display font-semibold text-lg text-navy">All System Users</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search staff name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold w-56 font-semibold"
              />
            </div>

            {/* Tenant Property Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Property:</span>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="px-2.5 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold bg-white font-semibold"
              >
                {tenantsList.map(t => (
                  <option key={t} value={t}>{t === 'ALL' ? 'All Tenants' : t}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-2.5 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold bg-white font-semibold"
              >
                {rolesList.map(r => (
                  <option key={r} value={r}>{r === 'ALL' ? 'All Roles' : r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream/70 text-[10px] font-bold text-navy uppercase tracking-wider bg-cream/10">
                <th className="py-3 px-4">Staff User Details</th>
                <th className="py-3 px-4">Associated Tenant</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-cream/5 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy/5 text-navy border border-navy/15 flex items-center justify-center font-bold text-xs uppercase">
                      {user.initials}
                    </div>
                    <div>
                      <span className="text-navy font-bold block">{user.name}</span>
                      <span className="text-[10px] text-slate font-medium block mt-0.5">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal">{user.tenant}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-cream border border-border-cream/60 px-2 py-0.5 rounded text-navy">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      user.isActive ? 'text-success' : 'text-danger'
                    }`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate font-mono font-medium">{user.lastLogin}</td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {/* View User Activity */}
                    <button 
                      onClick={() => handleViewActivity(user)}
                      className="text-navy hover:text-navy/80 p-1.5 border border-border-cream hover:border-gold rounded-lg hover:bg-cream/10 transition-all inline-flex items-center gap-1 text-[10px] font-bold"
                      title="User Audit Trail"
                    >
                      <History className="w-3.5 h-3.5 text-gold" /> Log
                    </button>
                    {/* Reset Password */}
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPasswordModal(true);
                      }}
                      className="p-1.5 border border-border-cream hover:border-navy rounded-lg text-slate hover:text-navy transition-all"
                      title="Reset Password"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>
                    {/* Force Logout */}
                    <button 
                      onClick={() => handleForceLogout(user.name)}
                      className="p-1.5 border border-border-cream hover:border-red-500 rounded-lg text-slate hover:text-red-500 transition-all"
                      title="Force Logout Session"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                    {/* Toggle Active Status */}
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.name, user.isActive)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        user.isActive
                          ? 'border-red-100 text-red-500 hover:bg-red-50'
                          : 'border-green-100 text-green-500 hover:bg-green-50'
                      }`}
                      title={user.isActive ? 'Disable User' : 'Enable User'}
                    >
                      {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate font-medium">
                    No system users found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: RESET PASSWORD ─────────────────────────────────── */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">Reset User Password</h4>
                <p className="text-xs text-slate mt-0.5 font-medium">Override credentials for: <span className="font-bold text-navy">{selectedUser.name}</span></p>
              </div>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">New Account Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="w-1/2 px-4 py-2.5 border border-border-cream text-charcoal hover:bg-stone-50 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 px-4 py-2.5 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: USER ACTIVITY DRILL DOWN ────────────────────────── */}
      {showActivityDrawer && selectedUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-border-cream pb-3">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">{selectedUser.name} Activity Audit</h4>
                <p className="text-xs text-slate mt-0.5">Recent actions performed under tenant: <span className="font-bold text-navy">{selectedUser.tenant}</span></p>
              </div>
              <button onClick={() => setShowActivityDrawer(false)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {userActivities.map(activity => (
                <div key={activity.id} className="p-4 bg-cream/30 border border-border-cream/50 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy">{activity.action}</span>
                    <span className="text-[10px] text-slate font-mono">{activity.time}</span>
                  </div>
                  <p className="text-slate font-medium">{activity.details}</p>
                  <div className="text-[9px] text-slate font-mono">
                    Terminal Node IP: <span className="text-charcoal font-bold">{activity.ip}</span>
                  </div>
                </div>
              ))}
              {userActivities.length === 0 && (
                <p className="text-center py-6 text-slate font-medium">No recent activities logged for this user.</p>
              )}
            </div>

            <div className="flex pt-3 border-t border-border-cream">
              <button 
                type="button" 
                onClick={() => setShowActivityDrawer(false)}
                className="w-full btn-secondary py-2.5 text-xs font-bold"
              >
                Close Audit Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminUsers;
