import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Coffee } from 'lucide-react';

function WaiterLayout() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  let user = { name: 'Waiter Staff', userRole: 'WAITER', tenantName: 'Hoteloraa Property Node' };
  try {
    if (userJson) user = JSON.parse(userJson);
  } catch (e) {}

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'WT';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-border-cream bg-navy flex items-center justify-between px-6 z-10 shrink-0 text-white shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/waiter')}>
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-display font-bold text-navy">
            W
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-white leading-none">Hoteloraa</h1>
            <span className="text-[9px] font-bold text-gold/80 tracking-widest uppercase mt-1 block">Waiter POS Ordering</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-white/90">{user.name}</p>
            <p className="text-[9px] text-gold/80 font-bold uppercase tracking-wider">{user.tenantName || 'Live Property'}</p>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-gold text-navy font-display font-bold flex items-center justify-center border border-white/20 shadow-inner">
            {initials}
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-red-400 hover:bg-white/5 rounded-xl transition-all"
            title="Exit Platform"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 relative min-h-0">
        <Outlet />
      </main>
    </div>
  );
}

export default WaiterLayout;
