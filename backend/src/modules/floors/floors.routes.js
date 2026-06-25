"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _floorsdto = require('./floors.dto');
var _floorscontroller = require('./floors.controller'); var floorsController = _interopRequireWildcard(_floorscontroller);

const router = _express.Router.call(void 0, );

// All floors routes require authentication
router.use(_authmiddleware.authenticate);

router.get('/',    _authmiddleware.checkPermission.call(void 0, 'TABLES', 'READ'),   floorsController.getFloors);
router.post('/',   _authmiddleware.checkPermission.call(void 0, 'TABLES', 'CREATE'), _validatemiddleware.validate.call(void 0, _floorsdto.createFloorSchema), floorsController.createFloor);
router.delete('/:id', _authmiddleware.checkPermission.call(void 0, 'TABLES', 'DELETE'), floorsController.deleteFloor);

exports. default = router;
