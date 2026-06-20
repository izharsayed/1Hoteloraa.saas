import React, { useState } from 'react';
import { CalendarRange, Plus, Search, Calendar, ChevronRight, UserPlus } from 'lucide-react';

function Reservations() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [bookings, setBookings] = useState([
    { id: 'RES-8420', guest: 'Ananya Deshpande', roomType: 'Deluxe', checkIn: '2026-06-19', checkOut: '2026-06-22', status: 'Confirmed', price: '₹12,000' },
    { id: 'RES-8421', guest: 'Dr. Aditya Verma', roomType: 'Suite', checkIn: '2026-06-18', checkOut: '2026-06-20', status: 'Checked-In', price: '₹15,000' },
    { id: 'RES-8422', guest: 'Meera Deshmukh', roomType: 'Standard', checkIn: '2026-06-15', checkOut: '2026-06-18', status: 'Checked-Out', price: '₹7,500' },
    { id: 'RES-8423', guest: 'Vikramaditya Rao', roomType: 'Presidential Suite', checkIn: '2026-06-20', checkOut: '2026-06-25', status: 'Confirmed', price: '₹75,000' },
    { id: 'RES-8424', guest: 'Sunil Grover', roomType: 'Standard', checkIn: '2026-06-19', checkOut: '2026-06-20', status: 'Cancelled', price: '₹2,500' }
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    const matchesSearch = booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) || booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Reservations Registry</h1>
          <p className="text-slate text-sm font-medium mt-1">Manage guest bookings, check dates, and allocate rooms</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-gold" /> New Booking
        </button>
      </div>

      {/* Filter and search */}
      <div className="soft-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-2 bg-cream/20 border border-border-cream rounded-xl px-3 py-1.5 w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate" />
          <input 
            type="text" 
            placeholder="Search by Guest name or Res ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none text-xs w-full text-charcoal"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
                ${selectedStatus === status 
                  ? 'bg-navy border-navy text-gold' 
                  : 'bg-white border-border-cream text-slate hover:bg-gold-pale/10'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="soft-card p-6 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-cream text-[10px] font-bold text-slate uppercase tracking-wider">
                <th className="pb-3">Reservation ID</th>
                <th className="pb-3">Guest Name</th>
                <th className="pb-3">Room Category</th>
                <th className="pb-3"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-In</span></th>
                <th className="pb-3"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-Out</span></th>
                <th className="pb-3 text-right">Est. Cost</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-cream/40 text-xs">
              {filteredBookings.map((book) => (
                <tr key={book.id} className="hover:bg-gold-pale/10 transition-colors">
                  <td className="py-4 font-mono font-semibold text-navy">{book.id}</td>
                  <td className="py-4 font-semibold text-charcoal">{book.guest}</td>
                  <td className="py-4 text-slate">{book.roomType}</td>
                  <td className="py-4 font-mono">{book.checkIn}</td>
                  <td className="py-4 font-mono">{book.checkOut}</td>
                  <td className="py-4 font-mono font-bold text-navy text-right">{book.price}</td>
                  <td className="py-4 text-center">
                    <span className={`
                      px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-block
                      ${book.status === 'Confirmed' && 'bg-gold-pale text-gold border border-gold/20'}
                      ${book.status === 'Checked-In' && 'bg-blue-50 text-blue-800 border border-blue-200'}
                      ${book.status === 'Checked-Out' && 'bg-success-pale text-success border border-success/20'}
                      ${book.status === 'Cancelled' && 'bg-danger-pale text-danger border border-danger/20'}
                    `}>
                      {book.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <ChevronRight className="w-4 h-4 text-slate cursor-pointer hover:text-gold transition-colors inline" />
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

export default Reservations;
