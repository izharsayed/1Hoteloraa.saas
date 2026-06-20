import React from 'react';
import { Users, Award, Star, Mail, Phone, CalendarRange } from 'lucide-react';

function CRM() {
  const guests = [
    { id: 'GST-901', name: 'Vikram Sethi', email: 'vikram.sethi@gmail.com', phone: '+91 98765 43210', visits: 12, loyaltyPoints: 2450, tier: 'Platinum' },
    { id: 'GST-342', name: 'Samantha Miller', email: 'samantha.m@yahoo.com', phone: '+1 415 555 2671', visits: 4, loyaltyPoints: 850, tier: 'Gold' },
    { id: 'GST-108', name: 'Rajesh Malhotra', email: 'rajesh.mal@hotmail.com', phone: '+91 99001 12233', visits: 22, loyaltyPoints: 5120, tier: 'Diamond' },
    { id: 'GST-554', name: 'Kavita Rao', email: 'kavita.rao@live.in', phone: '+91 88877 66554', visits: 2, loyaltyPoints: 150, tier: 'Silver' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">CRM & Guest Management</h1>
          <p className="text-slate text-sm font-medium mt-1">Manage guest database, review histories, and check loyalty tiers</p>
        </div>
      </div>

      {/* Tiers overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { name: 'Diamond Member', count: 18, color: 'text-navy', border: 'border-navy bg-gold-pale/40' },
          { name: 'Platinum Member', count: 42, color: 'text-gold', border: 'border-gold bg-gold-pale/20' },
          { name: 'Gold Member', count: 96, color: 'text-gold-light', border: 'border-gold-light bg-gold-pale/10' },
          { name: 'Silver Member', count: 158, color: 'text-slate', border: 'border-border-cream bg-white' }
        ].map((tier, index) => (
          <div key={index} className={`soft-card p-4 border flex flex-col justify-between h-28 ${tier.border}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate">{tier.name}</span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-2xl font-bold text-navy">{tier.count}</span>
              <Award className={`w-6 h-6 ${tier.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Guest Directory */}
      <div className="soft-card p-6">
        <h3 className="font-display font-semibold text-lg text-navy mb-6">VIP Guest Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream text-[10px] font-bold text-slate uppercase tracking-wider">
                <th className="pb-3">Guest ID</th>
                <th className="pb-3">Profile Info</th>
                <th className="pb-3">Contact info</th>
                <th className="pb-3 text-center">Stays / Visits</th>
                <th className="pb-3 text-right">Loyalty Points</th>
                <th className="pb-3 text-center">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs">
              {guests.map((g) => (
                <tr key={g.id} className="hover:bg-gold-pale/10">
                  <td className="py-4 font-mono font-semibold text-navy">{g.id}</td>
                  <td className="py-4">
                    <span className="font-semibold text-charcoal block">{g.name}</span>
                  </td>
                  <td className="py-4 space-y-0.5">
                    <span className="text-slate flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {g.email}</span>
                    <span className="text-slate flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {g.phone}</span>
                  </td>
                  <td className="py-4 text-center font-mono font-semibold">{g.visits} visits</td>
                  <td className="py-4 font-mono font-bold text-navy text-right">{g.loyaltyPoints.toLocaleString()} pts</td>
                  <td className="py-4 text-center">
                    <span className={`
                      px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 w-24 mx-auto
                      ${g.tier === 'Diamond' && 'bg-navy text-gold border border-gold/40'}
                      ${g.tier === 'Platinum' && 'bg-gold text-navy'}
                      ${g.tier === 'Gold' && 'bg-gold-pale text-gold border border-gold/30'}
                      ${g.tier === 'Silver' && 'bg-surface-linen text-slate'}
                    `}>
                      <Star className="w-2.5 h-2.5 fill-current" /> {g.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CRM;
