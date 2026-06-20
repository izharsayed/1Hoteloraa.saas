import React from 'react';
import { Package, AlertTriangle, Users2, Truck, Plus, Search } from 'lucide-react';

function Inventory() {
  const stockItems = [
    { id: 'STK-084', name: 'Basmati Rice (Premium)', qty: '120 kg', minQty: '40 kg', vendor: 'Heritage Foods Ltd.', status: 'Good' },
    { id: 'STK-112', name: 'Luxury Cotton Sheets (King)', qty: '14 units', minQty: '25 units', vendor: 'Spun Textiles Inc.', status: 'Low Stock' },
    { id: 'STK-042', name: 'Espresso Coffee Beans', qty: '45 kg', minQty: '10 kg', vendor: 'Aroma Roasters', status: 'Good' },
    { id: 'STK-150', name: 'Mini Bar Gin Bottle (50ml)', qty: '8 units', minQty: '30 units', vendor: 'Global Spirits Corp.', status: 'Low Stock' },
    { id: 'STK-221', name: 'Premium Toiletries Kit', qty: '200 units', minQty: '100 units', vendor: 'Veda Care Products', status: 'Good' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Inventory & Purchase Management</h1>
          <p className="text-slate text-sm font-medium mt-1">Monitor stock quantities, reorder points, and manage vendor purchases</p>
        </div>
        <button className="btn-primary self-start md:self-auto">
          <Plus className="w-4 h-4" /> Add Inventory Item
        </button>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="soft-card p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gold-pale text-navy">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Total Items cataloged</span>
            <span className="font-mono font-bold text-xl text-navy">384 items</span>
          </div>
        </div>
        <div className="soft-card p-6 flex items-center gap-4 border-danger-pale">
          <div className="p-3.5 rounded-xl bg-danger-pale text-danger">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Low Stock Alerts</span>
            <span className="font-mono font-bold text-xl text-danger">18 items need reorder</span>
          </div>
        </div>
        <div className="soft-card p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gold-pale/50 text-gold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Active Vendors</span>
            <span className="font-mono font-bold text-xl text-navy">24 active contracts</span>
          </div>
        </div>
      </div>

      {/* Inventory Search & Table */}
      <div className="soft-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-display font-semibold text-lg text-navy">Master Stock Index</h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Filter by name/ID..." 
              className="pl-9 pr-4 py-2 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs bg-cream/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream text-[10px] font-bold text-slate uppercase tracking-wider">
                <th className="pb-3">Item ID</th>
                <th className="pb-3">Stock Description</th>
                <th className="pb-3 text-center">Current Quantity</th>
                <th className="pb-3 text-center">Safety Threshold</th>
                <th className="pb-3">Vendor</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs">
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gold-pale/10">
                  <td className="py-4 font-mono font-semibold text-navy">{item.id}</td>
                  <td className="py-4 font-semibold text-charcoal">{item.name}</td>
                  <td className="py-4 text-center font-mono font-semibold">{item.qty}</td>
                  <td className="py-4 text-center font-mono text-slate">{item.minQty}</td>
                  <td className="py-4 text-slate">{item.vendor}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      item.status === 'Good' 
                        ? 'bg-success-pale text-success border border-success/20' 
                        : 'bg-danger-pale text-danger border border-danger/20'
                    }`}>
                      {item.status}
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

export default Inventory;
