import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  Activity, 
  Cpu, 
  TrendingUp, 
  Users, 
  ShieldCheck 
} from 'lucide-react';
import api from '../utils/api.js';

function SuperAdminOverview() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.get('/superadmin/overview');
        setMetrics(data);
      } catch (err) {
        setError(err.message || 'Failed to load cluster metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-navy font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-gold" /> Loading Cluster metrics...
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-navy">Cluster Overview</h1>
        <p className="text-slate text-sm font-medium mt-1">Platform analytics, subscription revenues, and system resource load status</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Customers */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Active Customers</p>
            <h3 className="font-display font-bold text-2xl text-navy">{metrics.activeSubscribers}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {metrics.trialCustomers} Trials active
            </span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Monthly Revenue (MRR)</p>
            <h3 className="font-display font-bold text-2xl text-navy">{metrics.mrr}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> ARR: {metrics.arr}
            </span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Churn Rate */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Platform Churn Rate</p>
            <h3 className="font-display font-bold text-2xl text-navy">{metrics.churnRate}</h3>
            <span className="text-[10px] text-slate font-medium">Industry standard range</span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* ARPU */}
        <div className="soft-card p-6 bg-white flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate uppercase tracking-wider">Avg Rev Per Tenant</p>
            <h3 className="font-display font-bold text-2xl text-navy">{metrics.averageRevenuePerTenant}</h3>
            <span className="text-[10px] text-slate font-medium">Monthly averages</span>
          </div>
          <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center border border-border-cream/50 text-gold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Cluster Resources */}
      <div className="soft-card bg-white p-6 space-y-6">
        <h3 className="font-display font-semibold text-lg text-navy border-b border-border-cream pb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-gold" /> System Cluster Resources Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate">CPU Core Load:</span>
              <span className="text-navy">{metrics.systemStats.cpuLoad}% / 100%</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2">
              <div className="bg-gold h-2 rounded-full" style={{ width: `${metrics.systemStats.cpuLoad}%` }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate">RAM Memory:</span>
              <span className="text-navy">{metrics.systemStats.ramUsage} GB / 8.0 GB ({(metrics.systemStats.ramUsage / 8 * 100).toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2">
              <div className="bg-gold h-2 rounded-full" style={{ width: `${(metrics.systemStats.ramUsage / 8 * 100)}%` }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate">DB Pool Cache:</span>
              <span className="text-navy">{metrics.systemStats.dbCacheHit}% Hit Ratio</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2">
              <div className="bg-gold h-2 rounded-full" style={{ width: `${metrics.systemStats.dbCacheHit}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="soft-card bg-white p-6 space-y-4">
        <h3 className="font-display font-semibold text-lg text-navy border-b border-border-cream pb-3">
          SaaS Subscriptions Ledger
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
          <div className="p-4 bg-cream/20 border border-border-cream/50 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate uppercase block">Monthly Recurring Revenue</span>
            <span className="text-base text-navy font-bold">{metrics.mrr}</span>
          </div>
          <div className="p-4 bg-cream/20 border border-border-cream/50 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate uppercase block">Annual Recurring Revenue</span>
            <span className="text-base text-navy font-bold">{metrics.arr}</span>
          </div>
          <div className="p-4 bg-cream/20 border border-border-cream/50 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate uppercase block">Pending Renewals (This week)</span>
            <span className="text-base text-warning font-bold">{metrics.pendingRenewals} tenants</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminOverview;
