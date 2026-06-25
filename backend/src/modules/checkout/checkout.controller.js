"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _checkoutservice = require('./checkout.service'); var checkOutService = _interopRequireWildcard(_checkoutservice);
var _helpers = require('../../shared/helpers');

 const getPendingCheckOuts = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await checkOutService.getPendingCheckOuts(tenantId);
    _helpers.sendSuccess.call(void 0, res, result, 'Pending check-outs retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getPendingCheckOuts = getPendingCheckOuts;

 const getTodayCheckOuts = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await checkOutService.getTodayCheckOuts(tenantId);
    _helpers.sendSuccess.call(void 0, res, result, 'Today\'s check-outs retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getTodayCheckOuts = getTodayCheckOuts;

 const checkOut = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const result = await checkOutService.checkOut(tenantId, userId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Check-out completed successfully');
  } catch (err) {
    next(err);
  }
}; exports.checkOut = checkOut;
