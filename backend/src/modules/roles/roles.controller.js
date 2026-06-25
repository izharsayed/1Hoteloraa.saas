"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _rolesservice = require('./roles.service'); var rolesService = _interopRequireWildcard(_rolesservice);
var _helpers = require('../../shared/helpers');

 const getRoles = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await rolesService.getRoles(tenantId);
    _helpers.sendSuccess.call(void 0, res, result, 'Roles retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getRoles = getRoles;

 const getRoleById = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await rolesService.getRoleById(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, result, 'Role retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getRoleById = getRoleById;

 const createRole = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await rolesService.createRole(tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Role created successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.createRole = createRole;

 const updateRole = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await rolesService.updateRole(tenantId, id, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Role updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateRole = updateRole;

 const deleteRole = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await rolesService.deleteRole(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, result, 'Role deleted successfully');
  } catch (err) {
    next(err);
  }
}; exports.deleteRole = deleteRole;
