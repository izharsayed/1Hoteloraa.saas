"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _settingsservice = require('./settings.service'); var settingsService = _interopRequireWildcard(_settingsservice);
var _helpers = require('../../shared/helpers');

 const getSettings = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await settingsService.getSettings(tenantId);
    _helpers.sendSuccess.call(void 0, res, result, 'Settings retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getSettings = getSettings;

 const updateSettings = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await settingsService.updateSettings(tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Settings updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateSettings = updateSettings;
