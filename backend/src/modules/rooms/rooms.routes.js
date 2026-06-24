"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _roomsdto = require('./rooms.dto');
var _roomscontroller = require('./rooms.controller'); var roomsController = _interopRequireWildcard(_roomscontroller);

const router = _express.Router.call(void 0, );

// All rooms routes require authentication
router.use(_authmiddleware.authenticate);

// IMPORTANT: /available must be registered before /:id to avoid route shadowing
router.get('/available', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'READ'), roomsController.getAvailableRooms);
router.get('/', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'READ'), roomsController.getRooms);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'READ'), roomsController.getRoomById);
router.post('/', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'CREATE'), _validatemiddleware.validate.call(void 0, _roomsdto.createRoomSchema), roomsController.createRoom);
router.put('/:id', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _roomsdto.updateRoomSchema), roomsController.updateRoom);
router.patch('/:id/status', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _roomsdto.updateRoomStatusSchema), roomsController.updateRoomStatus);
router.delete('/:id', _authmiddleware.checkPermission.call(void 0, 'ROOMS', 'DELETE'), roomsController.deleteRoom);

exports. default = router;
