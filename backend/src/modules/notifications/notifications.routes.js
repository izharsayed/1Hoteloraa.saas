"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _notificationscontroller = require('./notifications.controller'); var notificationsController = _interopRequireWildcard(_notificationscontroller);

const router = _express.Router.call(void 0, );

// All notifications routes require authentication
router.use(_authmiddleware.authenticate);

router.get('/', notificationsController.getNotifications);
router.patch('/:id/read', notificationsController.markAsRead);
router.post('/mark-all-read', notificationsController.markAllAsRead);

exports. default = router;
