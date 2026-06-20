import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tables from './pages/Tables.jsx';
import Kitchen from './pages/Kitchen.jsx';
import Billing from './pages/Billing.jsx';
import Inventory from './pages/Inventory.jsx';
import CRM from './pages/CRM.jsx';
import Rooms from './pages/Rooms.jsx';
import Reservations from './pages/Reservations.jsx';
import CheckIn from './pages/CheckIn.jsx';
import CheckOut from './pages/CheckOut.jsx';
import Housekeeping from './pages/Housekeeping.jsx';
import Menu from './pages/Menu.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import SuperAdminLayout from './components/SuperAdminLayout.jsx';
import SuperAdminOverview from './pages/SuperAdminOverview.jsx';
import SuperAdminTenants from './pages/SuperAdminTenants.jsx';
import SuperAdminSubscriptions from './pages/SuperAdminSubscriptions.jsx';
import SuperAdminUsers from './pages/SuperAdminUsers.jsx';
import SuperAdminRBAC from './pages/SuperAdminRBAC.jsx';
import SuperAdminLogs from './pages/SuperAdminLogs.jsx';
import Manager from './pages/Manager.jsx';

// Admin Imports
import AdminLayout from './components/AdminLayout.jsx';
import AdminOverview from './pages/AdminOverview.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminRBAC from './pages/AdminRBAC.jsx';
import AdminFeatures from './pages/AdminFeatures.jsx';
import AdminSettings from './pages/AdminSettings.jsx';

// Waiter Imports
import WaiterLayout from './components/WaiterLayout.jsx';
import Waiter from './pages/Waiter.jsx';

// Dashboard layout wrapping sidebar and content
function DashboardLayout() {
  const userJson = localStorage.getItem('user');
  let user = { name: 'Staff Member', userRole: 'Staff' };
  try {
    if (userJson) user = JSON.parse(userJson);
  } catch (e) {}

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'US';

  const roleLabel = user.userRole
    ? user.userRole.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : '';

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top subtle border header */}
        <header className="h-16 border-b border-border-cream bg-white/70 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-1 bg-gold-pale border border-gold/30 rounded text-gold font-semibold uppercase tracking-wider">
              {user.tenantName || 'Live Environment'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-charcoal">{user.name}</p>
              <p className="text-[10px] text-slate font-medium">{roleLabel}</p>
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

// ProtectedRoute to enforce authentication & authorization
function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);
    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
      if (user.userRole === 'SUPER_ADMIN') {
        return <Navigate to="/superadmin" replace />;
      }
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Shell Routes (Protected for standard tenant users) */}
        <Route element={<ProtectedRoute allowedRoles={['TENANT_ADMIN', 'MANAGER', 'RECEPTIONIST', 'WAITER', 'CHEF', 'HOUSEKEEPING', 'ACCOUNTANT', 'CASHIER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/housekeeping" element={<Housekeeping />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manager" element={<Manager />} />
          </Route>
        </Route>

        {/* Tenant Admin Shell Routes (Protected for Tenant Admin only) */}
        <Route element={<ProtectedRoute allowedRoles={['TENANT_ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/rbac" element={<AdminRBAC />} />
            <Route path="/admin/features" element={<AdminFeatures />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Waiter Shell Routes (Protected for Waiter only) */}
        <Route element={<ProtectedRoute allowedRoles={['WAITER']} />}>
          <Route element={<WaiterLayout />}>
            <Route path="/waiter" element={<Waiter />} />
          </Route>
        </Route>

        {/* Super Admin Shell Routes (Protected for global superadmin only) */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin" element={<SuperAdminOverview />} />
            <Route path="/superadmin/tenants" element={<SuperAdminTenants />} />
            <Route path="/superadmin/subscriptions" element={<SuperAdminSubscriptions />} />
            <Route path="/superadmin/users" element={<SuperAdminUsers />} />
            <Route path="/superadmin/rbac" element={<SuperAdminRBAC />} />
            <Route path="/superadmin/logs" element={<SuperAdminLogs />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
