"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _billingservice = require('./billing.service'); var billingService = _interopRequireWildcard(_billingservice);

// ---------------------------------------------------------------------------
// GET /billing/order/:orderId
// ---------------------------------------------------------------------------
 const getBillByOrderId = async (
  req,
  res,
  next
) => {
  try {
    const { orderId } = req.params;
    const tenantId = req.user.tenantId;
    const bill = await billingService.getBillByOrderId(tenantId, orderId);
    _helpers.sendSuccess.call(void 0, res, bill, 'Bill fetched successfully');
  } catch (err) {
    next(err);
  }
}; exports.getBillByOrderId = getBillByOrderId;

// ---------------------------------------------------------------------------
// POST /billing/generate
// ---------------------------------------------------------------------------
 const generateBill = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const result = await billingService.generateBill(tenantId, userId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Bill generated successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.generateBill = generateBill;

// ---------------------------------------------------------------------------
// GET /billing/recent
// ---------------------------------------------------------------------------
 const getRecentBills = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const limit = req.query.limit ? parseInt(req.query.limit , 10) : 20;
    const bills = await billingService.getRecentBills(tenantId, limit);
    _helpers.sendSuccess.call(void 0, res, bills, 'Recent bills fetched successfully');
  } catch (err) {
    next(err);
  }
}; exports.getRecentBills = getRecentBills;

// ---------------------------------------------------------------------------
// GET /billing/daily-sales?date=YYYY-MM-DD
// ---------------------------------------------------------------------------
 const getDailySales = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const date = req.query.date ;
    const report = await billingService.getDailySales(tenantId, date);
    _helpers.sendSuccess.call(void 0, res, report, 'Daily sales fetched successfully');
  } catch (err) {
    next(err);
  }
}; exports.getDailySales = getDailySales;
