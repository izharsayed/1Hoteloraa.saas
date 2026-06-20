import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bed,
  CalendarRange,
  UserCheck,
  FileSpreadsheet,
  Sparkles,
  UtensilsCrossed, 
  ChefHat, 
  BookOpen,
  Receipt, 
  PackageSearch, 
  Users, 
  TrendingUp,
  Settings,
  LogOut,
  ShieldAlert
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  let user = { name: 'Staff', userRole: 'WAITER', businessType: 'HOTEL_RESTAURANT' };
  try {
    if (userJson) user = JSON.parse(userJson);
  } catch (e) {}

  const businessType = user.businessType || 'HOTEL_RESTAURANT';
  const role = user.userRole;

  const rawNavigation = [
    {
      category: 'General',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Reports & Analytics', path: '/reports', icon: TrendingUp },
      ]
    },
    {
      category: 'Lodging Operations',
      items: [
        { name: 'Rooms Directory', path: '/rooms', icon: Bed },
        { name: 'Reservations', path: '/reservations', icon: CalendarRange },
        { name: 'Front Desk Check-In', path: '/checkin', icon: UserCheck },
        { name: 'Folios & Check-Out', path: '/checkout', icon: FileSpreadsheet },
        { name: 'Housekeeping', path: '/housekeeping', icon: Sparkles },
      ]
    },
    {
      category: 'Restaurant & POS',
      items: [
        { name: 'Table Seating', path: '/tables', icon: UtensilsCrossed },
        { name: 'Kitchen KOT', path: '/kitchen', icon: ChefHat },
        { name: 'POS Menu Manager', path: '/menu', icon: BookOpen },
        { name: 'POS Billing', path: '/billing', icon: Receipt },
      ]
    },
    {
      category: 'Administration',
      items: [
        { name: 'Inventory & Stock', path: '/inventory', icon: PackageSearch },
        { name: 'CRM & Guests', path: '/crm', icon: Users },
        { name: 'Platform Settings', path: '/settings', icon: Settings, roles: ['TENANT_ADMIN', 'MANAGER'] },
        { name: 'Manager Control', path: '/manager', icon: UserCheck, roles: ['TENANT_ADMIN', 'MANAGER'] },
        { name: 'Super Admin Control', path: '/superadmin', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
      ]
    }
  ];

  const navigation = rawNavigation
    .filter((group) => {
      if (group.category === 'Lodging Operations' && businessType === 'RESTAURANT') return false;
      if (group.category === 'Restaurant & POS' && businessType === 'LODGING') return false;
      return true;
    })
    .map((group) => {
      return {
        ...group,
        items: group.items.filter((item) => {
          if (item.roles && !item.roles.includes(role)) return false;
          return true;
        })
      };
    })
    .filter((group) => group.items.length > 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-surface-linen border-r border-border-cream flex flex-col h-full select-none shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border-cream bg-white/40 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Hoteloraa Logo" className="h-9 w-auto object-contain" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {navigation.map((group) => (
          <div key={group.category} className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate uppercase tracking-wider px-3 mb-1">
              {group.category}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
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
                        <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-gold' : 'text-slate group-hover:text-navy'}`} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border-cream bg-white/20 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger font-medium text-xs hover:bg-danger-pale hover:text-danger active:scale-98 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Platform</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
