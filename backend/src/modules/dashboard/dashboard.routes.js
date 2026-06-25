"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _dashboardcontroller = require('./dashboard.controller'); var dashboardController = _interopRequireWildcard(_dashboardcontroller);
var _authmiddleware = require('../../middleware/auth.middleware');

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);

router.get('/', _authmiddleware.checkPermission.call(void 0, 'DASHBOARD', 'READ'), dashboardController.getDashboard);

exports. default = router;
