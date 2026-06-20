import React, { useState } from 'react';
import { 
  Home, 
  Trees, 
  Crown, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Info,
  CalendarCheck,
  Utensils
} from 'lucide-react';

function Tables() {
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedTable, setSelectedTable] = useState(null);

  const [tables, setTables] = useState([
    { id: 'T1', name: 'Table 1', zone: 'Main Hall', capacity: 4, shape: 'square', status: 'Available', bill: 0, order: [] },
    { id: 'T2', name: 'Table 2', zone: 'Main Hall', capacity: 2, shape: 'circle', status: 'Occupied', bill: 2400, order: ['Paneer Tikka', 'Garlic Naan', 'Dal Makhani'] },
    { id: 'T3', name: 'Table 3', zone: 'Main Hall', capacity: 4, shape: 'square', status: 'Reserved', bill: 0, order: [] },
    { id: 'T4', name: 'Table 4', zone: 'Main Hall', capacity: 4, shape: 'square', status: 'Available', bill: 0, order: [] },
    { id: 'T5', name: 'Table 5', zone: 'Main Hall', capacity: 2, shape: 'circle', status: 'Occupied', bill: 1150, order: ['Veg Biryani', 'Raita'] },
    { id: 'T6', name: 'Table 6', zone: 'Main Hall', capacity: 4, shape: 'square', status: 'Available', bill: 0, order: [] },
    
    { id: 'T7', name: 'Table 7', zone: 'Garden Terrace', capacity: 4, shape: 'square', status: 'Available', bill: 0, order: [] },
    { id: 'T8', name: 'Table 8', zone: 'Garden Terrace', capacity: 2, shape: 'circle', status: 'Reserved', bill: 0, order: [] },
    { id: 'T9', name: 'Table 9', zone: 'Garden Terrace', capacity: 4, shape: 'square', status: 'Occupied', bill: 3100, order: ['Cold Brew Coffee', 'Margherita Pizza', 'Waffles'] },
    { id: 'T10', name: 'Table 10', zone: 'Garden Terrace', capacity: 6, shape: 'rectangle', status: 'Available', bill: 0, order: [] },
    { id: 'T11', name: 'Table 11', zone: 'Garden Terrace', capacity: 2, shape: 'circle', status: 'Available', bill: 0, order: [] },
    
    { id: 'T12', name: 'Table 12', zone: 'VIP Lounge', capacity: 4, shape: 'square', status: 'Occupied', bill: 5800, order: ['Chandon Brut', 'Cheese Platter', 'Truffle Fries'] },
    { id: 'T13', name: 'Table 13', zone: 'VIP Lounge', capacity: 2, shape: 'circle', status: 'Available', bill: 0, order: [] },
    { id: 'T14', name: 'Table 14', zone: 'VIP Lounge', capacity: 4, shape: 'square', status: 'Reserved', bill: 0, order: [] },
    { id: 'T15', name: 'Table 15', zone: 'VIP Lounge', capacity: 8, shape: 'rectangle', status: 'Occupied', bill: 12400, order: ['Premium Single Malt', 'Kabab Platter', 'Lobster Thermidor'] }
  ]);

  const zones = [
    { name: 'All', icon: null },
    { name: 'Main Hall', icon: Home },
    { name: 'Garden Terrace', icon: Trees },
    { name: 'VIP Lounge', icon: Crown }
  ];

  // Calculate floor metrics
  const totalTablesCount = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'Occupied');
  const reservedTables = tables.filter(t => t.status === 'Reserved');
  const availableTables = tables.filter(t => t.status === 'Available');
  const occupancyRate = Math.round((occupiedTables.length / totalTablesCount) * 100);
  const liveSales = occupiedTables.reduce((acc, curr) => acc + curr.bill, 0);

  const filteredTables = selectedZone === 'All' 
    ? tables 
    : tables.filter(t => t.zone === selectedZone);

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const handleStatusChange = (status) => {
    if (!selectedTable) return;
    const updated = tables.map(t => {
      if (t.id === selectedTable.id) {
        let bill = t.bill;
        let order = t.order;
        if (status === 'Available') {
          bill = 0;
          order = [];
        } else if (status === 'Occupied' && t.status !== 'Occupied') {
          // Add default mock items on occupancy
          bill = 1200;
          order = ['Soup of the Day', 'House Salad'];
        }
        return { ...t, status, bill, order };
      }
      return t;
    });
    setTables(updated);
    setSelectedTable(updated.find(t => t.id === selectedTable.id));
  };

  // Render chair dots positioned absolutely around the table shapes
  const renderChairs = (capacity, status) => {
    const chairs = [];
    const colorClass = 
      status === 'Occupied' ? 'bg-danger' : 
      status === 'Reserved' ? 'bg-warning' : 'bg-success';

    if (capacity === 2) {
      chairs.push(<div key="c1" className={`absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c2" className={`absolute -right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
    } else if (capacity === 4) {
      chairs.push(<div key="c1" className={`absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c2" className={`absolute -right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c3" className={`absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c4" className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
    } else if (capacity === 6) {
      // 3 top, 3 bottom
      chairs.push(<div key="c1" className={`absolute -top-3 left-1/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c2" className={`absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c3" className={`absolute -top-3 left-3/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c4" className={`absolute -bottom-3 left-1/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c5" className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c6" className={`absolute -bottom-3 left-3/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
    } else if (capacity === 8) {
      // 3 top, 3 bottom, 1 left, 1 right
      chairs.push(<div key="c1" className={`absolute -top-3 left-1/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c2" className={`absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c3" className={`absolute -top-3 left-3/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c4" className={`absolute -bottom-3 left-1/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c5" className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c6" className={`absolute -bottom-3 left-3/4 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c7" className={`absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
      chairs.push(<div key="c8" className={`absolute -right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${colorClass}`} />);
    }
    return chairs;
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden animate-fadeIn">
      {/* Floor Plan Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Interactive Floor Plan</h1>
          <p className="text-slate text-sm font-medium mt-1">Real-time table status, customer capacities, and floor operations</p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2 bg-surface-linen/50 p-1 border border-border-cream rounded-2xl">
          {zones.map((zone) => {
            const ZoneIcon = zone.icon;
            const isSelected = selectedZone === zone.name;
            return (
              <button
                key={zone.name}
                onClick={() => setSelectedZone(zone.name)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300
                  ${isSelected 
                    ? 'bg-navy text-gold shadow' 
                    : 'text-slate hover:text-navy hover:bg-white/40'
                  }
                `}
              >
                {ZoneIcon && <ZoneIcon className="w-4 h-4" />}
                <span>{zone.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* Left blueprint canvas */}
        <div className="flex-1 soft-card p-8 overflow-y-auto relative bg-[#FEF9F1] bg-[radial-gradient(#EBE5DA_1.5px,transparent_1.5px)] bg-[size:24px_24px] min-h-[400px]">
          <div className="absolute top-4 left-4 bg-white/80 border border-border-cream px-3 py-1.5 rounded-xl flex items-center gap-4 text-xs font-semibold text-charcoal">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success"></span> Free</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger"></span> Seated</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning"></span> Booked</span>
          </div>

          {/* Tables layout grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-12 mt-16 pb-8 justify-items-center">
            {filteredTables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              const statusBg = 
                table.status === 'Occupied' ? 'bg-danger/10 border-danger text-danger' : 
                table.status === 'Reserved' ? 'bg-warning/10 border-warning text-warning' : 
                'bg-success/10 border-success text-success';

              return (
                <div 
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className="flex flex-col items-center gap-3 select-none"
                >
                  <div className="relative group cursor-pointer">
                    {/* Chair dots around table */}
                    {renderChairs(table.capacity, table.status)}

                    {/* Table shape rendering */}
                    <div className={`
                      flex flex-col items-center justify-center border-2 transition-all duration-300 font-mono shadow-sm
                      ${table.shape === 'circle' && 'w-20 h-20 rounded-full'}
                      ${table.shape === 'square' && 'w-20 h-20 rounded-2xl'}
                      ${table.shape === 'rectangle' && 'w-32 h-20 rounded-2xl'}
                      ${isSelected 
                        ? 'ring-4 ring-gold/40 border-gold bg-gold-pale scale-105' 
                        : `${statusBg} hover:scale-103 hover:shadow-md`
                      }
                    `}>
                      <span className="font-bold text-sm tracking-tight">{table.id}</span>
                      <span className="text-[10px] opacity-75 font-semibold">{table.capacity} Pax</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate font-bold uppercase tracking-wider">{table.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Occupancy Analytics Sidebar */}
        <div className="w-full lg:w-80 shrink-0 soft-card p-6 flex flex-col justify-between overflow-y-auto bg-white">
          {selectedTable ? (
            // Individual Table details
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border-cream pb-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-navy">{selectedTable.name}</h3>
                    <p className="text-[10px] text-slate font-semibold uppercase tracking-wider">{selectedTable.zone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedTable.status === 'Occupied' ? 'bg-danger-pale text-danger border border-danger/20' : 
                    selectedTable.status === 'Reserved' ? 'bg-warning-pale text-warning border border-warning/20' : 
                    'bg-success-pale text-success border border-success/20'
                  }`}>
                    {selectedTable.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-cream/40 rounded-xl border border-border-cream/50">
                    <span className="text-slate block text-[10px] font-bold uppercase tracking-wider">Capacity</span>
                    <span className="font-mono font-bold text-navy text-sm">{selectedTable.capacity} Seats</span>
                  </div>
                  <div className="p-3 bg-cream/40 rounded-xl border border-border-cream/50">
                    <span className="text-slate block text-[10px] font-bold uppercase tracking-wider">Shape</span>
                    <span className="font-semibold text-navy capitalize text-sm">{selectedTable.shape}</span>
                  </div>
                </div>

                {/* Status Switcher Controls */}
                <div className="space-y-2 pt-2">
                  <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Set Table Status</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleStatusChange('Available')}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                        selectedTable.status === 'Available' 
                          ? 'bg-success text-white border-success' 
                          : 'bg-white border-border-cream text-success hover:bg-success-pale'
                      }`}
                    >
                      Free
                    </button>
                    <button 
                      onClick={() => handleStatusChange('Occupied')}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                        selectedTable.status === 'Occupied' 
                          ? 'bg-danger text-white border-danger' 
                          : 'bg-white border-border-cream text-danger hover:bg-danger-pale'
                      }`}
                    >
                      Seated
                    </button>
                    <button 
                      onClick={() => handleStatusChange('Reserved')}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                        selectedTable.status === 'Reserved' 
                          ? 'bg-warning text-white border-warning' 
                          : 'bg-white border-border-cream text-warning hover:bg-warning-pale'
                      }`}
                    >
                      Booked
                    </button>
                  </div>
                </div>

                {/* Order Details / Check info */}
                {selectedTable.status === 'Occupied' && (
                  <div className="space-y-3 pt-4 border-t border-border-cream">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-gold" /> Running Bill
                      </span>
                      <span className="font-mono text-xs font-bold bg-gold-pale text-gold px-2 py-0.5 rounded">
                        KOT ACTIVE
                      </span>
                    </div>
                    <ul className="text-xs text-charcoal space-y-1 bg-cream/20 p-3 rounded-xl border border-border-cream/30">
                      {selectedTable.order.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item}</span>
                          <span className="text-slate font-medium">x1</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center text-xs font-bold border-t border-border-cream/50 pt-2.5">
                      <span className="text-navy">Unbilled Sales:</span>
                      <span className="font-mono text-navy text-sm">₹{selectedTable.bill}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="w-full btn-secondary text-xs"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          ) : (
            // Default Overview Analytics
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-lg text-navy border-b border-border-cream pb-3">Floor Analytics</h3>
                </div>

                {/* Circular Donut Occupancy */}
                <div className="flex flex-col items-center py-4 bg-cream/30 rounded-2xl border border-border-cream/30">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Gray track */}
                      <path
                        className="text-border-cream"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Gold ring */}
                      <path
                        className="text-gold transition-all duration-500 ease-out"
                        strokeDasharray={`${occupancyRate}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-2xl font-bold text-navy leading-none">{occupancyRate}%</span>
                      <span className="text-[9px] text-slate font-bold uppercase tracking-wider mt-1">Occupied</span>
                    </div>
                  </div>
                </div>

                {/* Sales metrics */}
                <div className="space-y-3 bg-navy text-white p-4 rounded-2xl shadow-sm border border-gold/30">
                  <span className="text-[10px] text-gold font-mono font-bold uppercase tracking-wider">Estimated dining value</span>
                  <div className="flex justify-between items-end mt-1">
                    <div>
                      <span className="text-slate text-[9px] block">Live Dine Sales</span>
                      <span className="font-mono text-xl text-white font-bold">₹{liveSales.toLocaleString()}</span>
                    </div>
                    <DollarSign className="w-5 h-5 text-gold mb-1" />
                  </div>
                </div>

                {/* Mini directory list of active tables */}
                <div className="space-y-3">
                  <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Active Dining Tables</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {tables.filter(t => t.status === 'Occupied').map(table => (
                      <div 
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        className="flex justify-between items-center p-2.5 bg-cream/40 border border-border-cream/50 rounded-xl hover:border-gold cursor-pointer transition-all text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-navy text-gold text-[10px] font-bold rounded-lg flex items-center justify-center font-mono">
                            {table.id}
                          </span>
                          <span className="font-semibold text-charcoal">{table.name}</span>
                        </div>
                        <span className="font-mono text-navy font-bold">₹{table.bill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Counts footer */}
              <div className="border-t border-border-cream pt-4 text-[10px] font-bold text-slate flex justify-between uppercase tracking-wider mt-4">
                <span className="text-success">{availableTables.length} Free</span>
                <span className="text-danger">{occupiedTables.length} Seated</span>
                <span className="text-warning">{reservedTables.length} Booked</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Tables;
