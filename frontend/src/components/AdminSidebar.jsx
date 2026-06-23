import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Settings, 
  Sliders, 
  Building2, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

function AdminSidebar() {
  const navigate = useNavigate();

  const navigation = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Staff Registry', path: '/admin/users', icon: Users },
    { name: 'Roles & Permissions', path: '/admin/rbac', icon: Shield },
    { name: 'Feature Toggles', path: '/admin/features', icon: Sliders },
    { name: 'Tenant Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-surface-linen border-r border-border-cream flex flex-col h-full select-none shrink-0 transition-all duration-300 ease-in-out overflow-hidden">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-border-cream bg-white/40 shrink-0">
        <div 
          className="flex items-center gap-3 cursor-pointer overflow-hidden transition-all duration-300 w-auto opacity-100" 
          onClick={() => navigate('/admin')}
        >
          <img src="/logo.png" alt="Hoteloraa Logo" className="h-9 w-auto object-contain shrink-0" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 group
                ${isActive 
                  ? 'bg-gold-pale text-navy border-l-4 border-gold shadow-sm font-semibold' 
                  : 'text-slate hover:bg-white/50 hover:text-navy'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isActive ? 'text-gold' : 'text-slate group-hover:text-navy'}`} />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-border-cream bg-white/20 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger font-medium text-xs hover:bg-danger-pale hover:text-danger active:scale-98 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Exit Panel</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
