"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }
var _authservice = require('./auth.service'); var authService = _interopRequireWildcard(_authservice);

var _helpers = require('../../shared/helpers');

 const register = async (req, res, next) => {
  try {
    const result = await authService.registerTenant(req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Tenant registered successfully', 201);
  } catch (err) { next(err); }
}; exports.register = register;

 const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Login successful');
  } catch (err) { next(err); }
}; exports.login = login;

 const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Password changed');
  } catch (err) { next(err); }
}; exports.changePassword = changePassword;

 const getProfile = async (req, res, next) => {
  try {
    const result = await authService.getProfile(req.user.id, req.user.tenantId);
    _helpers.sendSuccess.call(void 0, res, result);
  } catch (err) { next(err); }
}; exports.getProfile = getProfile;

 const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body);
    _helpers.sendSuccess.call(void 0, res, result, result.message);
  } catch (err) { next(err); }
}; exports.forgotPassword = forgotPassword;

 const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    _helpers.sendSuccess.call(void 0, res, result, result.message);
  } catch (err) { next(err); }
}; exports.resetPassword = resetPassword;

 const logout = (_req, res) => {
  _helpers.sendSuccess.call(void 0, res, null, 'Logged out successfully');
}; exports.logout = logout;
