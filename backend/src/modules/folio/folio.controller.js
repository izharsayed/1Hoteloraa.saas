"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _folioservice = require('./folio.service'); var folioService = _interopRequireWildcard(_folioservice);
var _helpers = require('../../shared/helpers');

 const getFolioByPaymentId = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { paymentId } = req.params;
    const result = await folioService.getFolioByPaymentId(tenantId, paymentId);
    _helpers.sendSuccess.call(void 0, res, result, 'Folio items retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getFolioByPaymentId = getFolioByPaymentId;

 const getFolioByReservationId = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { reservationId } = req.params;
    const result = await folioService.getFolioByReservationId(tenantId, reservationId);
    _helpers.sendSuccess.call(void 0, res, result, 'Folio items retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getFolioByReservationId = getFolioByReservationId;

 const addFolioItem = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await folioService.addFolioItem(tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Folio item added successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.addFolioItem = addFolioItem;

 const getGuestFolio = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { reservationId } = req.params;
    const result = await folioService.getGuestFolio(tenantId, reservationId);
    _helpers.sendSuccess.call(void 0, res, result, 'Guest folio statement generated successfully');
  } catch (err) {
    next(err);
  }
}; exports.getGuestFolio = getGuestFolio;
