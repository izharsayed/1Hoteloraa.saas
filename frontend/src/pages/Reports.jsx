import React from 'react';
import { TrendingUp, BarChart3, PieChart, Milestone, Calendar, ArrowUpRight } from 'lucide-react';

function Reports() {
  const kpis = [
    { name: 'Average Daily Rate (ADR)', value: '₹4,850', change: '+3.4%', desc: 'Average rent paid per occupied room' },
    { name: 'RevPAR', value: '₹3,780', change: '+4.2%', desc: 'Revenue per available room' },
    { name: 'POS Dining Covers', value: '184', change: '+12.4%', desc: 'Number of restaurant customers served' },
    { name: 'Room Service Revenue', value: '₹15,400', change: '+8.1%', desc: 'In-room food & beverage orders' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Managerial Reports & Analytics</h1>
          <p className="text-slate text-sm font-medium mt-1">Review lodging KPIs, restaurant occupancy ratios, and net revenue distributions</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="soft-card p-6 bg-white flex flex-col justify-between h-40">
            <div>
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider block">{kpi.name}</span>
              <h3 className="font-mono font-bold text-2xl text-navy mt-2">{kpi.value}</h3>
            </div>
            <div className="border-t border-border-cream/50 pt-3 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate text-[10px] leading-relaxed">{kpi.desc}</span>
              <span className="text-success font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" />{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / Splits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lodging Occupancy Timeline Chart */}
        <div className="soft-card p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold text-navy text-base">Weekly Occupancy Timeline</h3>
            <span className="text-slate text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> June 13 - June 19</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-border-cream">
            {[62, 68, 70, 75, 78, 82, 78].map((rate, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-gold text-[9px] font-mono font-bold px-1.5 py-0.5 rounded absolute -translate-y-8">
                  {rate}%
                </span>
                <div 
                  className="w-full bg-gold/20 hover:bg-gold rounded-t-lg transition-all duration-300"
                  style={{ height: `${rate}%` }}
                ></div>
                <span className="text-[10px] text-slate font-bold font-mono pb-2">Day {idx+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution Splitting Chart */}
        <div className="soft-card p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-navy text-base mb-6">Revenue Split by Module</h3>
            
            {/* Split Progress bars */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-charcoal">
                  <span>Room Bookings (57%)</span>
                  <span className="font-mono">₹85,000</span>
                </div>
                <div className="w-full h-2.5 bg-cream/50 rounded-full overflow-hidden border border-border-cream/35">
                  <div className="h-full bg-navy" style={{ width: '57%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-charcoal">
                  <span>Restaurant Dining (26%)</span>
                  <span className="font-mono">₹38,200</span>
                </div>
                <div className="w-full h-2.5 bg-cream/50 rounded-full overflow-hidden border border-border-cream/35">
                  <div className="h-full bg-gold" style={{ width: '26%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-charcoal">
                  <span>Room Service (10%)</span>
                  <span className="font-mono">₹15,400</span>
                </div>
                <div className="w-full h-2.5 bg-cream/50 rounded-full overflow-hidden border border-border-cream/35">
                  <div className="h-full bg-gold-light" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-charcoal">
                  <span>Laundry & Mini Bar (7%)</span>
                  <span className="font-mono">₹10,050</span>
                </div>
                <div className="w-full h-2.5 bg-cream/50 rounded-full overflow-hidden border border-border-cream/35">
                  <div className="h-full bg-slate" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reports;
