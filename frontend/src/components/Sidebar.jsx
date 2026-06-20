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
  ShieldAlert,
  ClipboardList,
  ShoppingCart,
  Truck,
  Store,
  UserCog,
  Shield,
} from 'lucide-react';
import { MODULE_ACCESS } from '../utils/permissions';

function Sidebar() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  let user = { name: 'Staff', userRole: 'WAITER', businessType: 'HOTEL_RESTAURANT' };
  try {
    if (userJson) user = JSON.parse(userJson);
  } catch (e) {}

  const businessType = user.businessType || 'HOTEL_RESTAURANT';
  const role = user.userRole;

  // Check if role is allowed for a given module key
  const can = (moduleKey) => {
    if (role === 'SUPER_ADMIN' || role === 'TENANT_ADMIN') return true;
    const allowed = MODULE_ACCESS[moduleKey] || [];
    return allowed.includes(role);
  };

  const rawNavigation = [
    {
      category: 'General',
      items: [
        { name: 'Dashboard',         path: '/',        icon: LayoutDashboard, module: 'dashboard' },
        { name: 'Reports & Analytics', path: '/reports', icon: TrendingUp,   module: 'reports' },
      ]
    },
    {
      category: 'Lodging Operations',
      businessTypes: ['HOTEL', 'HOTEL_RESTAURANT'],
      items: [
        { name: 'Rooms Directory',       path: '/rooms',        icon: Bed,           module: 'rooms' },
        { name: 'Reservations',          path: '/reservations', icon: CalendarRange,  module: 'reservations' },
        { name: 'Front Desk Check-In',   path: '/checkin',      icon: UserCheck,      module: 'rooms' },
        { name: 'Folios & Check-Out',    path: '/checkout',     icon: FileSpreadsheet,module: 'rooms' },
        { name: 'Housekeeping',          path: '/housekeeping', icon: Sparkles,       module: 'housekeeping' },
        { name: 'Guests & CRM',          path: '/crm',          icon: Users,          module: 'guests' },
      ]
    },
    {
      category: 'Restaurant & POS',
      businessTypes: ['RESTAURANT', 'HOTEL_RESTAURANT'],
      items: [
        { name: 'Table Seating',     path: '/tables',   icon: UtensilsCrossed, module: 'tables' },
        { name: 'Kitchen KOT',       path: '/kitchen',  icon: ChefHat,         module: 'kot' },
        { name: 'Orders',            path: '/billing',  icon: ClipboardList,   module: 'orders' },
        { name: 'POS Menu Manager',  path: '/menu',     icon: BookOpen,        module: 'pos' },
        { name: 'POS Billing',       path: '/pos',      icon: Store,           module: 'pos' },
      ]
    },
    {
      category: 'Procurement',
      items: [
        { name: 'Inventory & Stock', path: '/inventory', icon: PackageSearch, module: 'inventory' },
        { name: 'Vendors',           path: '/vendors',   icon: Truck,          module: 'vendors' },
        { name: 'Purchase Orders',   path: '/purchases', icon: ShoppingCart,   module: 'purchases' },
      ]
    },
    {
      category: 'Administration',
      items: [
        { name: 'Platform Settings',   path: '/settings',   icon: Settings,     module: 'settings' },
        { name: 'User Management',     path: '/admin/users', icon: UserCog,      module: 'users' },
        { name: 'Roles & Permissions', path: '/admin/rbac',  icon: Shield,       module: 'roles' },
        { name: 'Super Admin Control', path: '/superadmin',  icon: ShieldAlert,  roles: ['SUPER_ADMIN'] },
      ]
    }
  ];

  const navigation = rawNavigation
    .filter((group) => {
      // Filter by business type if specified
      if (group.businessTypes) {
        if (!group.businessTypes.includes(businessType)) return false;
      }
      return true;
    })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        // Hard-coded role override (e.g. SUPER_ADMIN link)
        if (item.roles) return item.roles.includes(role);
        // Module-based access check
        if (item.module) return can(item.module);
        return true;
      })
    }))
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
