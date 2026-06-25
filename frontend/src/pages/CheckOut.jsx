import React, { useState, useEffect } from 'react';
import { LogOut, Receipt, ShieldAlert, CreditCard, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import api from '../utils/api';

function CheckOut() {
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Settlement Form Inputs
  const [extraChargesInput, setExtraChargesInput] = useState('0');
  const [discountInput, setDiscountInput] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(18); // default to 18%

  const fetchPendingCheckOuts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/check-out/pending');
      setOccupiedRooms(data || []);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to fetch pending departures');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await api.get('/settings');
      if (data && typeof data.taxRate === 'number') {
        setTaxRate(data.taxRate);
      }
    } catch (e) {
      console.warn('Could not fetch settings, using default 18% tax rate:', e.message);
    }
  };

  useEffect(() => {
    fetchPendingCheckOuts();
    fetchSettings();
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCheckoutComplete(false);
    setExtraChargesInput('0');
    setDiscountInput('0');
    setPaymentMethod('CASH');
    setNotes('');
  };

  const buildFolio = (room) => {
    if (!room) return [];
    const items = [];

    // 1. Room Charges
    items.push({
      desc: `Room Charges (${room.totalNights} night(s) @ ₹${room.ratePerNight}/night)`,
      amount: room.roomCharges
    });

    // 2. Existing Extra Charges
    if (room.extraCharges > 0) {
      items.push({
        desc: 'Room Extras (Mini Bar, Laundry, etc.)',
        amount: room.extraCharges
      });
    }

    // 3. Existing Discount
    if (room.discount > 0) {
      items.push({
        desc: 'Discount Applied',
        amount: -room.discount
      });
    }

    // 4. Restaurant Dine-In Orders
    if (room.orders && room.orders.length > 0) {
      room.orders.forEach((order) => {
        items.push({
          desc: `Restaurant Order (${order.orderNumber})`,
          amount: order.totalAmount
        });
      });
    }

    return items;
  };

  const handleCheckoutSettle = async () => {
    if (!selectedRoom) return;
    try {
      setSubmitting(true);
      setError(null);

      const extraVal = parseFloat(extraChargesInput) || 0;
      const discVal = parseFloat(discountInput) || 0;
      const subtotal = baseTotal + extraVal - discVal;
      const taxAmount = Math.round(subtotal * (taxRate / 100));

      const payload = {
        reservationId: selectedRoom.id,
        // Send extraVal + taxAmount so the final payment/totalAmount correctly includes tax
        extraCharges: extraVal + taxAmount,
        discount: discVal,
        paymentMethod,
        notes: notes || undefined,
      };

      await api.post('/check-out', payload);
      setCheckoutComplete(true);
      // Remove from occupied rooms list
      setOccupiedRooms(occupiedRooms.filter(r => r.id !== selectedRoom.id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete check-out');
      alert(err.message || 'Failed to complete check-out');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const folioList = buildFolio(selectedRoom);
  const baseTotal = folioList.reduce((acc, curr) => acc + curr.amount, 0);
  const extraVal = parseFloat(extraChargesInput) || 0;
  const discVal = parseFloat(discountInput) || 0;
  const subtotal = baseTotal + extraVal - discVal;
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const grandTotal = Math.max(0, subtotal + taxAmount);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Folio & Check-Out</h1>
          <p className="text-slate text-sm font-medium mt-1">Review guest ledgers, settle room folios, and complete checkout departure</p>
        </div>
        <button 
          onClick={fetchPendingCheckOuts}
          className="flex items-center gap-2 text-xs font-bold text-navy bg-white border border-border-cream px-4 py-2 rounded-xl hover:bg-cream/10 active:scale-95 transition-all shadow-sm self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh departures
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Occupied Rooms directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="soft-card p-6 bg-white">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Occupied Rooms</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate text-sm font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                Loading occupied rooms...
              </div>
            ) : error ? (
              <div className="py-6 text-center text-rose-600 text-sm font-medium">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {occupiedRooms.map((res) => (
                  <div 
                    key={res.id} 
                    onClick={() => handleSelectRoom(res)}
                    className={`
                      cursor-pointer p-5 border rounded-2xl flex items-center justify-between transition-all duration-300
                      ${selectedRoom?.id === res.id 
                        ? 'border-gold bg-gold-pale/50 shadow-md ring-1 ring-gold' 
                        : 'border-border-cream hover:border-gold bg-white hover:bg-gold-pale/10'
                      }
                    `}
                  >
                    <div>
                      <span className="text-[10px] text-slate font-bold uppercase tracking-wider">Room {res.room?.number}</span>
                      <h4 className="font-display font-bold text-base text-navy mt-0.5">{res.guest?.name}</h4>
                      <p className="text-[10px] text-slate mt-1">Checked in: {new Date(res.checkInDate).toLocaleDateString()} ({res.totalNights} night(s))</p>
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
            )}
          </div>
        </div>

        {/* Right Side: Guest Folio Checkout Summary */}
        <div className="soft-card p-6 bg-white h-fit">
          {selectedRoom ? (
            !checkoutComplete ? (
              <div className="space-y-6">
                <div className="border-b border-border-cream pb-4">
                  <span className="text-[10px] text-slate font-bold uppercase tracking-wider">GUEST FOLIO LEDGER</span>
                  <h3 className="font-display font-bold text-lg text-navy mt-0.5">Room {selectedRoom.room?.number}</h3>
                  <p className="text-xs text-slate mt-0.5">Guest: {selectedRoom.guest?.name}</p>
                </div>

                {/* Folio item list */}
                <div className="space-y-3">
                  <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Line Item Charges</span>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {folioList.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-border-cream/30 pb-2">
                        <span className="text-charcoal font-medium">{item.desc}</span>
                        <span className="font-mono text-navy font-semibold">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settle Form Inputs */}
                <div className="space-y-4 pt-4 border-t border-border-cream">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Add Extras (₹)</label>
                      <input 
                        type="number"
                        min="0"
                        value={extraChargesInput}
                        onChange={(e) => setExtraChargesInput(e.target.value)}
                        className="w-full px-3 py-2 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Add Discount (₹)</label>
                      <input 
                        type="number"
                        min="0"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        className="w-full px-3 py-2 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold text-charcoal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Payment Method</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold text-charcoal"
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="WALLET">Wallet</option>
                      <option value="CREDIT">Credit</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Notes</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Damage remarks, laundry notes, etc."
                      rows={2}
                      className="w-full px-3 py-2 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-medium text-charcoal resize-none"
                    />
                  </div>
                </div>

                {/* Totals split */}
                <div className="space-y-2 border-t border-border-cream pt-4">
                  <div className="flex justify-between text-xs text-slate font-semibold">
                    <span>Base Charges Subtotal:</span>
                    <span className="font-mono">₹{baseTotal.toLocaleString()}</span>
                  </div>
                  {extraVal > 0 && (
                    <div className="flex justify-between text-xs text-amber-600 font-semibold">
                      <span>Additional Extras:</span>
                      <span className="font-mono">₹{extraVal.toLocaleString()}</span>
                    </div>
                  )}
                  {discVal > 0 && (
                    <div className="flex justify-between text-xs text-rose-600 font-semibold">
                      <span>Additional Discount:</span>
                      <span className="font-mono">-₹{discVal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-slate font-semibold">
                    <span>Tax ({taxRate}% GST):</span>
                    <span className="font-mono">₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-navy pt-2 border-t border-dashed border-border-cream/50">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-navy font-bold">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Settle / Checkout trigger */}
                <div className="pt-2">
                  <button 
                    onClick={handleCheckoutSettle}
                    disabled={submitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-gold" /> Completing Checkout...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-gold" /> Settle Payment & Check-Out
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Settle completed success banner
              <div className="text-center py-8 space-y-4 animate-scaleUp">
                <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
                <div>
                  <h3 className="font-display font-bold text-lg text-navy">Checkout Completed</h3>
                  <p className="text-xs text-slate mt-1">Folio payment settled successfully.</p>
                  <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200/50 py-2 rounded-xl mt-3">
                    Room {selectedRoom.room?.number} marked as **DIRTY** for housekeeping.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => {
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
