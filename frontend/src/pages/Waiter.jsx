import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Utensils, 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Send, 
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import api from '../utils/api.js';

function Waiter() {
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Selection/Search states
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [itemNotes, setItemNotes] = useState({});

  // Loading/Feedback states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPOSData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/pos/data');
      if (data) {
        setTables(data.tables || []);
        setCategories(data.menuCategories || []);
        setMenuItems(data.menuItems || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load POS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPOSData();
  }, []);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setCart([]);
    setItemNotes({});
    setSuccess('');
    setError('');
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === item.id);
      if (existing) {
        return prevCart.map((ci) => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === item.id);
      if (existing && existing.quantity > 1) {
        return prevCart.map((ci) => ci.id === item.id ? { ...ci, quantity: ci.quantity - 1 } : ci);
      }
      return prevCart.filter((ci) => ci.id !== item.id);
    });
  };

  const handleNoteChange = (itemId, note) => {
    setItemNotes((prevNotes) => ({
      ...prevNotes,
      [itemId]: note
    }));
  };

  // Calculations
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST default
  const total = subtotal + tax;

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const orderPayload = {
        tableId: selectedTable.id,
        items: cart.map((ci) => ({
          menuItemId: ci.id,
          quantity: ci.quantity,
          notes: itemNotes[ci.id] || ''
        }))
      };

      await api.post('/pos/quick-order', orderPayload);
      setSuccess(`KOT placed successfully for Table: ${selectedTable.name}!`);
      setCart([]);
      setItemNotes({});
      setSelectedTable(null);
      loadPOSData();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  // Filters
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategoryId === 'All' || item.menuCategoryId === selectedCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col min-h-0 space-y-4">
      {error && <div className="p-3 bg-danger-pale border border-danger/10 text-danger rounded-xl text-xs font-bold shrink-0">{error}</div>}
      {success && <div className="p-3 bg-success-pale border border-success/10 text-success rounded-xl text-xs font-bold shrink-0">{success}</div>}

      {loading ? (
        <div className="text-center py-20 text-slate font-semibold text-xs animate-pulse">Loading POS console...</div>
      ) : !selectedTable ? (
        // View 1: Table selection layout
        <div className="flex-1 space-y-4 min-h-0 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shrink-0">
            <div>
              <h2 className="font-display font-bold text-xl text-navy">Select Active Table</h2>
              <p className="text-slate text-xs font-medium mt-0.5">Click a table to open menu and record customer orders</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-charcoal bg-white/50 border border-border-cream px-3 py-1.5 rounded-xl">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success"></span> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger"></span> Occupied</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning"></span> Booked</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto soft-card p-6 bg-[#FEF9F1] bg-[radial-gradient(#EBE5DA_1.5px,transparent_1.5px)] bg-[size:24px_24px] rounded-2xl min-h-[300px]">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center mt-4">
              {tables.map((table) => {
                const colorClass = 
                  table.status === 'OCCUPIED' ? 'bg-danger/10 border-danger text-danger' : 
                  table.status === 'RESERVED' ? 'bg-warning/10 border-warning text-warning' : 
                  'bg-success/10 border-success text-success';
                
                return (
                  <div 
                    key={table.id}
                    onClick={() => handleTableSelect(table)}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div className={`
                      w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-mono shadow-sm transition-all duration-300
                      ${colorClass} hover:scale-105 hover:shadow-md
                    `}>
                      <span className="font-bold text-sm">{table.name}</span>
                      <span className="text-[9px] opacity-75 font-semibold mt-1">{table.capacity} Pax</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // View 2: POS Menu Ordering Panel
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Left panel: categories and items grid */}
          <div className="flex-1 flex flex-col bg-white border border-border-cream rounded-2xl p-4 min-h-0">
            {/* Top drawer header */}
            <div className="flex justify-between items-center border-b border-border-cream pb-3 shrink-0">
              <div>
                <h3 className="font-display font-semibold text-navy text-sm">Table Order: {selectedTable.name}</h3>
                <p className="text-[10px] text-slate font-semibold uppercase tracking-wider">{selectedTable.capacity} Seats capacity</p>
              </div>
              <button 
                onClick={() => setSelectedTable(null)}
                className="p-1 text-slate hover:text-navy hover:bg-cream/40 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Category navigation bar */}
            <div className="py-3 flex flex-col md:flex-row gap-3 shrink-0">
              {/* Search bar */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate/50">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-border-cream rounded-xl text-xs focus:outline-none focus:border-gold placeholder-slate/50"
                  placeholder="Search dishes..."
                />
              </div>

              {/* Category selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedCategoryId('All')}
                  className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                    selectedCategoryId === 'All' 
                      ? 'bg-navy text-gold shadow-sm' 
                      : 'bg-cream/40 text-slate hover:text-navy border border-border-cream/50'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
                      selectedCategoryId === cat.id 
                        ? 'bg-navy text-gold shadow-sm' 
                        : 'bg-cream/40 text-slate hover:text-navy border border-border-cream/50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid scrollable */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredMenuItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleAddToCart(item)}
                    className="p-3 border border-border-cream/70 rounded-xl hover:border-gold hover:bg-gold-pale/10 cursor-pointer flex flex-col justify-between h-28 group transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-semibold text-xs text-charcoal group-hover:text-navy truncate">{item.name}</h4>
                        <span className={`w-2.5 h-2.5 rounded-full border border-white shrink-0 mt-0.5 ${item.isVeg ? 'bg-success' : 'bg-danger'}`} />
                      </div>
                      <p className="text-[10px] text-slate line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-border-cream/40 pt-2 mt-2">
                      <span className="font-mono text-xs font-bold text-navy">₹{item.price}</span>
                      <span className="w-5 h-5 rounded-lg bg-gold-pale border border-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Cart Checkout details */}
          <div className="w-full lg:w-80 bg-white border border-border-cream rounded-2xl p-4 flex flex-col justify-between shrink-0 min-h-0">
            <div className="flex flex-col min-h-0 flex-1">
              <div className="flex items-center gap-2 border-b border-border-cream pb-3 shrink-0 text-navy font-display font-semibold text-sm">
                <ShoppingBag className="w-4 h-4 text-gold" /> Check Order Cart
              </div>

              {/* Cart List */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate text-xs font-semibold py-20 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate/30 mb-2" />
                  Your cart is empty.
                  <span className="text-[10px] text-slate/50 block font-normal mt-1">Tap items on the left to add.</span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-0">
                  {cart.map((ci) => (
                    <div key={ci.id} className="p-3 bg-cream/30 border border-border-cream/50 rounded-xl space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-charcoal truncate">{ci.name}</h4>
                          <span className="font-mono text-[10px] text-navy font-bold">₹{ci.price}</span>
                        </div>
                        {/* Adjust quantity controls */}
                        <div className="flex items-center gap-2 border border-border-cream bg-white px-2 py-1 rounded-xl shrink-0">
                          <button onClick={() => handleRemoveFromCart(ci)} className="text-slate hover:text-navy"><Minus className="w-3 h-3" /></button>
                          <span className="font-mono text-xs font-bold text-navy">{ci.quantity}</span>
                          <button onClick={() => handleAddToCart(ci)} className="text-slate hover:text-navy"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      
                      {/* Notes input per item */}
                      <input 
                        type="text"
                        value={itemNotes[ci.id] || ''}
                        onChange={(e) => handleNoteChange(ci.id, e.target.value)}
                        className="w-full px-2.5 py-1 border border-border-cream/50 bg-white rounded-lg text-[9px] focus:outline-none"
                        placeholder="Add preparation note (e.g. no onion, spicy)..."
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border-cream pt-4 mt-2 space-y-4 shrink-0">
                <div className="space-y-1.5 text-xs text-slate font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-charcoal">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-mono text-charcoal">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-border-cream/50 pt-2 text-navy font-bold">
                    <span>Total Amount:</span>
                    <span className="font-mono text-sm">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full py-3 bg-[#0B1F3A] hover:bg-[#142d50] disabled:bg-[#0B1F3A]/70 text-white rounded-full font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 uppercase"
                >
                  <Send className="w-3.5 h-3.5" /> {submitting ? 'Placing Order...' : 'Send to Kitchen'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Waiter;
