"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');




var _reservationsdto = require('./reservations.dto');
var _reservationscontroller = require('./reservations.controller'); var reservationsController = _interopRequireWildcard(_reservationscontroller);

const router = _express.Router.call(void 0, );

// All routes require authentication
router.use(_authmiddleware.authenticate);

router.get('/', _authmiddleware.checkPermission.call(void 0, 'RESERVATIONS', 'READ'), reservationsController.getReservations);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'RESERVATIONS', 'READ'), reservationsController.getReservationById);
router.post('/', _authmiddleware.checkPermission.call(void 0, 'RESERVATIONS', 'CREATE'), _validatemiddleware.validate.call(void 0, _reservationsdto.createReservationSchema), reservationsController.createReservation);
router.put('/:id', _authmiddleware.checkPermission.call(void 0, 'RESERVATIONS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _reservationsdto.updateReservationSchema), reservationsController.updateReservation);
router.patch('/:id/status', _authmiddleware.checkPermission.call(void 0, 'RESERVATIONS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _reservationsdto.updateStatusSchema), reservationsController.updateStatus);
router.delete('/:id', _authmiddleware.checkPermission.call(void 0, 'RESERVATIONS', 'DELETE'), reservationsController.cancelReservation);

exports. default = router;
