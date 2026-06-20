import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, User, AlertCircle, Plus, Check } from 'lucide-react';

function Housekeeping() {
  const [housekeepingList, setHousekeepingList] = useState([
    { roomNumber: '104', type: 'Deluxe', status: 'Dirty', assignedStaff: 'Unassigned', notes: 'Late checkout guest departure' },
    { roomNumber: '201', type: 'Deluxe', status: 'Cleaning', assignedStaff: 'Amit Kumar', notes: 'Express cleaning requested' },
    { roomNumber: '208', type: 'Suite', status: 'Dirty', assignedStaff: 'Ramesh Singh', notes: 'VIP arrival preparation needed' }
  ]);

  const [staff] = useState(['Amit Kumar', 'Ramesh Singh', 'Sunita Rao', 'Karan Johar']);

  const handleAssignStaff = (roomNumber, staffName) => {
    setHousekeepingList(housekeepingList.map(item => 
      item.roomNumber === roomNumber ? { ...item, assignedStaff: staffName, status: 'Cleaning' } : item
    ));
  };

  const handleMarkClean = (roomNumber) => {
    setHousekeepingList(housekeepingList.filter(item => item.roomNumber !== roomNumber));
    // In a real database this would set room status to 'Available'
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Housekeeping Board</h1>
          <p className="text-slate text-sm font-medium mt-1">Assign cleaning staff, track room cleaning statuses, and inspect rooms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Active Cleaning Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="soft-card p-6 bg-white">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Pending Cleaning Queue</h3>
            <div className="space-y-4">
              {housekeepingList.map((item) => (
                <div 
                  key={item.roomNumber}
                  className={`
                    p-5 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300
                    ${item.status === 'Dirty' ? 'border-amber-300 bg-amber-50/20' : 'border-blue-300 bg-blue-50/10'}
                  `}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-navy text-gold font-display font-bold rounded-xl flex items-center justify-center">
                        {item.roomNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-charcoal text-sm">{item.type} Room</h4>
                        <p className="text-[10px] text-slate mt-0.5 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {item.notes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Staff Assignment / Status */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Staff selection */}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate" />
                      <select 
                        value={item.assignedStaff}
                        onChange={(e) => handleAssignStaff(item.roomNumber, e.target.value)}
                        className="px-3 py-1.5 border border-border-cream rounded-xl text-xs font-semibold text-charcoal focus:outline-none bg-white"
                      >
                        <option value="Unassigned">Assign Staff</option>
                        {staff.map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status badge */}
                    <span className={`
                      px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1
                      ${item.status === 'Dirty' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
                    `}>
                      {item.status === 'Cleaning' && <RefreshCw className="w-3 h-3 animate-spin" />}
                      {item.status}
                    </span>

                    {/* Mark clean button */}
                    <button 
                      onClick={() => handleMarkClean(item.roomNumber)}
                      className="px-3 py-1.5 bg-success text-white text-xs font-bold rounded-xl hover:bg-success/90 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Done
                    </button>
                  </div>
                </div>
              ))}
              {housekeepingList.length === 0 && (
                <div className="py-12 text-center text-slate space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                  <p className="font-bold text-charcoal">All Rooms Cleaned</p>
                  <p className="text-xs text-slate">Ready for new guest check-ins.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Staff list & directory */}
        <div className="soft-card p-6 bg-white h-fit space-y-4">
          <h3 className="font-display font-semibold text-navy text-sm border-b border-border-cream pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" /> Housekeeping Roster
          </h3>
          <div className="space-y-3">
            {staff.map((name, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-cream/20 border border-border-cream/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy text-gold font-bold flex items-center justify-center text-xs">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">{name}</h4>
                    <p className="text-[9px] text-slate font-medium">Housekeeper</p>
                  </div>
                </div>
                <span className="text-[10px] text-success font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Housekeeping;
