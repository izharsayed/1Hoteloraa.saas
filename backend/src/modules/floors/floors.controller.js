"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _floorsservice = require('./floors.service'); var floorsService = _interopRequireWildcard(_floorsservice);

 const getFloors = async (req, res, next) => {
  try {
    const data = await floorsService.getFloors(req.user.tenantId);
    _helpers.sendSuccess.call(void 0, res, data, 'Floors retrieved successfully');
  } catch (err) { next(err); }
}; exports.getFloors = getFloors;

 const createFloor = async (req, res, next) => {
  try {
    const data = await floorsService.createFloor(req.user.tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, data, 'Floor created successfully', 201);
  } catch (err) { next(err); }
}; exports.createFloor = createFloor;

 const deleteFloor = async (req, res, next) => {
  try {
    const data = await floorsService.deleteFloor(req.user.tenantId, req.params.id);
    _helpers.sendSuccess.call(void 0, res, data, 'Floor deleted successfully');
  } catch (err) { next(err); }
}; exports.deleteFloor = deleteFloor;
