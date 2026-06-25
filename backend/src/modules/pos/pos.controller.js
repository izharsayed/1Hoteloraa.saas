"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _posservice = require('./pos.service'); var posService = _interopRequireWildcard(_posservice);
var _helpers = require('../../shared/helpers');

 const getPOSData = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await posService.getPOSData(tenantId);
    _helpers.sendSuccess.call(void 0, res, result, 'POS bootstrap data retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getPOSData = getPOSData;

 const quickOrder = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const result = await posService.quickOrder(tenantId, userId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Quick order created and KOT generated successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.quickOrder = quickOrder;
