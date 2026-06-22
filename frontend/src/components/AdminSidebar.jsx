import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Settings, 
  Sliders, 
  Building2, 
  LogOut,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

function AdminSidebar({ collapsed, onToggle }) {
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
    <aside 
      className={`
        ${collapsed ? 'w-16' : 'w-64'} 
        bg-navy border-r border-navy/20 flex flex-col h-full select-none shrink-0 text-white
        transition-all duration-300 ease-in-out overflow-hidden
      `}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-white/10 shrink-0 bg-[#071527]">
        {/* Logo — hidden when collapsed */}
        <div
          className={`flex items-center gap-3 cursor-pointer overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
          onClick={() => navigate('/admin')}
        >
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-display font-bold text-navy shrink-0">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-display font-bold text-sm tracking-tight text-white leading-none">Hoteloraa</h1>
            <span className="text-[9px] font-bold text-gold/80 tracking-widest uppercase mt-1 block text-ellipsis overflow-hidden whitespace-nowrap">Tenant Admin</span>
          </div>
        </div>

        {/* Hamburger toggle button */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            flex items-center justify-center w-9 h-9 rounded-xl
            text-white/75 hover:text-white hover:bg-white/10 active:scale-95
            transition-all duration-200 shrink-0
            ${collapsed ? 'mx-auto' : 'ml-auto'}
          `}
        >
          {collapsed ? (
            <Menu className="w-5 h-5" strokeWidth={2} />
          ) : (
            <X className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-xl font-medium text-xs transition-all duration-200 group
                ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
                ${isActive 
                  ? 'bg-gold text-navy font-bold shadow-md shadow-gold/10' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isActive ? 'text-navy' : 'text-white/60 group-hover:text-white'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-white/10 bg-[#071527] shrink-0">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Exit Panel' : undefined}
          className={`
            w-full flex items-center gap-3 rounded-xl text-red-400 font-bold text-xs
            hover:bg-red-500/10 hover:text-red-300 active:scale-98 transition-all
            ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
          `}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Exit Panel</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
