import React from 'react';
import { 
  Building, 
  DollarSign, 
  Bed, 
  Utensils, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

function Dashboard() {
  const userJson = localStorage.getItem('user');
  let user = { businessType: 'HOTEL_RESTAURANT' };
  try {
    if (userJson) user = JSON.parse(userJson);
  } catch (e) {}

  const businessType = user.businessType || 'HOTEL_RESTAURANT';

  const allMetrics = [
    {
      title: 'Total Lodging Occupancy',
      value: '78%',
      subtitle: '39 of 50 Rooms Booked',
      icon: Bed,
      color: 'text-navy',
      bgColor: 'bg-gold-pale/50',
      type: 'LODGING'
    },
    {
      title: "Today's POS Sales",
      value: '₹48,250',
      subtitle: '124 orders completed',
      icon: Utensils,
      color: 'text-gold',
      bgColor: 'bg-gold-pale/30',
      type: 'RESTAURANT'
    },
    {
      title: 'Available Rooms',
      value: '12',
      subtitle: 'Ready for check-in',
      icon: Building,
      color: 'text-success',
      bgColor: 'bg-success-pale',
      type: 'LODGING'
    },
    {
      title: 'Gross Revenue (Today)',
      value: businessType === 'RESTAURANT' ? '₹48,250' : businessType === 'LODGING' ? '₹1,00,400' : '₹1,48,650',
      subtitle: businessType === 'RESTAURANT' ? 'POS + Takeaways' : businessType === 'LODGING' ? 'Lodging + Service' : 'Lodging + POS + Service',
      icon: DollarSign,
      color: 'text-navy',
      bgColor: 'bg-gold-pale/80',
      type: 'BOTH'
    }
  ];

  const metrics = allMetrics.filter(m => {
    if (m.type === 'LODGING' && businessType === 'RESTAURANT') return false;
    if (m.type === 'RESTAURANT' && businessType === 'LODGING') return false;
    return true;
  });

  const recentActivity = [
    { id: 1, type: 'checkin', text: 'Guest check-in: Room 204 (Royal Suite)', time: '10:15 AM', status: 'completed', showFor: ['LODGING', 'HOTEL_RESTAURANT'] },
    { id: 2, type: 'kot', text: 'KOT #124 sent to Kitchen: Table 15', time: '10:30 AM', status: 'preparing', showFor: ['RESTAURANT', 'HOTEL_RESTAURANT'] },
    { id: 3, type: 'billing', text: 'Invoice INV-2026-042 generated: Room 102', time: '10:45 AM', status: 'paid', showFor: ['LODGING', 'HOTEL_RESTAURANT'] },
    { id: 4, type: 'checkout', text: 'Guest check-out: Room 301', time: '11:00 AM', status: 'completed', showFor: ['LODGING', 'HOTEL_RESTAURANT'] },
    { id: 5, type: 'housekeeping', text: 'Housekeeping alert: Room 208 marked DIRTY', time: '11:15 AM', status: 'alert', showFor: ['LODGING', 'HOTEL_RESTAURANT'] }
  ].filter(act => act.showFor.includes(businessType));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">
            Hoteloraa Operations Dashboard
          </h1>
          <p className="text-slate text-sm font-medium mt-1">
            Real-time status overview of Hotel & Restaurant modules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm px-3 py-1.5 bg-white border border-border-cream rounded-xl text-slate shadow-sm">
            Fiscal: 2026-06-19
          </span>
          {businessType !== 'RESTAURANT' && (
            <button className="btn-primary">
              Quick Check-In <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="soft-card p-6 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate text-xs font-semibold uppercase tracking-wider">{metric.title}</span>
                  <h3 className="font-mono font-bold text-2xl text-navy mt-2 tracking-tight">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${metric.bgColor} ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-xs text-slate border-t border-border-cream/50 pt-3 mt-3 font-medium flex items-center justify-between">
                <span>{metric.subtitle}</span>
                <TrendingUp className="w-3.5 h-3.5 text-success" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Operational Activity Log */}
        <div className="soft-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-navy">Live Operations Feed</h2>
              <span className="text-xs text-gold font-semibold flex items-center cursor-pointer hover:underline">
                View All Audit Logs <ChevronRight className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-cream/40 rounded-xl transition-colors">
                  <div className="p-2 rounded-lg bg-cream/70 text-slate mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-charcoal truncate">{activity.text}</p>
                    <p className="text-[10px] text-slate font-medium mt-0.5">{activity.time}</p>
                  </div>
                  <div>
                    <span className={`
                      text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                      ${activity.status === 'completed' && 'bg-success-pale text-success border border-success/20'}
                      ${activity.status === 'preparing' && 'bg-warning-pale text-warning border border-warning/20'}
                      ${activity.status === 'paid' && 'bg-success-pale text-success border border-success/20'}
                      ${activity.status === 'alert' && 'bg-danger-pale text-danger border border-danger/20'}
                    `}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand/Revenue Split Card */}
        <div className="soft-card p-6 flex flex-col justify-between bg-navy text-white hover:border-gold">
          {businessType === 'RESTAURANT' ? (
            <div>
              <div className="mb-4">
                <span className="text-[10px] bg-gold/20 text-gold font-mono font-bold uppercase tracking-wider px-2.5 py-1 border border-gold/30 rounded-lg">
                  Revenue Highlights
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-gold-pale mt-4">Restaurant Sales</h3>
              <p className="text-slate text-xs mt-1">Daily consolidated segment audit</p>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs text-slate font-medium">Dine-In Sales</span>
                  <span className="font-mono text-sm text-white">₹38,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate font-medium">Takeaways & Delivery</span>
                  <span className="font-mono text-sm text-white">₹10,050</span>
                </div>
              </div>
            </div>
          ) : businessType === 'LODGING' ? (
            <div>
              <div className="mb-4">
                <span className="text-[10px] bg-gold/20 text-gold font-mono font-bold uppercase tracking-wider px-2.5 py-1 border border-gold/30 rounded-lg">
                  Revenue Highlights
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-gold-pale mt-4">Lodging Sales</h3>
              <p className="text-slate text-xs mt-1">Daily consolidated segment audit</p>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs text-slate font-medium">Room Bookings</span>
                  <span className="font-mono text-sm text-white">₹85,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate font-medium">Room Service & Laundry</span>
                  <span className="font-mono text-sm text-white">₹15,400</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <span className="text-[10px] bg-gold/20 text-gold font-mono font-bold uppercase tracking-wider px-2.5 py-1 border border-gold/30 rounded-lg">
                  Revenue Highlights
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-gold-pale mt-4">Room & Table Sales</h3>
              <p className="text-slate text-xs mt-1">Daily consolidated consolidated audit</p>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs text-slate font-medium">Room Bookings</span>
                  <span className="font-mono text-sm text-white">₹85,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs text-slate font-medium">Restaurant Dining</span>
                  <span className="font-mono text-sm text-white">₹38,200</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs text-slate font-medium">Takeaways & Delivery</span>
                  <span className="font-mono text-sm text-white">₹10,050</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate font-medium">Room Service & Laundry</span>
                  <span className="font-mono text-sm text-white">₹15,400</span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs text-gold font-semibold uppercase tracking-wider">Net Sales</span>
            <span className="font-mono text-xl text-gold font-bold">
              {businessType === 'RESTAURANT' ? '₹48,250' : businessType === 'LODGING' ? '₹1,00,400' : '₹1,48,650'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
