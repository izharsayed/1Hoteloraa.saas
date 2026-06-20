import React, { useState } from 'react';
import { LogOut, Receipt, ShieldAlert, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';

function CheckOut() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const [occupiedRooms, setOccupiedRooms] = useState([
    {
      number: '102',
      guest: 'Dr. Aditya Verma',
      type: 'Standard',
      checkInDate: '2026-06-18',
      nights: 2,
      rate: 2500,
      folio: [
        { desc: 'Room Charges (2 nights)', amount: 5000 },
        { desc: 'Restaurant Dine-in (KOT-112)', amount: 650 },
        { desc: 'Mini Bar (Beverages)', amount: 300 },
        { desc: 'Laundry Service', amount: 200 }
      ]
    },
    {
      number: '202',
      guest: 'Sunita Sharma',
      type: 'Suite',
      checkInDate: '2026-06-16',
      nights: 3,
      rate: 7500,
      folio: [
        { desc: 'Room Charges (3 nights)', amount: 22500 },
        { desc: 'Room Service (KOT-098)', amount: 1850 },
        { desc: 'Laundry Service', amount: 450 }
      ]
    },
    {
      number: '301',
      guest: 'Vikramaditya Rao',
      type: 'Presidential Suite',
      checkInDate: '2026-06-15',
      nights: 4,
      rate: 15000,
      folio: [
        { desc: 'Room Charges (4 nights)', amount: 60000 },
        { desc: 'Restaurant Dinner (KOT-104)', amount: 4150 },
        { desc: 'Airport Pickup Transfer', amount: 2500 },
        { desc: 'Mini Bar & Snacks', amount: 800 }
      ]
    }
  ]);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCheckoutComplete(false);
  };

  const getFolioTotal = (folio) => {
    return folio.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleCheckoutSettle = () => {
    if (!selectedRoom) return;
    // Set checked out successfully
    setCheckoutComplete(true);
    // Remove from occupied rooms list
    setOccupiedRooms(occupiedRooms.filter(r => r.number !== selectedRoom.number));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Folio & Check-Out</h1>
          <p className="text-slate text-sm font-medium mt-1">Review guest ledgers, settle room folios, and complete checkout checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Occupied Rooms directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="soft-card p-6 bg-white">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Occupied Rooms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {occupiedRooms.map((room) => (
                <div 
                  key={room.number} 
                  onClick={() => handleSelectRoom(room)}
                  className={`
                    cursor-pointer p-5 border rounded-2xl flex items-center justify-between transition-all duration-300
                    ${selectedRoom?.number === room.number 
                      ? 'border-gold bg-gold-pale/50 shadow-md ring-1 ring-gold' 
                      : 'border-border-cream hover:border-gold bg-white hover:bg-gold-pale/10'
                    }
                  `}
                >
                  <div>
                    <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Room {room.number}</span>
                    <h4 className="font-display font-bold text-base text-navy mt-0.5">{room.guest}</h4>
                    <p className="text-[10px] text-slate mt-1">Checked in: {room.checkInDate} ({room.nights} nights)</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate" />
                </div>
              ))}
              {occupiedRooms.length === 0 && (
                <div className="col-span-2 py-8 text-center text-slate text-sm">
                  No currently occupied rooms found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Guest Folio Checkout Summary */}
        <div className="soft-card p-6 bg-white h-fit">
          {selectedRoom ? (
            !checkoutComplete ? (
              <div className="space-y-6">
                <div className="border-b border-border-cream pb-4">
                  <span className="text-[10px] text-slate font-bold uppercase tracking-wider">GUEST FOLIO LEDGER</span>
                  <h3 className="font-display font-bold text-lg text-navy mt-0.5">Room {selectedRoom.number}</h3>
                  <p className="text-xs text-slate mt-0.5">Guest: {selectedRoom.guest}</p>
                </div>

                {/* Folio item list */}
                <div className="space-y-3">
                  <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Line Item Charges</span>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {selectedRoom.folio.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-border-cream/30 pb-2">
                        <span className="text-charcoal font-medium">{item.desc}</span>
                        <span className="font-mono text-navy font-semibold">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals split */}
                <div className="space-y-2 border-t border-border-cream pt-4">
                  <div className="flex justify-between text-xs text-slate font-semibold">
                    <span>Tax (18% GST):</span>
                    <span className="font-mono">₹{(getFolioTotal(selectedRoom.folio) * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-navy pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-navy font-bold">
                      ₹{Math.round(getFolioTotal(selectedRoom.folio) * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Settle / Checkout trigger */}
                <div className="pt-4 space-y-2">
                  <button 
                    onClick={handleCheckoutSettle}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-gold" /> Settle Payment & Check-Out
                  </button>
                </div>
              </div>
            ) : (
              // Settle completed success banner
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
                <div>
                  <h3 className="font-display font-bold text-lg text-navy">Checkout Completed</h3>
                  <p className="text-xs text-slate mt-1">Folio payment settled successfully.</p>
                  <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200/50 py-2 rounded-xl mt-3">
                    Room {selectedRoom.number} marked as **DIRTY** for housekeeping.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setSelectedTable(null);
                      setSelectedRoom(null);
                    }}
                    className="btn-primary mx-auto"
                  >
                    Reset Departure View
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-16 space-y-4">
              <Receipt className="w-12 h-12 text-slate/50 mx-auto" />
              <p className="text-sm font-semibold text-slate">Select an occupied room on the left to load guest folio records and process checkout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
