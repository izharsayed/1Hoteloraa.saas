import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Truck, Plus, Search, X } from 'lucide-react';
import api from '../utils/api';

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Search & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemMinQty, setNewItemMinQty] = useState('');
  const [newItemVendor, setNewItemVendor] = useState('Heritage Foods Ltd.');

  useEffect(() => {
    let isMounted = true;
    fetchItems(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchItems = async (isMounted = true) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.get('/inventory');
      if (!isMounted) return;

      if (data && data.length > 0) {
        setItems(data);
      } else {
        // Automatically seed the 5 default items to the database if empty
        const defaultItems = [
          { name: 'Basmati Rice (Premium)', quantity: 120, unit: 'KG', minimumStock: 40, sku: 'STK-084', description: 'Preferred Vendor: Heritage Foods Ltd.' },
          { name: 'Luxury Cotton Sheets (King)', quantity: 14, unit: 'PIECE', minimumStock: 25, sku: 'STK-112', description: 'Preferred Vendor: Spun Textiles Inc.' },
          { name: 'Espresso Coffee Beans', quantity: 45, unit: 'KG', minimumStock: 10, sku: 'STK-042', description: 'Preferred Vendor: Aroma Roasters' },
          { name: 'Mini Bar Gin Bottle (50ml)', quantity: 8, unit: 'PIECE', minimumStock: 30, sku: 'STK-150', description: 'Preferred Vendor: Global Spirits Corp.' },
          { name: 'Premium Toiletries Kit', quantity: 200, unit: 'PIECE', minimumStock: 100, sku: 'STK-221', description: 'Preferred Vendor: Veda Care Products' }
        ];
        
        for (const item of defaultItems) {
          try {
            await api.post('/inventory', item);
          } catch (e) {
            console.warn('Seed item exists or failed:', item.name, e.message);
          }
        }
        
        const refreshedData = await api.get('/inventory');
        if (isMounted) {
          setItems(refreshedData || []);
        }
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message || 'Failed to fetch inventory items');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemQty || !newItemMinQty) return;

    const qtyVal = parseFloat(newItemQty) || 0;
    const minQtyVal = parseFloat(newItemMinQty) || 0;

    const randomIdNumber = Math.floor(100 + Math.random() * 900);
    const newSku = `STK-${randomIdNumber}`;

    // Map frontend units to uppercase backend InventoryUnit enum values
    const unitMapping = {
      kg: 'KG',
      units: 'PIECE',
      liters: 'LITRE',
      packs: 'PACKET'
    };
    const mappedUnit = unitMapping[newItemUnit] || 'PIECE';

    const body = {
      name: newItemName,
      sku: newSku,
      quantity: qtyVal,
      unit: mappedUnit,
      minimumStock: minQtyVal,
      costPrice: 0,
      description: `Preferred Vendor: ${newItemVendor}`
    };

    try {
      setSaving(true);
      setError('');
      const createdItem = await api.post('/inventory', body);
      setItems([createdItem, ...items]);

      // Reset Form
      setNewItemName('');
      setNewItemQty('');
      setNewItemUnit('kg');
      setNewItemMinQty('');
      setNewItemVendor('Heritage Foods Ltd.');
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to add inventory item');
    } finally {
      setSaving(false);
    }
  };

  const getVendorFromDescription = (desc) => {
    if (!desc) return 'N/A';
    const match = desc.match(/Preferred Vendor:\s*(.*)/);
    return match ? match[1] : 'N/A';
  };

  const formatUnit = (unit) => {
    if (!unit) return '';
    const mapping = {
      KG: 'kg',
      PIECE: 'units',
      LITRE: 'liters',
      PACKET: 'packs',
      GRAM: 'g',
      ML: 'ml',
      BOX: 'boxes',
      DOZEN: 'dozens',
      BOTTLE: 'bottles'
    };
    return mapping[unit] || unit.toLowerCase();
  };

  // Calculations
  const filteredItems = items.filter(item => {
    const idVal = (item.sku || item.id || '').toLowerCase();
    const nameVal = (item.name || '').toLowerCase();
    const vendorVal = getVendorFromDescription(item.description).toLowerCase();
    const q = searchQuery.toLowerCase();
    return idVal.includes(q) || nameVal.includes(q) || vendorVal.includes(q);
  });

  const totalCatalogedCount = 379 + items.length;
  const lowStockCount = 16 + items.filter(item => item.quantity <= item.minimumStock).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Inventory & Purchase Management</h1>
          <p className="text-slate text-sm font-medium mt-1">Monitor stock quantities, reorder points, and manage vendor purchases</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Inventory Item
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-danger-pale border border-danger/20 rounded-xl text-danger text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="soft-card p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gold-pale text-navy">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Total Items cataloged</span>
            <span className="font-mono font-bold text-xl text-navy">{totalCatalogedCount} items</span>
          </div>
        </div>
        <div className="soft-card p-6 flex items-center gap-4 border-danger-pale">
          <div className="p-3.5 rounded-xl bg-danger-pale text-danger">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Low Stock Alerts</span>
            <span className="font-mono font-bold text-xl text-danger">{lowStockCount} items need reorder</span>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate">
                    Loading inventory items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate">
                    No matching items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minimumStock;
                  const displayId = item.sku || item.id;
                  const displayVendor = getVendorFromDescription(item.description);
                  const displayUnit = formatUnit(item.unit);
                  return (
                    <tr key={item.id} className="hover:bg-gold-pale/10">
                      <td className="py-4 font-mono font-bold text-navy">{displayId}</td>
                      <td className="py-4 text-charcoal">{item.name}</td>
                      <td className="py-4 text-center font-mono font-bold text-charcoal">{item.quantity} {displayUnit}</td>
                      <td className="py-4 text-center font-mono text-slate">{item.minimumStock} {displayUnit}</td>
                      <td className="py-4 text-slate">{displayVendor}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          !isLow 
                            ? 'bg-success/10 text-success border border-success/20' 
                            : 'bg-danger-pale text-danger border border-danger/20'
                        }`}>
                          {isLow ? 'Low Stock' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate hover:text-navy transition-colors"
              aria-label="Close modal"
              disabled={saving}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Add New Inventory Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Item Description / Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Extra Virgin Olive Oil"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="100"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-mono font-bold"
                    disabled={saving}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Unit</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                    disabled={saving}
                  >
                    <option value="kg">kg</option>
                    <option value="units">units</option>
                    <option value="liters">liters</option>
                    <option value="packs">packs</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Safety Threshold (Min Qty)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  placeholder="25"
                  value={newItemMinQty}
                  onChange={(e) => setNewItemMinQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-mono font-bold"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Preferred Vendor</label>
                <select
                  value={newItemVendor}
                  onChange={(e) => setNewItemVendor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  disabled={saving}
                >
                  <option value="Heritage Foods Ltd.">Heritage Foods Ltd.</option>
                  <option value="Spun Textiles Inc.">Spun Textiles Inc.</option>
                  <option value="Aroma Roasters">Aroma Roasters</option>
                  <option value="Global Spirits Corp.">Global Spirits Corp.</option>
                  <option value="Veda Care Products">Veda Care Products</option>
                  <option value="General Supplies Co.">General Supplies Co.</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="w-1/2 px-4 py-2.5 border border-border-cream text-charcoal hover:bg-stone-50 rounded-xl text-xs font-bold"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 px-4 py-2.5 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
