import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import AccessDenied from './components/AccessDenied.jsx';

// Core Pages
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

// Lodging Pages
import Rooms from './pages/Rooms.jsx';
import Reservations from './pages/Reservations.jsx';
import CheckIn from './pages/CheckIn.jsx';
import CheckOut from './pages/CheckOut.jsx';
import Housekeeping from './pages/Housekeeping.jsx';
import CRM from './pages/CRM.jsx';

// Restaurant & POS Pages
import Tables from './pages/Tables.jsx';
import Kitchen from './pages/Kitchen.jsx';
import Menu from './pages/Menu.jsx';
import Billing from './pages/Billing.jsx';

// Procurement Pages
import Inventory from './pages/Inventory.jsx';
import Vendors from './pages/Vendors.jsx';
import Purchases from './pages/Purchases.jsx';

// Admin Panel Pages
import AdminLayout from './components/AdminLayout.jsx';
import AdminOverview from './pages/AdminOverview.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminRBAC from './pages/AdminRBAC.jsx';
import AdminFeatures from './pages/AdminFeatures.jsx';
import AdminSettings from './pages/AdminSettings.jsx';

// Waiter Panel
import WaiterLayout from './components/WaiterLayout.jsx';
import Waiter from './pages/Waiter.jsx';

// Super Admin Panel
import SuperAdminLayout from './components/SuperAdminLayout.jsx';
import SuperAdminOverview from './pages/SuperAdminOverview.jsx';
import SuperAdminTenants from './pages/SuperAdminTenants.jsx';
import SuperAdminSubscriptions from './pages/SuperAdminSubscriptions.jsx';
import SuperAdminUsers from './pages/SuperAdminUsers.jsx';
import SuperAdminRBAC from './pages/SuperAdminRBAC.jsx';
import SuperAdminLogs from './pages/SuperAdminLogs.jsx';

// Manager Panel
import Manager from './pages/Manager.jsx';

// Permissions utility
import { MODULE_ACCESS } from './utils/permissions.js';

// --------------------------------------------------------------------------
// DashboardLayout — shared shell for all operational staff routes
// --------------------------------------------------------------------------
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
        {/* Top bar */}
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

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// ProtectedRoute — enforces authentication and optionally role-based access
// --------------------------------------------------------------------------
function ProtectedRoute({ allowedRoles, module: moduleKey }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);

    // Role whitelist check (used for panel-level guards)
    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
      // Smart redirect based on role
      if (user.userRole === 'SUPER_ADMIN') return <Navigate to="/superadmin" replace />;
      if (user.userRole === 'WAITER') return <Navigate to="/waiter" replace />;
      if (user.userRole === 'CHEF') return <Navigate to="/kitchen" replace />;
      return <AccessDenied />;
    }

    // Module-based access check (used for individual route guards)
    if (moduleKey && user.userRole !== 'SUPER_ADMIN' && user.userRole !== 'TENANT_ADMIN') {
      const allowed = MODULE_ACCESS[moduleKey] || [];
      if (!allowed.includes(user.userRole)) {
        return <AccessDenied />;
      }
    }

    return <Outlet />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}

// --------------------------------------------------------------------------
// App
// --------------------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- Auth ---- */}
        <Route path="/login" element={<Login />} />

        {/* ========================================================
            OPERATIONAL STAFF SHELL — all tenant users except SUPER_ADMIN
        ======================================================== */}
        <Route element={
          <ProtectedRoute allowedRoles={[
            'TENANT_ADMIN', 'MANAGER', 'RECEPTIONIST', 'WAITER', 'CHEF',
            'HOUSEKEEPING', 'ACCOUNTANT', 'CASHIER'
          ]} />
        }>
          <Route element={<DashboardLayout />}>

            {/* --- General --- */}
            <Route element={<ProtectedRoute module="dashboard" />}>
              <Route path="/" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute module="reports" />}>
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute module="settings" />}>
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* --- Lodging --- */}
            <Route element={<ProtectedRoute module="rooms" />}>
              <Route path="/rooms"    element={<Rooms />} />
              <Route path="/checkin"  element={<CheckIn />} />
              <Route path="/checkout" element={<CheckOut />} />
            </Route>

            <Route element={<ProtectedRoute module="reservations" />}>
              <Route path="/reservations" element={<Reservations />} />
            </Route>

            <Route element={<ProtectedRoute module="housekeeping" />}>
              <Route path="/housekeeping" element={<Housekeeping />} />
            </Route>

            <Route element={<ProtectedRoute module="guests" />}>
              <Route path="/crm" element={<CRM />} />
            </Route>

            {/* --- Restaurant & POS --- */}
            <Route element={<ProtectedRoute module="tables" />}>
              <Route path="/tables" element={<Tables />} />
            </Route>

            <Route element={<ProtectedRoute module="kot" />}>
              <Route path="/kitchen" element={<Kitchen />} />
            </Route>

            <Route element={<ProtectedRoute module="pos" />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/pos"  element={<Billing />} />
              <Route path="/billing" element={<Billing />} />
            </Route>

            <Route element={<ProtectedRoute module="orders" />}>
              <Route path="/orders" element={<Billing />} />
            </Route>

            {/* --- Procurement --- */}
            <Route element={<ProtectedRoute module="inventory" />}>
              <Route path="/inventory" element={<Inventory />} />
            </Route>

            <Route element={<ProtectedRoute module="vendors" />}>
              <Route path="/vendors" element={<Vendors />} />
            </Route>

            <Route element={<ProtectedRoute module="purchases" />}>
              <Route path="/purchases" element={<Purchases />} />
            </Route>

            {/* Manager panel (accessible to admin + manager) */}
            <Route element={<ProtectedRoute allowedRoles={['TENANT_ADMIN', 'MANAGER']} />}>
              <Route path="/manager" element={<Manager />} />
            </Route>

          </Route>
        </Route>

        {/* ========================================================
            WAITER PANEL — dedicated POS interface for waiters
        ======================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['WAITER', 'TENANT_ADMIN', 'MANAGER']} />}>
          <Route element={<WaiterLayout />}>
            <Route path="/waiter" element={<Waiter />} />
          </Route>
        </Route>

        {/* ========================================================
            TENANT ADMIN PANEL — property management
        ======================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['TENANT_ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"          element={<AdminOverview />} />
            <Route path="/admin/users"    element={<AdminUsers />} />
            <Route path="/admin/rbac"     element={<AdminRBAC />} />
            <Route path="/admin/features" element={<AdminFeatures />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ========================================================
            SUPER ADMIN PANEL — global SaaS management
        ======================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin"               element={<SuperAdminOverview />} />
            <Route path="/superadmin/tenants"        element={<SuperAdminTenants />} />
            <Route path="/superadmin/subscriptions"  element={<SuperAdminSubscriptions />} />
            <Route path="/superadmin/users"          element={<SuperAdminUsers />} />
            <Route path="/superadmin/rbac"           element={<SuperAdminRBAC />} />
            <Route path="/superadmin/logs"           element={<SuperAdminLogs />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
