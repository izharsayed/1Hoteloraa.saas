"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _tablesservice = require('./tables.service'); var tablesService = _interopRequireWildcard(_tablesservice);


 const getTables = async (req, res, next) => {
  try {
    const data = await tablesService.getTables(req.user.tenantId);
    _helpers.sendSuccess.call(void 0, res, data, 'Tables retrieved successfully');
  } catch (err) { next(err); }
}; exports.getTables = getTables;

 const getTableById = async (req, res, next) => {
  try {
    const data = await tablesService.getTableById(req.user.tenantId, req.params.id);
    _helpers.sendSuccess.call(void 0, res, data, 'Table retrieved successfully');
  } catch (err) { next(err); }
}; exports.getTableById = getTableById;

 const createTable = async (req, res, next) => {
  try {
    const data = await tablesService.createTable(req.user.tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, data, 'Table created successfully', 201);
  } catch (err) { next(err); }
}; exports.createTable = createTable;

 const updateTable = async (req, res, next) => {
  try {
    const data = await tablesService.updateTable(req.user.tenantId, req.params.id, req.body);
    _helpers.sendSuccess.call(void 0, res, data, 'Table updated successfully');
  } catch (err) { next(err); }
}; exports.updateTable = updateTable;

 const updateTableStatus = async (req, res, next) => {
  try {
    const data = await tablesService.updateTableStatus(
      req.user.tenantId,
      req.params.id,
      req.body.status ,
    );
    _helpers.sendSuccess.call(void 0, res, data, 'Table status updated successfully');
  } catch (err) { next(err); }
}; exports.updateTableStatus = updateTableStatus;

 const deleteTable = async (req, res, next) => {
  try {
    const data = await tablesService.deleteTable(req.user.tenantId, req.params.id);
    _helpers.sendSuccess.call(void 0, res, data, 'Table deleted successfully');
  } catch (err) { next(err); }
}; exports.deleteTable = deleteTable;
