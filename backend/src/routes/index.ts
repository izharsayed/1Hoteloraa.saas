import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/users.routes';
import roleRoutes from '../modules/roles/roles.routes';
import tenantRoutes from '../modules/tenants/tenants.routes';
import tableRoutes from '../modules/tables/tables.routes';
import menuRoutes from '../modules/menu/menu.routes';
import orderRoutes from '../modules/orders/orders.routes';
import kotRoutes from '../modules/kot/kot.routes';
import billingRoutes from '../modules/billing/billing.routes';
import posRoutes from '../modules/pos/pos.routes';
import roomTypeRoutes from '../modules/room-types/room-types.routes';
import roomRoutes from '../modules/rooms/rooms.routes';
import guestRoutes from '../modules/guests/guests.routes';
import reservationRoutes from '../modules/reservations/reservations.routes';
import checkInRoutes from '../modules/checkin/checkin.routes';
import checkOutRoutes from '../modules/checkout/checkout.routes';
import housekeepingRoutes from '../modules/housekeeping/housekeeping.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';
import vendorRoutes from '../modules/vendors/vendors.routes';
import purchaseRoutes from '../modules/purchases/purchases.routes';
import paymentRoutes from '../modules/payments/payments.routes';
import folioRoutes from '../modules/folio/folio.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import reportRoutes from '../modules/reports/reports.routes';
import settingsRoutes from '../modules/settings/settings.routes';
import permissionsRoutes from '../modules/permissions/permissions.routes';
import featuresRoutes from '../modules/features/features.routes';
import subscriptionsRoutes from '../modules/subscriptions/subscriptions.routes';
import categoriesRoutes from '../modules/categories/categories.routes';
import superadminRoutes from '../modules/superadmin/superadmin.routes';
import notificationsRoutes from '../modules/notifications/notifications.routes';
import floorsRoutes from '../modules/floors/floors.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Auth
router.use('/auth', authRoutes);

// Tenant Management
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/tenant', tenantRoutes);

// Restaurant
router.use('/tables', tableRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/kot', kotRoutes);
router.use('/billing', billingRoutes);
router.use('/pos', posRoutes);
router.use('/floors', floorsRoutes);

// Lodging
router.use('/room-types', roomTypeRoutes);
router.use('/rooms', roomRoutes);
router.use('/guests', guestRoutes);
router.use('/reservations', reservationRoutes);
router.use('/check-in', checkInRoutes);
router.use('/check-out', checkOutRoutes);
router.use('/housekeeping', housekeepingRoutes);

// Inventory & Purchasing
router.use('/inventory', inventoryRoutes);
router.use('/vendors', vendorRoutes);
router.use('/purchases', purchaseRoutes);

// Finance
router.use('/payments', paymentRoutes);
router.use('/folio', folioRoutes);

// Analytics & Config
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingsRoutes);

// System & SaaS Management
router.use('/permissions', permissionsRoutes);
router.use('/features', featuresRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/superadmin', superadminRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
