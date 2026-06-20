import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as superadminController from './superadmin.controller';

const router = Router();

// Apply auth checks globally to all Super Admin endpoints
router.use(authenticate);
router.use(authorize('SUPER_ADMIN'));

// System Metrics
router.get('/overview', superadminController.getOverviewMetrics);

// Tenants Registry
router.get('/tenants', superadminController.getAllTenants);
router.post('/tenants', superadminController.createTenant);
router.patch('/tenants/:id/status', superadminController.toggleTenantStatus);
router.patch('/tenants/:id/config', superadminController.configureTenantFeatures);
router.patch('/tenants/:id/plan', superadminController.configureTenantPlan);
router.delete('/tenants/:id', superadminController.deleteTenant);

// Subscription Plans
router.get('/subscriptions', superadminController.getSubscriptionPlans);

// Cross-tenant Users
router.get('/users', superadminController.getAllUsers);
router.patch('/users/:id/status', superadminController.toggleUserStatus);
router.put('/users/:id/reset-password', superadminController.resetUserPassword);

// System Audit Logs
router.get('/audit-logs', superadminController.getAuditLogs);
router.post('/audit-logs/simulate', superadminController.createSimulatedLog);

// Global Roles & Matrix (RBAC)
router.get('/roles', superadminController.getGlobalRoles);
router.patch('/roles/:id/permissions', superadminController.updateRolePermissions);
router.post('/roles', superadminController.createRole);
router.delete('/roles/:id', superadminController.deleteRole);

export default router;
