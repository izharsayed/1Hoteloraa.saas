"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _checkinservice = require('./checkin.service'); var checkInService = _interopRequireWildcard(_checkinservice);

/**
 * GET /checkin/pending
 * Returns all CONFIRMED reservations with checkInDate <= today.
 */
 const getPendingCheckIns = async (
  req,
  res,
  next,
) => {
  try {
    const data = await checkInService.getPendingCheckIns(req.user.tenantId);
    _helpers.sendSuccess.call(void 0, res, data, 'Pending check-ins fetched successfully');
  } catch (err) {
    next(err);
  }
}; exports.getPendingCheckIns = getPendingCheckIns;

/**
 * GET /checkin/today
 * Returns all reservations checked in today.
 */
 const getTodayCheckIns = async (
  req,
  res,
  next,
) => {
  try {
    const data = await checkInService.getTodayCheckIns(req.user.tenantId);
    _helpers.sendSuccess.call(void 0, res, data, "Today's check-ins fetched successfully");
  } catch (err) {
    next(err);
  }
}; exports.getTodayCheckIns = getTodayCheckIns;

/**
 * POST /checkin
 * Performs the check-in for a given reservation.
 * Body is validated via checkInSchema before reaching this handler.
 */
 const checkIn = async (
  req,
  res,
  next,
) => {
  try {
    const data = await checkInService.checkIn(
      req.user.tenantId,
      req.user.id,
      req.body,
    );
    _helpers.sendSuccess.call(void 0, res, data, 'Guest checked in successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.checkIn = checkIn;
