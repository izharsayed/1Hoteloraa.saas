import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Eye, 
  ArrowRight,
  TrendingDown, 
  Terminal,
  Activity,
  X
} from 'lucide-react';
import api from '../utils/api.js';

function SuperAdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');

  // Detail Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.get('/superadmin/audit-logs');
      
      // format timestamps nicely
      const formatted = data.map(l => ({
        ...l,
        timestamp: l.timestamp ? l.timestamp.replace('T', ' ').substring(0, 19) : 'Never'
      }));

      setLogs(formatted);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Simulator
  const handleSimulateLog = async () => {
    const actionsPool = [
      { act: 'SUBSCRIPTION_DOWNGRADED', actor: 'billing-portal', entity: 'Cafe Aroma', prev: 'Plan: ENTERPRISE', new: 'Plan: STARTER', sev: 'WARNING' },
      { act: 'FEATURE_ENABLED', actor: 'SuperAdmin@hoteloraa.com', entity: 'Star Lodge', prev: 'KOT Module: DISABLED', new: 'KOT Module: ENABLED', sev: 'SUCCESS' },
      { act: 'USER_DISABLED', actor: 'SuperAdmin@hoteloraa.com', entity: 'temp-operator@royalpalace.com', prev: 'IsActive: TRUE', newValue: 'IsActive: FALSE', sev: 'DANGER' },
      { act: 'PASSWORD_RESET', actor: 'security-admin', entity: 'admin@cafearoma.com', prev: 'Hash: md5...', new: 'Hash: argon2...', sev: 'INFO' }
    ];

    const randomEvent = actionsPool[Math.floor(Math.random() * actionsPool.length)];
    
    try {
      const created = await api.post('/superadmin/audit-logs/simulate', {
        action: randomEvent.act,
        actor: randomEvent.actor,
        entity: randomEvent.entity,
        previousValue: randomEvent.prev,
        newValue: randomEvent.new || randomEvent.newValue,
        severity: randomEvent.sev
      });

      // format timestamp
      created.timestamp = created.timestamp.replace('T', ' ').substring(0, 19);

      setLogs([created, ...logs]);
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    }
  };

  // Filters calculation
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

    return matchesSearch && matchesSeverity && matchesAction;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'SUCCESS':
        return 'bg-success-pale text-success border border-success/20';
      case 'WARNING':
        return 'bg-warning-pale text-warning border border-warning/20';
      case 'DANGER':
        return 'bg-danger-pale text-danger border border-danger/20';
      default:
        return 'bg-cream text-charcoal border border-border-cream';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-navy font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-gold" /> Loading cluster audit logs...
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">System Audit Logs</h1>
          <p className="text-slate text-sm font-medium mt-1">Real-time recording of critical cluster actions, configuration changes, subscription shifts, and admin logins</p>
        </div>
        <button 
          onClick={handleSimulateLog}
          className="btn-accent text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> Simulate Audit Event
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="soft-card p-4 bg-white space-y-1">
          <span className="text-[10px] text-slate uppercase">Total Actions Logged</span>
          <span className="text-xl text-navy font-bold">{logs.length}</span>
        </div>
        <div className="soft-card p-4 bg-white space-y-1">
          <span className="text-[10px] text-slate uppercase">Security & Warnings</span>
          <span className="text-xl text-warning font-bold">
            {logs.filter(l => l.severity === 'WARNING').length} Logs
          </span>
        </div>
        <div className="soft-card p-4 bg-white space-y-1">
          <span className="text-[10px] text-slate uppercase">Critical Deletions</span>
          <span className="text-xl text-danger font-bold">
            {logs.filter(l => l.severity === 'DANGER').length} Logs
          </span>
        </div>
        <div className="soft-card p-4 bg-white space-y-1">
          <span className="text-[10px] text-slate uppercase">Active Monitor Sync</span>
          <span className="text-xl text-success font-bold flex items-center gap-1.5">
            <Terminal className="w-4.5 h-4.5 text-success" /> Live Active
          </span>
        </div>
      </div>

      {/* Filter and Search Drawer */}
      <div className="soft-card bg-white p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by action name, admin actor, or affected entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold font-semibold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Severity Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Severity:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold font-semibold bg-white"
              >
                <option value="ALL">All Severities</option>
                <option value="INFO">Info</option>
                <option value="SUCCESS">Success</option>
                <option value="WARNING">Warning</option>
                <option value="DANGER">Danger</option>
              </select>
            </div>

            {/* Action Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Action Type:</span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-3 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold font-semibold bg-white"
              >
                <option value="ALL">All Actions</option>
                <option value="TENANT_CREATED">Tenant Created</option>
                <option value="TENANT_ACTIVATED">Tenant Activated</option>
                <option value="TENANT_SUSPENDED">Tenant Suspended</option>
                <option value="TENANT_DELETED">Tenant Deleted</option>
                <option value="SUBSCRIPTION_UPGRADED">Subscription Upgraded</option>
                <option value="SUBSCRIPTION_DOWNGRADED">Subscription Downgraded</option>
                <option value="FEATURE_ENABLED">Feature Enabled</option>
                <option value="FEATURE_DISABLED">Feature Disabled</option>
                <option value="PASSWORD_RESET">Password Reset</option>
                <option value="USER_DISABLED">User Disabled</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('ALL');
                setSelectedAction('ALL');
              }}
              className="p-2 border border-border-cream hover:border-gold hover:bg-cream/10 rounded-xl text-slate transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream text-[10px] font-bold text-navy uppercase tracking-wider bg-cream/15">
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Admin Actor</th>
                <th className="py-3 px-4">Entity/User Affected</th>
                <th className="py-3 px-4">Diff Changes (Previous → New)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-cream/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="text-navy font-bold font-mono text-[10px] bg-navy/5 px-2 py-0.5 rounded border border-navy/10 uppercase tracking-wide">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal">{log.actor}</td>
                  <td className="py-3.5 px-4 text-slate">{log.entity}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-mono text-[10px] text-slate/90">
                    <span className="text-danger-pale bg-danger/5 border border-danger/10 px-1 py-0.5 rounded inline-block truncate max-w-[100px] align-middle">
                      {log.previousValue}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 mx-1.5 text-slate/50 inline-block align-middle" />
                    <span className="text-success-pale bg-success/5 border border-success/10 px-1 py-0.5 rounded inline-block truncate max-w-[100px] align-middle">
                      {log.newValue}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate font-mono font-medium">{log.timestamp}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full inline-block ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 border border-border-cream hover:border-gold hover:bg-cream/10 rounded-lg text-gold transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate font-medium">
                    No matching audit log records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: AUDIT DETAIL DRAWER ──────────────────────────────── */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-border-cream pb-3">
              <div>
                <h4 className="font-display font-bold text-navy text-lg">Audit Log Record</h4>
                <p className="text-[10px] text-slate font-mono mt-0.5">ID: {selectedLog.id}</p>
              </div>
              <button onClick={() => setSelectedLog(null)}>
                <X className="w-5 h-5 text-slate" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-charcoal">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate uppercase block">Action Type</span>
                  <span className="font-mono text-navy font-bold text-[11px]">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate uppercase block">Severity Level</span>
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${getSeverityBadge(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate uppercase block">Initiator User</span>
                  <span className="text-navy">{selectedLog.actor}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate uppercase block">Execution Time</span>
                  <span className="text-slate font-mono">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate uppercase block">Affected Entity</span>
                <span className="text-charcoal font-mono bg-cream px-2 py-1.5 border border-border-cream/50 rounded-xl block">
                  {selectedLog.entity}
                </span>
              </div>

              {/* Diffs Visualizer */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] text-slate uppercase tracking-wider block border-b border-border-cream/50 pb-1">State Modifications Diff</span>
                
                <div className="space-y-2">
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                    <span className="text-[9px] text-danger font-bold uppercase tracking-wider block">[-] Previous State</span>
                    <pre className="font-mono text-[10px] text-slate mt-1 overflow-x-auto whitespace-pre-wrap">
                      {selectedLog.previousValue}
                    </pre>
                  </div>

                  <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl">
                    <span className="text-[9px] text-success font-bold uppercase tracking-wider block">[+] New State</span>
                    <pre className="font-mono text-[10px] text-navy font-bold mt-1 overflow-x-auto whitespace-pre-wrap">
                      {selectedLog.newValue}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex pt-3 border-t border-border-cream">
              <button 
                type="button" 
                onClick={() => setSelectedLog(null)}
                className="w-full btn-secondary py-2.5 text-xs font-bold"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminLogs;
