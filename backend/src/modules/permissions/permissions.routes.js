"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _helpers = require('../../shared/helpers');



const router = _express.Router.call(void 0, );

// GET all permissions (system-wide)
router.get('/', _authmiddleware.authenticate, _authmiddleware.authorize.call(void 0, 'SUPER_ADMIN', 'TENANT_ADMIN'), async (req, res, next) => {
  try {
    const permissions = await _database2.default.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
    _helpers.sendSuccess.call(void 0, res, permissions);
  } catch (err) { next(err); }
});

// POST seed permissions (super admin only)
router.post('/seed', _authmiddleware.authenticate, _authmiddleware.authorize.call(void 0, 'SUPER_ADMIN'), async (_req, res, next) => {
  try {
    const modules = ['DASHBOARD', 'TABLES', 'MENU', 'ORDERS', 'KOT', 'BILLING', 'POS', 'ROOMS', 'ROOM_TYPES', 'GUESTS', 'RESERVATIONS', 'CHECKIN', 'CHECKOUT', 'HOUSEKEEPING', 'INVENTORY', 'VENDORS', 'PURCHASES', 'PAYMENTS', 'REPORTS', 'SETTINGS', 'USERS', 'ROLES'];
    const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
    const data = modules.flatMap(module => actions.map(action => ({ module, action })));
    
    await _database2.default.permission.createMany({ data, skipDuplicates: true });
    _helpers.sendSuccess.call(void 0, res, { seeded: data.length }, 'Permissions seeded');
  } catch (err) { next(err); }
});

exports. default = router;
