"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _roomtypesservice = require('./room-types.service'); var roomTypesService = _interopRequireWildcard(_roomtypesservice);

 const getRoomTypes = async (req, res, next) => {
  try {
    const data = await roomTypesService.getRoomTypes(req.user.tenantId);
    _helpers.sendSuccess.call(void 0, res, data, 'Room types retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getRoomTypes = getRoomTypes;

 const getRoomTypeById = async (req, res, next) => {
  try {
    const data = await roomTypesService.getRoomTypeById(req.user.tenantId, req.params.id);
    _helpers.sendSuccess.call(void 0, res, data, 'Room type retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getRoomTypeById = getRoomTypeById;

 const createRoomType = async (req, res, next) => {
  try {
    const data = await roomTypesService.createRoomType(req.user.tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, data, 'Room type created successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.createRoomType = createRoomType;

 const updateRoomType = async (req, res, next) => {
  try {
    const data = await roomTypesService.updateRoomType(req.user.tenantId, req.params.id, req.body);
    _helpers.sendSuccess.call(void 0, res, data, 'Room type updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateRoomType = updateRoomType;

 const deleteRoomType = async (req, res, next) => {
  try {
    await roomTypesService.deleteRoomType(req.user.tenantId, req.params.id);
    _helpers.sendSuccess.call(void 0, res, null, 'Room type deleted successfully');
  } catch (err) {
    next(err);
  }
}; exports.deleteRoomType = deleteRoomType;
