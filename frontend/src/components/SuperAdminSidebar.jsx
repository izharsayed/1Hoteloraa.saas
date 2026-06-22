import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  Users,
  LogOut 
} from 'lucide-react';

function SuperAdminSidebar() {
  const navigate = useNavigate();

  const navigation = [
    { name: 'Cluster Overview', path: '/superadmin', icon: Activity },
    { name: 'Tenants Registry', path: '/superadmin/tenants', icon: Building2 },
    { name: 'Subscription Plans', path: '/superadmin/subscriptions', icon: CreditCard },
    { name: 'Platform Users', path: '/superadmin/users', icon: Users },
    { name: 'Global RBAC Panel', path: '/superadmin/rbac', icon: ShieldCheck },
    { name: 'System Audit Logs', path: '/superadmin/logs', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#0B1F3A] border-r border-navy/20 flex flex-col h-full select-none shrink-0 text-white">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0 bg-[#071527]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/superadmin')}>
          <img src="/logo.png" alt="Hoteloraa Logo" className="h-8 w-auto object-contain shrink-0 brightness-0 invert" />
          <span className="text-[9px] font-bold text-gold/80 tracking-widest uppercase shrink-0 border-l border-white/20 pl-3">Super Admin</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/superadmin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs transition-all duration-200 group
                ${isActive 
                  ? 'bg-gold text-navy font-bold shadow-md shadow-gold/10' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-navy' : 'text-white/60 group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 bg-[#071527] shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-bold text-xs hover:bg-red-500/10 hover:text-red-300 active:scale-98 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Portal</span>
        </button>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;
