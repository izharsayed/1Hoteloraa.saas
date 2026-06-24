"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _notificationsservice = require('./notifications.service'); var notificationsService = _interopRequireWildcard(_notificationsservice);

 const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const role = req.user.userRole;

    const notifications = await notificationsService.getNotifications(tenantId, userId, role);
    _helpers.sendSuccess.call(void 0, res, notifications, 'Notifications retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getNotifications = getNotifications;

 const markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const role = req.user.userRole;
    const { id } = req.params;

    const updated = await notificationsService.markAsRead(tenantId, id, userId, role);
    _helpers.sendSuccess.call(void 0, res, updated, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}; exports.markAsRead = markAsRead;

 const markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const role = req.user.userRole;

    const result = await notificationsService.markAllAsRead(tenantId, userId, role);
    _helpers.sendSuccess.call(void 0, res, result, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}; exports.markAllAsRead = markAllAsRead;
