"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _kotservice = require('./kot.service'); var KOTService = _interopRequireWildcard(_kotservice);

// ---------------------------------------------------------------------------
// GET /kot
// ---------------------------------------------------------------------------
 const getKOTs = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const status = req.query.status ;

    const kots = await KOTService.getKOTs(tenantId, status);
    _helpers.sendSuccess.call(void 0, res, kots, 'KOTs retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getKOTs = getKOTs;

// ---------------------------------------------------------------------------
// GET /kot/:id
// ---------------------------------------------------------------------------
 const getKOTById = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const kot = await KOTService.getKOTById(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, kot, 'KOT retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getKOTById = getKOTById;

// ---------------------------------------------------------------------------
// POST /kot
// ---------------------------------------------------------------------------
 const createKOT = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    const kot = await KOTService.createKOT(tenantId, userId, req.body);
    _helpers.sendSuccess.call(void 0, res, kot, 'KOT created successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.createKOT = createKOT;

// ---------------------------------------------------------------------------
// PATCH /kot/:id/status
// ---------------------------------------------------------------------------
 const updateKOTStatus = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const kot = await KOTService.updateKOTStatus(tenantId, id, req.body);
    _helpers.sendSuccess.call(void 0, res, kot, 'KOT status updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateKOTStatus = updateKOTStatus;

// ---------------------------------------------------------------------------
// POST /kot/:id/print
// ---------------------------------------------------------------------------
 const printKOT = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const kot = await KOTService.printKOT(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, kot, 'KOT marked as printed');
  } catch (err) {
    next(err);
  }
}; exports.printKOT = printKOT;
