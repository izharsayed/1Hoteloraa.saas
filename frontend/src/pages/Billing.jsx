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
  SplitSquareVertical,
  X,
  Trash2,
  Search,
  ArrowUpDown,
  TrendingUp,
  Coins
} from 'lucide-react';

function Billing() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-2026-001', 
      type: 'Room Folio', 
      guest: 'Dr. Aditya Verma', 
      amount: 14500, 
      room: 'Suite 302', 
      status: 'Unpaid', 
      discount: 0,
      paidAmount: 0,
      gstRate: 18,
      serviceChargeRate: 5,
      items: [
        { name: 'Room Stay (2 Nights)', price: 12000 },
        { name: 'In-Room Dining', price: 1500 },
        { name: 'Laundry Service', price: 1000 }
      ],
      payments: []
    },
    { 
      id: 'INV-2026-002', 
      type: 'POS Table', 
      guest: 'Table 14 - Dine In', 
      amount: 2250, 
      room: 'Restaurant', 
      status: 'Unpaid', 
      discount: 0,
      paidAmount: 0,
      gstRate: 5,
      serviceChargeRate: 0,
      items: [
        { name: '2x Butter Chicken', price: 1200 },
        { name: '4x Butter Naan', price: 200 },
        { name: '1x Dal Makhani', price: 350 },
        { name: '1x Veg Biryani', price: 500 }
      ],
      payments: []
    },
    { 
      id: 'INV-2026-003', 
      type: 'Room Folio', 
      guest: 'Meera Deshmukh', 
      amount: 8200, 
      room: 'Room 105', 
      status: 'Paid', 
      discount: 500,
      paidAmount: 9086,
      gstRate: 18,
      serviceChargeRate: 0,
      items: [
        { name: 'Room Stay (1 Night)', price: 6000 },
        { name: 'Spa Treatment', price: 2200 }
      ],
      payments: [{ method: 'Card/UPI', amount: 9086, reference: 'TXN-902348', date: '2026-06-23' }]
    },
    { 
      id: 'INV-2026-004', 
      type: 'POS Table', 
      guest: 'Table 03 - Dine In', 
      amount: 1240, 
      room: 'Restaurant', 
      status: 'Unpaid', 
      discount: 0,
      paidAmount: 0,
      gstRate: 5,
      serviceChargeRate: 5,
      items: [
        { name: '1x Chicken Burger', price: 350 },
        { name: '1x Cheese Sandwich', price: 250 },
        { name: '2x Cappuccino', price: 360 },
        { name: '1x Chocolate Brownie', price: 280 }
      ],
      payments: []
    },
    { 
      id: 'INV-2026-005', 
      type: 'Room Service', 
      guest: 'Rahul Khanna', 
      amount: 650, 
      room: 'Room 204', 
      status: 'Paid', 
      discount: 0,
      paidAmount: 767,
      gstRate: 18,
      serviceChargeRate: 0,
      items: [
        { name: '1x Club Sandwich', price: 450 },
        { name: '1x Fresh Lime Soda', price: 200 }
      ],
      payments: [{ method: 'Cash', amount: 767, reference: '', date: '2026-06-24' }]
    }
  ]);

  // Quick Bill Form States
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newBillType, setNewBillType] = useState('POS Table');
  const [newBillRoom, setNewBillRoom] = useState('Restaurant');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillItems, setNewBillItems] = useState('');

  // Discount / Split / Collection States
  const [customDiscount, setCustomDiscount] = useState('');
  const [discountType, setDiscountType] = useState('flat'); // 'flat' or 'percent'
  const [splitCount, setSplitCount] = useState(1);
  const [showSplitResult, setShowSplitResult] = useState(false);
  const [collectAmount, setCollectAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [printFormat, setPrintFormat] = useState('a4'); // 'a4' or 'pos'
  const [activeActionTab, setActiveActionTab] = useState('settle'); // 'settle', 'discount', 'split'

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Add Item to Check States
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setCustomDiscount('');
    setDiscountType('flat');
    setSplitCount(1);
    setShowSplitResult(false);
    setCollectAmount('');
    setPaymentReference('');
    setActiveActionTab('settle');
  };

  const calculateTaxes = (amount, discount, gstRate = 18, serviceChargeRate = 0) => {
    const taxable = Math.max(0, amount - discount);
    const serviceCharge = (taxable * serviceChargeRate) / 100;
    const baseWithService = taxable + serviceCharge;
    const cgst = (baseWithService * (gstRate / 2)) / 100;
    const sgst = (baseWithService * (gstRate / 2)) / 100;
    const total = baseWithService + cgst + sgst;
    return { taxable, serviceCharge, cgst, sgst, total };
  };

  const handleUpdateTaxRates = (id, field, value) => {
    const updated = invoices.map(inv => {
      if (inv.id === id) {
        return { ...inv, [field]: value };
      }
      return inv;
    });
    setInvoices(updated);
    setSelectedInvoice(updated.find(inv => inv.id === id));
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    
    const taxes = calculateTaxes(
      selectedInvoice.amount, 
      selectedInvoice.discount, 
      selectedInvoice.gstRate, 
      selectedInvoice.serviceChargeRate
    );
    const grandTotal = Math.round(taxes.total);
    const remaining = grandTotal - selectedInvoice.paidAmount;
    
    const collectVal = parseFloat(collectAmount) || remaining;
    if (collectVal <= 0 || collectVal > remaining) {
      showToast('Invalid collection amount');
      return;
    }

    const updated = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const newPaid = inv.paidAmount + collectVal;
        const newStatus = newPaid >= grandTotal ? 'Paid' : 'Partial';
        const paymentRecord = {
          method: paymentMethod,
          amount: collectVal,
          reference: ['Card/UPI', 'Bank Transfer'].includes(paymentMethod) ? paymentReference : '',
          date: new Date().toISOString().split('T')[0]
        };
        showToast(`Collected ₹${collectVal.toLocaleString()} via ${paymentMethod}.`);
        return { 
          ...inv, 
          paidAmount: newPaid, 
          status: newStatus,
          payments: [...inv.payments, paymentRecord]
        };
      }
      return inv;
    });

    setInvoices(updated);
    setSelectedInvoice(updated.find(inv => inv.id === selectedInvoice.id));
    setCollectAmount('');
    setPaymentReference('');
  };

  const handleApplyDiscount = () => {
    if (!selectedInvoice) return;
    const discountVal = parseFloat(customDiscount) || 0;
    if (discountVal < 0) {
      showToast('Invalid discount amount');
      return;
    }

    let finalDiscountAmount = discountVal;
    if (discountType === 'percent') {
      finalDiscountAmount = (selectedInvoice.amount * discountVal) / 100;
    }

    if (finalDiscountAmount > selectedInvoice.amount) {
      showToast('Discount cannot exceed the base amount');
      return;
    }

    const updated = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return { ...inv, discount: finalDiscountAmount };
      }
      return inv;
    });
    setInvoices(updated);
    setSelectedInvoice(updated.find(inv => inv.id === selectedInvoice.id));
    showToast(`Discount of ₹${finalDiscountAmount.toLocaleString()} applied to invoice.`);
    setCustomDiscount('');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedInvoice || !newItemName || !newItemPrice) return;
    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) {
      showToast('Invalid item price');
      return;
    }

    const updated = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const updatedItems = [...inv.items, { name: newItemName, price }];
        const updatedAmount = inv.amount + price;
        return {
          ...inv,
          amount: updatedAmount,
          items: updatedItems
        };
      }
      return inv;
    });

    setInvoices(updated);
    setSelectedInvoice(updated.find(inv => inv.id === selectedInvoice.id));
    setNewItemName('');
    setNewItemPrice('');
    showToast(`Added "${newItemName}" (₹${price}) to check.`);
  };

  const handleDeleteItem = (itemIndex) => {
    if (!selectedInvoice) return;
    const itemToDelete = selectedInvoice.items[itemIndex];
    if (!itemToDelete) return;

    const updated = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const updatedItems = inv.items.filter((_, idx) => idx !== itemIndex);
        const updatedAmount = inv.amount - itemToDelete.price;
        const newDiscount = Math.min(inv.discount, updatedAmount);
        return {
          ...inv,
          amount: Math.max(0, updatedAmount),
          discount: newDiscount,
          items: updatedItems
        };
      }
      return inv;
    });

    setInvoices(updated);
    setSelectedInvoice(updated.find(inv => inv.id === selectedInvoice.id));
    showToast(`Removed "${itemToDelete.name}" from check.`);
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    if (!newGuestName || !newBillAmount) return;

    const baseAmount = parseFloat(newBillAmount);
    const parsedItems = newBillItems.trim()
      ? newBillItems.split(',').map(itemStr => {
          const clean = itemStr.trim();
          return { name: clean, price: Math.round(baseAmount / newBillItems.split(',').length) };
        })
      : [{ name: newBillType + ' Service Charge', price: baseAmount }];

    const newBill = {
      id: `INV-2026-0${invoices.length + 1}`,
      type: newBillType,
      guest: newGuestName,
      amount: baseAmount,
      room: newBillRoom,
      status: 'Unpaid',
      discount: 0,
      paidAmount: 0,
      gstRate: newBillType === 'POS Table' ? 5 : 18,
      serviceChargeRate: 0,
      items: parsedItems,
      payments: []
    };

    setInvoices([newBill, ...invoices]);
    setNewGuestName('');
    setNewBillAmount('');
    setNewBillItems('');
    setShowAddBillModal(false);
    showToast(`Invoice ${newBill.id} generated.`);
  };

  // Calculate KPI stats
  const outstandingDues = invoices.reduce((acc, inv) => {
    if (inv.status === 'Paid') return acc;
    const taxes = calculateTaxes(inv.amount, inv.discount, inv.gstRate, inv.serviceChargeRate);
    const grandTotal = Math.round(taxes.total);
    return acc + (grandTotal - inv.paidAmount);
  }, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const settlementsToday = invoices.reduce((acc, inv) => {
    const todayPayments = inv.payments
      .filter(p => p.date === todayStr)
      .reduce((sum, p) => sum + p.amount, 0);
    return acc + todayPayments;
  }, 0);

  const pendingChecksCount = invoices.filter(inv => inv.status !== 'Paid').length;

  const paymentShare = invoices.reduce((acc, inv) => {
    inv.payments.forEach(p => {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
    });
    return acc;
  }, { 'Cash': 0, 'Card/UPI': 0, 'Bank Transfer': 0, 'Room Charge': 0 });

  const totalShare = paymentShare['Cash'] + paymentShare['Card/UPI'] + paymentShare['Bank Transfer'] + paymentShare['Room Charge'] || 1;
  const cashPct = Math.round((paymentShare['Cash'] / totalShare) * 100);
  const cardPct = Math.round((paymentShare['Card/UPI'] / totalShare) * 100);
  const bankPct = Math.round((paymentShare['Bank Transfer'] / totalShare) * 100);
  const roomPct = Math.round((paymentShare['Room Charge'] / totalShare) * 100);

  // Filter and sort invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.room.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesType = typeFilter === 'All' || inv.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return b.id.localeCompare(a.id);
    } else if (sortBy === 'amount-desc') {
      const aTaxes = calculateTaxes(a.amount, a.discount, a.gstRate, a.serviceChargeRate);
      const bTaxes = calculateTaxes(b.amount, b.discount, b.gstRate, b.serviceChargeRate);
      return Math.round(bTaxes.total) - Math.round(aTaxes.total);
    } else if (sortBy === 'amount-asc') {
      const aTaxes = calculateTaxes(a.amount, a.discount, a.gstRate, a.serviceChargeRate);
      const bTaxes = calculateTaxes(b.amount, b.discount, b.gstRate, b.serviceChargeRate);
      return Math.round(aTaxes.total) - Math.round(bTaxes.total);
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-fadeIn relative lg:h-[calc(100vh-8rem)] lg:overflow-hidden lg:flex lg:flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-navy border border-gold text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-stone-900/10 animate-slideIn">
          <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Fixed Section on Desktop */}
      <div className="flex-shrink-0 space-y-6">
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

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="soft-card p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">Outstanding Dues</span>
              <span className="text-xl font-display font-bold text-navy mt-1 block">₹{outstandingDues.toLocaleString()}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-danger-pale flex items-center justify-center">
              <Coins className="w-5 h-5 text-danger" />
            </div>
          </div>

          <div className="soft-card p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">Settled Today</span>
              <span className="text-xl font-display font-bold text-success mt-1 block">₹{settlementsToday.toLocaleString()}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-success-pale flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </div>

          <div className="soft-card p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">Active Checks</span>
              <span className="text-xl font-display font-bold text-navy mt-1 block">{pendingChecksCount} pending</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gold-pale flex items-center justify-center">
              <Receipt className="w-5 h-5 text-gold" />
            </div>
          </div>

          <div className="soft-card p-5 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">Collection Share</span>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden flex bg-slate-100">
                  {paymentShare['Cash'] > 0 && <div className="h-full bg-gold" style={{ width: `${(paymentShare['Cash'] / totalShare) * 100}%` }} title={`Cash: ${cashPct}%`} />}
                  {paymentShare['Card/UPI'] > 0 && <div className="h-full bg-navy" style={{ width: `${(paymentShare['Card/UPI'] / totalShare) * 100}%` }} title={`Card/UPI: ${cardPct}%`} />}
                  {paymentShare['Bank Transfer'] > 0 && <div className="h-full bg-slate" style={{ width: `${(paymentShare['Bank Transfer'] / totalShare) * 100}%` }} title={`Bank Transfer: ${bankPct}%`} />}
                  {paymentShare['Room Charge'] > 0 && <div className="h-full bg-warning" style={{ width: `${(paymentShare['Room Charge'] / totalShare) * 100}%` }} title={`Room Charge: ${roomPct}%`} />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-3 pt-2 border-t border-border-cream/40 text-[9px] font-semibold text-charcoal">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block shrink-0" />
                <span className="text-slate">Cash:</span>
                <span className="font-bold">₹{paymentShare['Cash'].toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-navy inline-block shrink-0" />
                <span className="text-slate">UPI/Card:</span>
                <span className="font-bold">₹{paymentShare['Card/UPI'].toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left List of invoices */}
        <div className="lg:col-span-2 flex flex-col min-h-0 space-y-4">
          {/* Controls Bar */}
          <div className="soft-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
              <input
                type="text"
                placeholder="Search guest, invoice or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cream/10 border border-border-cream rounded-xl text-xs font-semibold focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate uppercase tracking-wider font-sans">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-cream/10 border border-border-cream rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate uppercase tracking-wider font-sans">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-cream/10 border border-border-cream rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Room Folio">Room Folio</option>
                  <option value="POS Table">POS Table</option>
                  <option value="Room Service">Room Service</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 bg-cream/10 border border-border-cream rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="amount-desc">Amount: High-Low</option>
                  <option value="amount-asc">Amount: Low-High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="soft-card p-6 shadow-sm flex-1 min-h-0 flex flex-col">
            <h3 className="font-display font-semibold text-lg text-navy mb-4 flex-shrink-0">Active & Pending Checks</h3>
            <div className="overflow-auto flex-1 min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 bg-white z-10 border-b border-border-cream text-[10px] font-bold text-slate uppercase tracking-wider">
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
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-xs text-slate font-semibold">
                        No active checks found matching your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const taxes = calculateTaxes(inv.amount, inv.discount, inv.gstRate, inv.serviceChargeRate);
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
                                : inv.status === 'Partial'
                                ? 'bg-blue-50 text-blue-800 border border-blue-300/40'
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
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <div className="sticky top-6 soft-card p-4 border border-border-cream lg:max-h-full lg:overflow-y-auto max-h-none overflow-visible flex flex-col justify-between flex-1 min-h-0">
            {selectedInvoice ? (
            <div className="space-y-3.5 flex flex-col justify-between flex-1 min-h-0">
              <div className="flex justify-between items-start border-b border-border-cream pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate">{selectedInvoice.type}</span>
                  <h3 className="font-mono font-bold text-lg text-navy mt-1">{selectedInvoice.id}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedInvoice.status === 'Paid' 
                    ? 'bg-success/10 text-success border border-success/20' 
                    : selectedInvoice.status === 'Partial'
                    ? 'bg-blue-50 text-blue-800 border border-blue-300/40'
                    : 'bg-warning-pale text-warning border border-warning/20'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>

              {/* Dynamic Tax Configuration Toggles */}
              {selectedInvoice.status !== 'Paid' && (
                <div className="grid grid-cols-2 gap-2 p-2 bg-cream/10 border border-border-cream/50 rounded-2xl text-[10px]">
                  <div className="space-y-1">
                    <label className="font-bold text-navy uppercase block">GST Setup</label>
                    <select
                      value={selectedInvoice.gstRate}
                      onChange={(e) => handleUpdateTaxRates(selectedInvoice.id, 'gstRate', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-border-cream rounded-lg focus:outline-none focus:border-gold"
                    >
                      <option value="18">Standard (18%)</option>
                      <option value="5">F&B (5%)</option>
                      <option value="0">Exempt (0%)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-navy uppercase block">Service Charge</label>
                    <select
                      value={selectedInvoice.serviceChargeRate}
                      onChange={(e) => handleUpdateTaxRates(selectedInvoice.id, 'serviceChargeRate', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-border-cream rounded-lg focus:outline-none focus:border-gold"
                    >
                      <option value="0">None (0%)</option>
                      <option value="5">Optional (5%)</option>
                      <option value="10">Standard (10%)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Charges Breakdown */}
              <div className="space-y-2">
                <span className="text-slate text-[10px] font-bold uppercase tracking-wider block">Charges Breakdown</span>
                <div className="bg-white p-3 rounded-2xl border border-border-cream/60 space-y-2 max-h-48 overflow-y-auto">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-xs group py-1 border-b border-border-cream/30 last:border-0">
                      <span className="text-slate font-medium">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-charcoal font-bold">₹{item.price.toLocaleString()}</span>
                        {selectedInvoice.status !== 'Paid' && (
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="text-danger hover:text-danger/80 p-0.5 rounded hover:bg-danger-pale transition-all opacity-60 group-hover:opacity-100"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Add Item Form */}
                {selectedInvoice.status !== 'Paid' && (
                  <form onSubmit={handleAddItem} className="bg-white/80 p-3 rounded-2xl border border-dashed border-border-cream space-y-2">
                    <span className="text-[9px] font-bold text-navy uppercase block">Add Charge Item</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Extra Bed)"
                        required
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-border-cream rounded-lg text-xs font-semibold focus:outline-none focus:border-gold"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        required
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-border-cream rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-gold"
                      />
                      <button
                        type="submit"
                        className="px-2.5 bg-navy text-white hover:bg-navy/90 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Guest metadata */}
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate font-medium">Customer:</span>
                  <span className="text-charcoal">{selectedInvoice.guest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate font-medium">Location:</span>
                  <span className="text-charcoal">{selectedInvoice.room}</span>
                </div>
                <div className="flex justify-between border-t border-border-cream/50 pt-2">
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
                  const taxes = calculateTaxes(
                    selectedInvoice.amount, 
                    selectedInvoice.discount, 
                    selectedInvoice.gstRate, 
                    selectedInvoice.serviceChargeRate
                  );
                  const grandTotal = Math.round(taxes.total);
                  const remaining = Math.max(0, grandTotal - selectedInvoice.paidAmount);
                  return (
                    <>
                      {taxes.serviceCharge > 0 && (
                        <div className="flex justify-between text-slate font-medium text-[11px]">
                          <span>Service Charge ({selectedInvoice.serviceChargeRate}%):</span>
                          <span className="font-mono">₹{taxes.serviceCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate font-medium text-[11px]">
                        <span>CGST ({(selectedInvoice.gstRate / 2)}%):</span>
                        <span className="font-mono">₹{taxes.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate font-medium text-[11px]">
                        <span>SGST ({(selectedInvoice.gstRate / 2)}%):</span>
                        <span className="font-mono">₹{taxes.sgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-navy pb-1 pt-1.5 text-[13px] font-bold text-navy">
                        <span>Grand Total (Net):</span>
                        <span className="font-mono">₹{grandTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-success text-[11px]">
                        <span>Total Paid so far:</span>
                        <span className="font-mono">₹{selectedInvoice.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-navy font-bold text-xs border-t border-dashed border-border-cream/80 pt-1.5">
                        <span>Balance Due:</span>
                        <span className="font-mono">₹{remaining.toLocaleString()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Active Actions */}
              {selectedInvoice.status !== 'Paid' ? (
                <div className="space-y-4 pt-4 border-t border-border-cream">
                  {/* Tab Selector */}
                  <div className="flex bg-surface-linen p-1 rounded-xl border border-border-cream">
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('settle')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        activeActionTab === 'settle' ? 'bg-navy text-white shadow-sm' : 'text-slate hover:text-navy'
                      }`}
                    >
                      Settle Dues
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('discount')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        activeActionTab === 'discount' ? 'bg-navy text-white shadow-sm' : 'text-slate hover:text-navy'
                      }`}
                    >
                      Discount
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('split')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        activeActionTab === 'split' ? 'bg-navy text-white shadow-sm' : 'text-slate hover:text-navy'
                      }`}
                    >
                      Split Bill
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {activeActionTab === 'settle' && (
                    /* Record Partial / Split Payment Form */
                    <form onSubmit={handleRecordPayment} className="space-y-2.5 p-3 bg-cream/15 border border-border-cream/50 rounded-2xl animate-fadeIn">
                      <label className="text-[9px] font-bold text-navy uppercase block">Record Payment Settlement</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[8px] text-slate font-bold uppercase block mb-1">Amount (₹)</span>
                          <input 
                            type="number"
                            placeholder="All remaining"
                            value={collectAmount}
                            onChange={(e) => setCollectAmount(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-border-cream rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <span className="text-[8px] text-slate font-bold uppercase block mb-1">Method</span>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-border-cream rounded-lg text-xs font-semibold focus:outline-none focus:border-gold"
                          >
                            <option value="Cash">Cash</option>
                            <option value="Card/UPI">Card/UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Room Charge">Room Charge</option>
                          </select>
                        </div>
                      </div>

                      {/* Conditional Reference Input */}
                      {['Card/UPI', 'Bank Transfer'].includes(paymentMethod) && (
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate font-bold uppercase block">Transaction Reference / ID</span>
                          <input 
                            type="text"
                            placeholder="e.g. TXN-192830"
                            required
                            value={paymentReference}
                            onChange={(e) => setPaymentReference(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-border-cream rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-gold"
                          />
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-2 bg-navy text-white hover:bg-navy/90 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-gold" /> Collect Payment
                      </button>
                    </form>
                  )}

                  {activeActionTab === 'discount' && (
                    /* Apply Discount Field */
                    <div className="space-y-2 p-3 bg-cream/15 border border-border-cream/50 rounded-2xl animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold text-navy uppercase block">Apply Discount</label>
                        <div className="flex bg-white border border-border-cream rounded-lg overflow-hidden p-0.5 text-[8px] font-bold">
                          <button
                            type="button"
                            onClick={() => setDiscountType('flat')}
                            className={`px-2 py-0.5 rounded ${discountType === 'flat' ? 'bg-navy text-white' : 'text-slate'}`}
                          >
                            Flat (₹)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDiscountType('percent')}
                            className={`px-2 py-0.5 rounded ${discountType === 'percent' ? 'bg-navy text-white' : 'text-slate'}`}
                          >
                            Percent (%)
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder={discountType === 'flat' ? "e.g. 200" : "e.g. 10"}
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
                  )}

                  {activeActionTab === 'split' && (
                    /* Split Bill Calculator */
                    <div className="space-y-2 p-3 bg-cream/15 border border-border-cream/50 rounded-2xl animate-fadeIn">
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
                          Each Share: ₹{Math.round(calculateTaxes(selectedInvoice.amount, selectedInvoice.discount, selectedInvoice.gstRate, selectedInvoice.serviceChargeRate).total / splitCount).toLocaleString()} (for {splitCount} guests)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-border-cream text-center text-xs font-semibold">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="font-bold text-charcoal">Invoice Fully Settled</p>
                </div>
              )}

              {/* View/Print Receipt trigger (always show if any payments made) */}
              {(selectedInvoice.paidAmount > 0 || selectedInvoice.status === 'Paid') && (
                <button 
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> View & Print Receipt
                </button>
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
    </div>

      {showAddBillModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-border-cream p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Generate Quick Check</h3>
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">Bill Items (comma-separated, optional)</label>
                <textarea 
                  placeholder="e.g. 2x Butter Chicken, 1x Veg Biryani"
                  value={newBillItems}
                  onChange={(e) => setNewBillItems(e.target.value)}
                  className="w-full px-4 py-2 bg-cream/10 border border-border-cream rounded-xl focus:outline-none focus:border-gold text-xs font-semibold h-16 resize-none"
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

      {/* Receipt Preview Modal */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white rounded-[2rem] border border-border-cream p-8 w-full ${printFormat === 'pos' ? 'max-w-md' : 'max-w-2xl'} shadow-2xl relative max-h-[90vh] overflow-y-auto print:p-0 print:shadow-none print:border-none`}>
            {/* Dynamic Print CSS */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                /* Hide everything in the body by default */
                body * {
                  visibility: hidden !important;
                }
                /* Show ONLY the printable invoice area and its children */
                #printable-area, #printable-area * {
                  visibility: visible !important;
                }
                /* Absolute position to print start */
                #printable-area {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: ${printFormat === 'pos' ? '80mm' : '100%'} !important;
                  margin: 0 auto !important;
                  padding: 10px !important;
                  font-family: ${printFormat === 'pos' ? 'monospace' : 'sans-serif'} !important;
                }
                /* Allow page breaks and remove scrolling containers limitations during print */
                html, body, #root, #root *, .fixed, .relative, .overflow-y-auto {
                  height: auto !important;
                  max-height: none !important;
                  overflow: visible !important;
                }
              }
            `}} />

            {/* Close button - hidden on print */}
            <button 
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-6 right-6 text-slate hover:text-navy transition-colors print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Format Selector Tab Bar - Hidden on print */}
            <div className="flex justify-center border-b border-border-cream pb-4 mb-6 print:hidden">
              <div className="flex bg-surface-linen/50 p-1 rounded-xl border border-border-cream">
                <button
                  type="button"
                  onClick={() => setPrintFormat('a4')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    printFormat === 'a4' ? 'bg-navy text-white shadow-sm' : 'text-slate hover:text-navy'
                  }`}
                >
                  Standard A4 Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('pos')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    printFormat === 'pos' ? 'bg-navy text-white shadow-sm' : 'text-slate hover:text-navy'
                  }`}
                >
                  3" POS Receipt
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div id="printable-area" className="space-y-6">
              {printFormat === 'a4' ? (
                /* ---------------- STANDARD A4 FORMAT ---------------- */
                <div className="space-y-6 font-sans">
                  {/* Receipt Header */}
                  <div className="flex justify-between items-start border-b border-border-cream pb-6">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-navy">HOTELORAA</h2>
                      <p className="text-[10px] text-slate font-gold font-bold uppercase tracking-wider mt-1">Luxury PMS & POS Suite</p>
                    </div>
                    <div className="text-right text-xs">
                      <h3 className="font-bold text-navy text-sm uppercase">Guest Invoice</h3>
                      <p className="text-slate mt-1 font-mono">{selectedInvoice.id}</p>
                      <p className="text-slate font-mono">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Guest & Vendor Info */}
                  <div className="grid grid-cols-2 gap-6 text-xs border-b border-border-cream pb-6">
                    <div>
                      <h4 className="font-bold text-navy uppercase tracking-wider mb-2">Billed To:</h4>
                      <p className="font-bold text-charcoal">{selectedInvoice.guest}</p>
                      <p className="text-slate mt-0.5">{selectedInvoice.room}</p>
                    </div>
                    <div className="text-right">
                      <h4 className="font-bold text-navy uppercase tracking-wider mb-2">Property Address:</h4>
                      <p className="font-bold text-charcoal">Royal Palace Hotel</p>
                      <p className="text-slate mt-0.5">VIP Road, New Delhi, India</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-navy text-xs uppercase tracking-wider">Line Items</h4>
                    <div className="border border-border-cream rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-cream/20 text-navy font-bold border-b border-border-cream">
                            <th className="p-3">Description</th>
                            <th className="p-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-cream/30">
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="p-3 text-slate font-medium">{item.name}</td>
                              <td className="p-3 text-right font-mono font-bold text-charcoal">₹{item.price.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total calculations */}
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="text-xs space-y-2">
                      <h4 className="font-bold text-navy uppercase tracking-wider">Settlement Ledger</h4>
                      {selectedInvoice.payments.length === 0 ? (
                        <p className="text-slate italic">No payments recorded yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {selectedInvoice.payments.map((p, i) => (
                            <div key={i} className="bg-cream/5 p-2 rounded-xl border border-border-cream/40 text-[11px]">
                              <div className="flex justify-between text-slate font-semibold">
                                <span>{p.method}</span>
                                <span className="font-mono text-charcoal font-bold">₹{p.amount.toLocaleString()}</span>
                              </div>
                              {p.reference && (
                                <p className="text-[9px] text-slate font-mono mt-0.5">Ref: {p.reference}</p>
                              )}
                              <p className="text-[9px] text-slate/60 mt-0.5">{p.date}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between text-slate font-medium">
                        <span>Subtotal:</span>
                        <span className="font-mono">₹{selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between text-danger font-medium">
                          <span>Discount:</span>
                          <span className="font-mono">-₹{selectedInvoice.discount.toLocaleString()}</span>
                        </div>
                      )}
                      {(() => {
                        const taxes = calculateTaxes(
                          selectedInvoice.amount, 
                          selectedInvoice.discount, 
                          selectedInvoice.gstRate, 
                          selectedInvoice.serviceChargeRate
                        );
                        const grandTotal = Math.round(taxes.total);
                        const remaining = Math.max(0, grandTotal - selectedInvoice.paidAmount);
                        return (
                          <>
                            {taxes.serviceCharge > 0 && (
                              <div className="flex justify-between text-slate font-medium">
                                <span>Service Charge ({selectedInvoice.serviceChargeRate}%):</span>
                                <span className="font-mono">₹{taxes.serviceCharge.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate font-medium">
                              <span>CGST ({(selectedInvoice.gstRate / 2)}%):</span>
                              <span className="font-mono">₹{taxes.cgst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate font-medium">
                              <span>SGST ({(selectedInvoice.gstRate / 2)}%):</span>
                              <span className="font-mono">₹{taxes.sgst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-navy pt-2 text-sm font-bold text-navy">
                              <span>Grand Total:</span>
                              <span className="font-mono">₹{grandTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-success font-bold text-xs pt-1">
                              <span>Total Paid:</span>
                              <span className="font-mono">₹{selectedInvoice.paidAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-navy font-bold text-xs border-t border-dashed border-border-cream pt-1">
                              <span>Balance Due:</span>
                              <span className="font-mono">₹{remaining.toLocaleString()}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Watermark/Footer */}
                  <div className="border-t border-border-cream pt-6 text-center text-[10px] text-slate font-semibold uppercase tracking-wider">
                    Thank you for staying with us! • Powered by Hoteloraa SaaS
                  </div>
                </div>
              ) : (
                /* ---------------- 3" POS THERMAL SLIP ---------------- */
                <div className="font-mono text-xs text-charcoal space-y-4 max-w-[320px] mx-auto p-4 border border-dashed border-slate-300 rounded-xl bg-stone-50/50 print:bg-white print:border-0 print:p-0">
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-lg text-navy tracking-wider">HOTELORAA</h3>
                    <p className="text-[9px] uppercase text-slate font-bold">Royal Palace Hotel - F&B POS</p>
                    <p className="text-[9px] text-slate">VIP Road, New Delhi, India</p>
                    <p className="text-[10px] border-b border-dashed border-slate-300 py-1">--------------------------------</p>
                  </div>

                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between">
                      <span>Receipt No:</span>
                      <span className="font-bold">{selectedInvoice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date/Time:</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guest/Table:</span>
                      <span>{selectedInvoice.guest} / {selectedInvoice.room}</span>
                    </div>
                    <p className="text-[10px] border-b border-dashed border-slate-300 py-1">--------------------------------</p>
                  </div>

                  {/* POS Items List */}
                  <div className="space-y-1.5 text-[11px]">
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-bold">₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <p className="text-[10px] border-b border-dashed border-slate-300 py-1">--------------------------------</p>
                  </div>

                  {/* POS Calculation block */}
                  {(() => {
                    const taxes = calculateTaxes(
                      selectedInvoice.amount, 
                      selectedInvoice.discount, 
                      selectedInvoice.gstRate, 
                      selectedInvoice.serviceChargeRate
                    );
                    const grandTotal = Math.round(taxes.total);
                    const remaining = Math.max(0, grandTotal - selectedInvoice.paidAmount);
                    return (
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{selectedInvoice.amount.toFixed(2)}</span>
                        </div>
                        {selectedInvoice.discount > 0 && (
                          <div className="flex justify-between text-danger">
                            <span>Discount:</span>
                            <span>-₹{selectedInvoice.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {taxes.serviceCharge > 0 && (
                          <div className="flex justify-between">
                            <span>Svc Chg ({selectedInvoice.serviceChargeRate}%):</span>
                            <span>₹{taxes.serviceCharge.toFixed(2)}</span>
                          </div>
                        )}
                        {selectedInvoice.gstRate > 0 && (
                          <div className="flex justify-between">
                            <span>GST ({selectedInvoice.gstRate}%):</span>
                            <span>₹{(taxes.cgst + taxes.sgst).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-navy text-xs border-t border-dashed border-slate-300 pt-1.5">
                          <span>GRAND TOTAL:</span>
                          <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-success">
                          <span>TOTAL PAID:</span>
                          <span>₹{selectedInvoice.paidAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-navy border-t border-double border-slate-300 pt-1">
                          <span>BALANCE DUE:</span>
                          <span>₹{remaining.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <p className="text-[10px] border-b border-dashed border-slate-300 py-1">--------------------------------</p>

                  {/* Settlements detail */}
                  {selectedInvoice.payments.length > 0 && (
                    <div className="space-y-1 text-[10px]">
                      <span className="font-bold text-navy block uppercase tracking-wider text-[9px]">Transactions Ledger:</span>
                      {selectedInvoice.payments.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-slate font-medium">
                          <span>{p.method} {p.reference ? `(Ref: ${p.reference})` : ''}:</span>
                          <span>₹{p.amount.toFixed(2)}</span>
                        </div>
                      ))}
                      <p className="text-[10px] border-b border-dashed border-slate-300 py-1">--------------------------------</p>
                    </div>
                  )}

                  <div className="text-center text-[10px] space-y-1 pt-1">
                    <p className="font-bold uppercase tracking-wider">Thank You!</p>
                    <p className="text-[9px] text-slate">Please Visit Again</p>
                  </div>
                </div>
              )}
            </div>

            {/* Print/Dismiss buttons - hidden on print */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-border-cream print:hidden">
              <button 
                type="button"
                onClick={() => window.print()}
                className="w-1/2 btn-primary flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4 text-gold" /> Print Receipt
              </button>
              <button 
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="w-1/2 btn-secondary"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;
