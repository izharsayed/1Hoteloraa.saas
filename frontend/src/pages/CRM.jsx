import React, { useState, useEffect } from 'react';
import { Users, Award, Star, Mail, Phone, RefreshCw } from 'lucide-react';
import api from '../utils/api';

function CRM() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/guests');
      setGuests(data || []);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to fetch guest registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const getGuestTier = (stays) => {
    if (stays >= 15) return 'Diamond';
    if (stays >= 8) return 'Platinum';
    if (stays >= 3) return 'Gold';
    return 'Silver';
  };

  const getGuestTierStyle = (tier) => {
    switch (tier) {
      case 'Diamond': return 'bg-navy text-gold border border-gold/40';
      case 'Platinum': return 'bg-gold text-navy';
      case 'Gold': return 'bg-gold-pale text-gold border border-gold/30';
      default: return 'bg-surface-linen text-slate';
    }
  };

  const getGuestPoints = (spent) => {
    return Math.round((spent || 0) * 0.1); // 10% of total spent
  };

  const diamondCount = guests.filter(g => getGuestTier(g.totalStays) === 'Diamond').length;
  const platinumCount = guests.filter(g => getGuestTier(g.totalStays) === 'Platinum').length;
  const goldCount = guests.filter(g => getGuestTier(g.totalStays) === 'Gold').length;
  const silverCount = guests.filter(g => getGuestTier(g.totalStays) === 'Silver').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">CRM & Guest Management</h1>
          <p className="text-slate text-sm font-medium mt-1">Manage guest database, review histories, and check loyalty tiers</p>
        </div>
        <button 
          onClick={fetchGuests}
          className="flex items-center gap-2 text-xs font-bold text-navy bg-white border border-border-cream px-4 py-2 rounded-xl hover:bg-cream/10 active:scale-95 transition-all shadow-sm self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Tiers overview */}
      {loading ? (
        <div className="flex items-center justify-center py-6 gap-2 text-slate text-sm font-semibold">
          <RefreshCw className="w-4 h-4 animate-spin text-gold" />
          Updating loyalty metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { name: 'Diamond Member', count: diamondCount, color: 'text-navy', border: 'border-navy bg-gold-pale/40' },
            { name: 'Platinum Member', count: platinumCount, color: 'text-gold', border: 'border-gold bg-gold-pale/20' },
            { name: 'Gold Member', count: goldCount, color: 'text-gold-light', border: 'border-gold-light bg-gold-pale/10' },
            { name: 'Silver Member', count: silverCount, color: 'text-slate', border: 'border-border-cream bg-white' }
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
      )}

      {/* Guest Directory */}
      <div className="soft-card p-6">
        <h3 className="font-display font-semibold text-lg text-navy mb-6">VIP Guest Directory</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-slate text-sm font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin text-gold" />
            Loading guest directory...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-rose-600 text-sm font-medium">
            {error}
          </div>
        ) : (
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
                {guests.map((g) => {
                  const tier = getGuestTier(g.totalStays);
                  return (
                    <tr key={g.id} className="hover:bg-gold-pale/10">
                      <td className="py-4 font-mono font-semibold text-navy">{g.id.slice(0, 8)}...</td>
                      <td className="py-4">
                        <span className="font-semibold text-charcoal block">{g.name}</span>
                        {g.city && <span className="text-[10px] text-slate">{g.city}, {g.country || 'India'}</span>}
                      </td>
                      <td className="py-4 space-y-0.5">
                        {g.email && <span className="text-slate flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {g.email}</span>}
                        {g.phone && <span className="text-slate flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {g.phone}</span>}
                      </td>
                      <td className="py-4 text-center font-mono font-semibold">{g.totalStays} stay(s)</td>
                      <td className="py-4 font-mono font-bold text-navy text-right">{getGuestPoints(g.totalSpent).toLocaleString()} pts</td>
                      <td className="py-4 text-center">
                        <span className={`
                          px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 w-24 mx-auto
                          ${getGuestTierStyle(tier)}
                        `}>
                          <Star className="w-2.5 h-2.5 fill-current" /> {tier}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate font-semibold">
                      No guests cataloged in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CRM;
