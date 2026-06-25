"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _tablesdto = require('./tables.dto');
var _tablescontroller = require('./tables.controller'); var tablesController = _interopRequireWildcard(_tablescontroller);

const router = _express.Router.call(void 0, );

// All tables routes require authentication
router.use(_authmiddleware.authenticate);

router.get('/',    _authmiddleware.checkPermission.call(void 0, 'TABLES', 'READ'),   tablesController.getTables);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'TABLES', 'READ'),   tablesController.getTableById);
router.post('/',   _authmiddleware.checkPermission.call(void 0, 'TABLES', 'CREATE'), _validatemiddleware.validate.call(void 0, _tablesdto.createTableSchema),       tablesController.createTable);
router.put('/:id', _authmiddleware.checkPermission.call(void 0, 'TABLES', 'UPDATE'), _validatemiddleware.validate.call(void 0, _tablesdto.updateTableSchema),       tablesController.updateTable);
router.patch('/:id/status', _authmiddleware.checkPermission.call(void 0, 'TABLES', 'UPDATE'), _validatemiddleware.validate.call(void 0, _tablesdto.updateTableStatusSchema), tablesController.updateTableStatus);
router.delete('/:id', _authmiddleware.checkPermission.call(void 0, 'TABLES', 'DELETE'), tablesController.deleteTable);

exports. default = router;
