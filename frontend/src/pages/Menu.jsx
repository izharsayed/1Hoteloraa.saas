import React, { useState } from 'react';
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, Search } from 'lucide-react';

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [menuItems, setMenuItems] = useState([
    { id: 'MNU-001', name: 'Paneer Tikka', category: 'Appetizers', price: 250, status: 'Active', desc: 'Charcoal grilled cottage cheese marinated in spiced yogurt' },
    { id: 'MNU-002', name: 'Garlic Naan', category: 'Main Course', price: 60, status: 'Active', desc: 'Clay oven flatbread infused with fresh minced garlic and butter' },
    { id: 'MNU-003', name: 'Dal Makhani', category: 'Main Course', price: 320, status: 'Active', desc: 'Slow cooked black lentils simmered overnight with cream and spices' },
    { id: 'MNU-004', name: 'Veg Biryani', category: 'Main Course', price: 350, status: 'Active', desc: 'Fragrant basmati rice layered with spiced vegetables and saffron' },
    { id: 'MNU-005', name: 'Hot Fudge Sunder', category: 'Desserts', price: 180, status: 'Active', desc: 'Rich vanilla bean gelato topped with warm chocolate fudge syrup' },
    { id: 'MNU-006', name: 'Fresh Mint Mojito', category: 'Beverages', price: 150, status: 'Out of Stock', desc: 'Refreshing blend of lime, fresh mint leaves, white sugar, and club soda' }
  ]);

  const handlePriceChange = (id, newPrice) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, price: parseInt(newPrice) || 0 } : item
    ));
  };

  const handleStatusToggle = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, status: item.status === 'Active' ? 'Out of Stock' : 'Active' } : item
    ));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">POS Menu Catalog</h1>
          <p className="text-slate text-sm font-medium mt-1">Manage kitchen recipes, pricing structures, and active catalog dishes</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4 text-gold" /> Add Menu Item
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="soft-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-2 bg-cream/20 border border-border-cream rounded-xl px-3 py-1.5 w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate" />
          <input 
            type="text" 
            placeholder="Search by Dish name or KOT ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none text-xs w-full text-charcoal"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
                ${selectedCategory === cat 
                  ? 'bg-navy border-navy text-gold' 
                  : 'bg-white border-border-cream text-slate hover:bg-gold-pale/10'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="soft-card p-6 bg-white flex flex-col justify-between h-52">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate font-bold uppercase tracking-wider font-mono">{item.id}</span>
                  <h3 className="font-display font-bold text-base text-navy mt-0.5">{item.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  item.status === 'Active' ? 'bg-success-pale text-success' : 'bg-danger-pale text-danger'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-slate text-xs mt-2 leading-relaxed line-clamp-2">{item.desc}</p>
            </div>

            <div className="border-t border-border-cream/50 pt-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-navy text-xs font-bold font-mono">₹</span>
                <input 
                  type="number"
                  value={item.price}
                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                  className="w-16 px-2 py-1 border border-border-cream rounded-lg focus:outline-none focus:border-gold text-xs font-mono font-bold text-navy"
                />
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleStatusToggle(item.id)}
                  className={`
                    px-3 py-1.5 text-xs font-bold rounded-xl border transition-all
                    ${item.status === 'Active' 
                      ? 'bg-white border-danger/30 text-danger hover:bg-danger-pale' 
                      : 'bg-white border-success/30 text-success hover:bg-success-pale'
                    }
                  `}
                >
                  {item.status === 'Active' ? 'Set Out of Stock' : 'Set Active'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
