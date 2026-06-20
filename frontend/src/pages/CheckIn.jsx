import React, { useState } from 'react';
import { UserCheck, ShieldCheck, User, CreditCard, Search, DoorOpen, ClipboardList } from 'lucide-react';

function CheckIn() {
  const [searchId, setSearchId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // List of confirmed bookings eligible for check-in
  const confirmedBookings = [
    { id: 'RES-8420', guest: 'Ananya Deshpande', roomType: 'Deluxe', checkIn: '2026-06-19', checkOut: '2026-06-22', pax: 2 },
    { id: 'RES-8423', guest: 'Vikramaditya Rao', roomType: 'Presidential Suite', checkIn: '2026-06-20', checkOut: '2026-06-25', pax: 4 }
  ];

  // List of available rooms for assignment
  const availableRooms = [
    { number: '101', type: 'Standard' },
    { number: '103', type: 'Deluxe' },
    { number: '203', type: 'Suite' },
    { number: '302', type: 'Suite' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const found = confirmedBookings.find(b => b.id.toLowerCase() === searchId.toLowerCase() || b.guest.toLowerCase().includes(searchId.toLowerCase()));
    if (found) {
      setSelectedBooking(found);
      setIsCheckedIn(false);
      // Auto-set matching room filter if possible
      const match = availableRooms.find(r => r.type === found.roomType);
      if (match) setSelectedRoomNumber(match.number);
    } else {
      alert('No active confirmed reservation found for this name/ID today.');
    }
  };

  const handleCompleteCheckIn = (e) => {
    e.preventDefault();
    if (!selectedRoomNumber) {
      alert('Please assign a room number before completing check-in.');
      return;
    }
    if (!idNumber) {
      alert('Please enter a guest ID verification number.');
      return;
    }
    setIsCheckedIn(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Front Desk Check-In</h1>
          <p className="text-slate text-sm font-medium mt-1">Verify guests, assign room numbers, and issue room access keys</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Search & Checkin Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Search Card */}
          <div className="soft-card p-6 bg-white">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Search Reservation</h3>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate" />
                <input 
                  type="text"
                  required
                  placeholder="Enter Reservation ID (e.g. RES-8420) or Guest name"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-cream/10 border border-border-cream rounded-2xl focus:outline-none focus:border-gold text-sm"
                />
              </div>
              <button type="submit" className="btn-primary px-6">
                Locate Booking
              </button>
            </form>
          </div>

          {/* Guest Checkin Detail Card */}
          {selectedBooking && !isCheckedIn && (
            <form onSubmit={handleCompleteCheckIn} className="soft-card p-6 bg-white space-y-6">
              <div className="flex justify-between items-center border-b border-border-cream pb-4">
                <h3 className="font-display font-semibold text-lg text-navy">Check-In Registration</h3>
                <span className="font-mono text-xs font-bold text-gold bg-gold-pale px-2.5 py-1 rounded">
                  {selectedBooking.id}
                </span>
              </div>

              {/* Guest Profile summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-cream/20 p-4 rounded-2xl border border-border-cream/40">
                <div>
                  <span className="text-slate block text-[10px] uppercase font-bold tracking-wider">Primary Guest</span>
                  <span className="font-semibold text-charcoal text-sm flex items-center gap-1.5 mt-0.5"><User className="w-4 h-4 text-gold" /> {selectedBooking.guest}</span>
                </div>
                <div>
                  <span className="text-slate block text-[10px] uppercase font-bold tracking-wider">Room Type Booked</span>
                  <span className="font-semibold text-charcoal text-sm flex items-center gap-1.5 mt-0.5"><DoorOpen className="w-4 h-4 text-gold" /> {selectedBooking.roomType}</span>
                </div>
                <div>
                  <span className="text-slate block text-[10px] uppercase font-bold tracking-wider">Dates & Pax</span>
                  <span className="font-semibold text-charcoal text-sm flex items-center gap-1.5 mt-0.5"><ClipboardList className="w-4 h-4 text-gold" /> {selectedBooking.checkIn} to {selectedBooking.checkOut} ({selectedBooking.pax} Pax)</span>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Assignment */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block">Assign Room</label>
                  <select 
                    value={selectedRoomNumber}
                    onChange={(e) => setSelectedRoomNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  >
                    <option value="">Select Available Room</option>
                    {availableRooms.map(room => (
                      <option key={room.number} value={room.number}>
                        Room {room.number} ({room.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* ID verification */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block">Identity Document Type</label>
                  <select 
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider block">ID Document Number</label>
                  <input 
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter ID document number"
                    className="w-full px-4 py-3 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs"
                  />
                </div>
              </div>

              {/* Complete checkin button */}
              <button type="submit" className="w-full py-4 btn-primary rounded-xl font-bold flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5 text-gold" /> Check-In Guest & Activate Room Keys
              </button>
            </form>
          )}

          {/* Success Banner */}
          {isCheckedIn && (
            <div className="soft-card p-8 bg-success-pale border-success/30 text-center space-y-4">
              <ShieldCheck className="w-16 h-16 text-success mx-auto" />
              <div>
                <h3 className="font-display font-bold text-xl text-navy">Check-In Completed!</h3>
                <p className="text-xs text-slate mt-1">Room {selectedRoomNumber} is now marked as **Occupied**.</p>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    setSelectedBooking(null);
                    setSearchId('');
                  }}
                  className="btn-primary mx-auto"
                >
                  Return to Front Desk
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Front desk checkin guidelines */}
        <div className="soft-card p-6 bg-white h-fit space-y-4">
          <h3 className="font-display font-semibold text-navy text-sm border-b border-border-cream pb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-gold" /> Front Desk Guidelines
          </h3>
          <ul className="text-xs text-slate space-y-2 list-disc pl-4 leading-relaxed">
            <li>Verify guest photo matches ID document provided.</li>
            <li>Take print or digital scan of the ID document for tenant records.</li>
            <li>Select an available room category that matches the reservation.</li>
            <li>Configure digital room card keys on the encoder terminal.</li>
            <li>Add any initial deposit charges to the guest folio ledger.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
