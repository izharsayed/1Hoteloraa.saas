import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';

function SuperAdminLayout() {
  const userJson = localStorage.getItem('user');
  let user = { name: 'Global Administrator', userRole: 'SUPER_ADMIN' };
  try {
    if (userJson) user = JSON.parse(userJson);
  } catch (e) {}

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top subtle border header for Super Admin branding/status */}
        <header className="h-16 border-b border-border-cream bg-white/70 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 bg-gold-pale border border-gold/30 rounded text-gold font-semibold uppercase tracking-wider">
              Cluster Controller Node
            </span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-charcoal">{user.name}</p>
              <p className="text-[10px] text-gold font-medium">Global Role</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-navy text-gold font-display font-bold flex items-center justify-center border border-gold/20 shadow-inner">
              {initials}
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
