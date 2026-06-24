"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);

var _errormiddleware = require('../../middleware/error.middleware');

 const createNotification = async (tenantId, dto) => {
  return _database2.default.notification.create({
    data: {
      tenantId,
      userId: dto.userId,
      role: dto.role,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      isRead: false,
    },
  });
}; exports.createNotification = createNotification;

 const getNotifications = async (tenantId, userId, role) => {
  return _database2.default.notification.findMany({
    where: {
      tenantId,
      OR: [
        { userId },
        { userId: null, role: role  },
        { userId: null, role: null },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}; exports.getNotifications = getNotifications;

 const markAsRead = async (tenantId, id, userId, role) => {
  const notification = await _database2.default.notification.findFirst({
    where: {
      id,
      tenantId,
      OR: [
        { userId },
        { userId: null, role: role  },
        { userId: null, role: null },
      ],
    },
  });

  if (!notification) {
    throw _errormiddleware.createError.call(void 0, 'Notification not found', 404);
  }

  return _database2.default.notification.update({
    where: { id },
    data: { isRead: true },
  });
}; exports.markAsRead = markAsRead;

 const markAllAsRead = async (tenantId, userId, role) => {
  return _database2.default.notification.updateMany({
    where: {
      tenantId,
      OR: [
        { userId },
        { userId: null, role: role  },
        { userId: null, role: null },
      ],
      isRead: false,
    },
    data: { isRead: true },
  });
}; exports.markAllAsRead = markAllAsRead;
