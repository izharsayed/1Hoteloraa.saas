import React, { useState } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  FileText, 
  CheckCircle, 
  Receipt, 
  ArrowRight,
  Plus,
  Percent,
  Check,
  SplitSquareVertical
} from 'lucide-react';

function Billing() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', type: 'Room Folio', guest: 'Dr. Aditya Verma', amount: 14500, room: 'Suite 302', status: 'Unpaid', discount: 0 },
    { id: 'INV-2026-002', type: 'POS Table', guest: 'Table 14 - Dine In', amount: 3450, room: 'Restaurant', status: 'Unpaid', discount: 0 },
    { id: 'INV-2026-003', type: 'Room Folio', guest: 'Meera Deshmukh', amount: 8200, room: 'Room 105', status: 'Paid', discount: 500 },
    { id: 'INV-2026-004', type: 'POS Table', guest: 'Table 03 - Dine In', amount: 1240, room: 'Restaurant', status: 'Unpaid', discount: 0 },
    { id: 'INV-2026-005', type: 'Room Service', guest: 'Rahul Khanna', amount: 650, room: 'Room 204', status: 'Paid', discount: 0 }
  ]);

  // Quick Bill Form States
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newBillType, setNewBillType] = useState('POS Table');
  const [newBillRoom, setNewBillRoom] = useState('Restaurant');
  const [newBillAmount, setNewBillAmount] = useState('');

  // Discount / Split States
  const [customDiscount, setCustomDiscount] = useState('');
  const [splitCount, setSplitCount] = useState(1);
  const [showSplitResult, setShowSplitResult] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setCustomDiscount('');
    setSplitCount(1);
    setShowSplitResult(false);
  };

  const handleRecordPayment = (id, method) => {
    const updated = invoices.map(inv => {
      if (inv.id === id) {
        showToast(`Payment of ₹${(inv.amount - inv.discount).toLocaleString()} collected via ${method}. Check settled.`);
        return { ...inv, status: 'Paid' };
      }
      return inv;
    });
    setInvoices(updated);
    // Update selected invoice details
    setSelectedInvoice(updated.find(inv => inv.id === id));
  };

  const handleApplyDiscount = () => {
    if (!selectedInvoice) return;
    const discountVal = parseFloat(customDiscount) || 0;
    if (discountVal < 0 || discountVal > selectedInvoice.amount) {
      showToast('Invalid discount amount');
      return;
    }

    const updated = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return { ...inv, discount: discountVal };
      }
      return inv;
    });
    setInvoices(updated);
    setSelectedInvoice(updated.find(inv => inv.id === selectedInvoice.id));
    showToast(`Discount of ₹${discountVal} applied to invoice.`);
    setCustomDiscount('');
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    if (!newGuestName || !newBillAmount) return;

    const newBill = {
      id: `INV-2026-0${invoices.length + 1}`,
      type: newBillType,
      guest: newGuestName,
      amount: parseFloat(newBillAmount),
      room: newBillRoom,
      status: 'Unpaid',
      discount: 0
    };

    setInvoices([newBill, ...invoices]);
    setNewGuestName('');
    setNewBillAmount('');
    setShowAddBillModal(false);
    showToast(`Invoice ${newBill.id} generated.`);
  };

  const calculateTaxes = (amount, discount) => {
    const taxable = amount - discount;
    const cgst = (taxable * 9) / 100;
    const sgst = (taxable * 9) / 100;
    return { cgst, sgst, total: taxable + cgst + sgst };
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-navy border border-gold text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-stone-900/10 animate-slideIn">
          <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-navy">Cashier Billing & Folios Control</h1>
          <p className="text-slate text-sm font-medium mt-1">Audit active guest ledger checks, apply discounts, process card/cash settlements, and print receipts</p>
        </div>
        <button 
          onClick={() => setShowAddBillModal(true)}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Generate Quick Check
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of invoices */}
        <div className="lg:col-span-2 space-y-4">
          <div className="soft-card p-6 bg-white">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Active & Pending Checks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-cream text-[10px] font-bold text-slate uppercase tracking-wider">
                    <th className="pb-3">Invoice ID</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Guest / Area</th>
                    <th className="pb-3 text-right">Base Amount</th>
                    <th className="pb-3 text-right">Discount</th>
                    <th className="pb-3 text-right">Grand Total</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-cream/40 text-xs font-semibold">
                  {invoices.map((inv) => {
                    const taxes = calculateTaxes(inv.amount, inv.discount);
                    return (
                      <tr 
                        key={inv.id} 
                        onClick={() => handleSelectInvoice(inv)}
                        className={`hover:bg-gold-pale/30 cursor-pointer transition-all ${selectedInvoice?.id === inv.id ? 'bg-gold-pale/50' : ''}`}
                      >
                        <td className="py-4 font-mono font-bold text-navy">{inv.id}</td>
                        <td className="py-4 text-slate">{inv.type}</td>
                        <td className="py-4">
                          <span className="font-bold text-charcoal block">{inv.guest}</span>
                          <span className="text-[10px] text-slate font-mono font-medium">{inv.room}</span>
                        </td>
                        <td className="py-4 font-mono font-bold text-slate text-right">₹{inv.amount.toLocaleString()}</td>
                        <td className="py-4 font-mono font-bold text-danger text-right">
                          {inv.discount > 0 ? `-₹${inv.discount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-4 font-mono font-bold text-navy text-right">₹{Math.round(taxes.total).toLocaleString()}</td>
                        <td className="py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            inv.status === 'Paid' 
                              ? 'bg-success/10 text-success border border-success/20' 
                              : 'bg-warning-pale text-warning border border-warning/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <ArrowRight className="w-4 h-4 text-slate hover:text-gold transition-colors inline" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="soft-card p-6 h-fit bg-surface-linen/30 border border-border-cream">
          {selectedInvoice ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-border-cream pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate">{selectedInvoice.type}</span>
                  <h3 className="font-mono font-bold text-lg text-navy mt-1">{selectedInvoice.id}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedInvoice.status === 'Paid' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning-pale text-warning'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>

              {/* Guest metadata */}
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate font-medium">Customer:</span>
                  <span className="text-charcoal">{selectedInvoice.guest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate font-medium">Location:</span>
                  <span className="text-charcoal">{selectedInvoice.room}</span>
                </div>
                <div className="flex justify-between border-t border-border-cream/50 pt-3">
                  <span className="text-slate">Base Items Subtotal:</span>
                  <span className="font-mono text-charcoal">₹{selectedInvoice.amount.toLocaleString()}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-danger">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-₹{selectedInvoice.discount.toLocaleString()}</span>
                  </div>
                )}
                
                {/* Tax Breakdown */}
                {(() => {
                  const taxes = calculateTaxes(selectedInvoice.amount, selectedInvoice.discount);
                  return (
                    <>
                      <div className="flex justify-between text-slate font-medium text-[11px]">
                        <span>CGST (9%):</span>
                        <span className="font-mono">₹{taxes.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate font-medium text-[11px]">
                        <span>SGST (9%):</span>
                        <span className="font-mono">₹{taxes.sgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-navy pb-1 pt-3 text-sm font-bold text-navy">
                        <span>Grand Total (Net):</span>
                        <span className="font-mono">₹{Math.round(taxes.total).toLocaleString()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Active Actions */}
              {selectedInvoice.status === 'Unpaid' ? (
                <div className="space-y-4 pt-4 border-t border-border-cream">
                  {/* Apply Discount Field */}
                  <div className="space-y-1.5 p-3 bg-cream/15 border border-border-cream/50 rounded-2xl">
                    <label className="text-[9px] font-bold text-navy uppercase block">Apply Flat Discount (₹)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="e.g. 200"
                        value={customDiscount}
                        onChange={(e) => setCustomDiscount(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-border-cream rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-gold"
                      />
                      <button 
                        onClick={handleApplyDiscount}
                        className="px-3 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Split Bill Calculator */}
                  <div className="space-y-2 p-3 bg-cream/15 border border-border-cream/50 rounded-2xl">
                    <label className="text-[9px] font-bold text-navy uppercase block flex items-center gap-1">
                      <SplitSquareVertical className="w-3.5 h-3.5 text-gold" /> Split Bill Calculator
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        min="1"
                        placeholder="No. of guests"
                        value={splitCount}
                        onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-1.5 bg-white border border-border-cream rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-gold"
                      />
                      <button 
                        onClick={() => setShowSplitResult(true)}
                        className="px-3 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold shrink-0"
                      >
                        Calculate
                      </button>
                    </div>
                    {showSplitResult && (
                      <p className="text-[10px] font-bold text-navy mt-1">
                        Each Share: ₹{Math.round(calculateTaxes(selectedInvoice.amount, selectedInvoice.discount).total / splitCount).toLocaleString()} (for {splitCount} guests)
                      </p>
                    )}
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={() => handleRecordPayment(selectedInvoice.id, 'Credit/UPI')}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-xs"
                    >
                      <CreditCard className="w-4 h-4 text-gold" /> Pay via Credit Card / UPI
                    </button>
                    <button 
                      onClick={() => handleRecordPayment(selectedInvoice.id, 'Cash')}
                      className="w-full btn-accent flex items-center justify-center gap-2 py-2.5 text-xs"
                    >
                      <IndianRupee className="w-4 h-4" /> Collect Cash Payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-border-cream text-center text-xs font-semibold">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="font-bold text-charcoal">Invoice Fully Settled</p>
                  <button className="w-full btn-secondary mt-2 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Print PDF Receipt
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Receipt className="w-12 h-12 text-slate/50 mx-auto" />
              <p className="text-xs font-semibold text-slate">Select a pending check on the left to review invoice details, apply discounts, or record payments</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Bill Modal */}
      {showAddBillModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h4 className="font-display font-bold text-navy text-lg">Generate Quick Bill Check</h4>
              <p className="text-xs text-slate mt-0.5">Creates a new PMS folio checkout check or POS table check</p>
            </div>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Guest Name / Area Reference</label>
                <input 
                  type="text" 
                  required
                  placeholder="Karan Johar / Cafe Walk-in"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Check Type</label>
                  <select
                    value={newBillType}
                    onChange={(e) => setNewBillType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  >
                    <option value="POS Table">POS Table Check</option>
                    <option value="Room Folio">Room Folio Check</option>
                    <option value="Room Service">Room Service</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Location / Table</label>
                  <input 
                    type="text" 
                    placeholder="Table 18 or Room 304"
                    value={newBillRoom}
                    onChange={(e) => setNewBillRoom(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Base Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="2450"
                  value={newBillAmount}
                  onChange={(e) => setNewBillAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-mono font-bold"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddBillModal(false)}
                  className="w-1/2 px-4 py-2.5 border border-border-cream text-charcoal hover:bg-stone-50 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 px-4 py-2.5 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold"
                >
                  Create Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;
