"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _userscontroller = require('./users.controller'); var usersController = _interopRequireWildcard(_userscontroller);
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _usersdto = require('./users.dto');

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);

// GET — Manager can read, only TENANT_ADMIN can create/update/delete (enforced via checkPermission)
router.get('/',    _authmiddleware.checkPermission.call(void 0, 'USERS', 'READ'),   usersController.getUsers);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'USERS', 'READ'),   usersController.getUserById);
router.post('/',   _authmiddleware.checkPermission.call(void 0, 'USERS', 'CREATE'), _validatemiddleware.validate.call(void 0, _usersdto.createUserSchema), usersController.createUser);
router.put('/:id', _authmiddleware.checkPermission.call(void 0, 'USERS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _usersdto.updateUserSchema), usersController.updateUser);
router.patch('/:id/toggle-status', _authmiddleware.checkPermission.call(void 0, 'USERS', 'UPDATE'), usersController.toggleUserStatus);
router.put('/:id/reset-password',  _authmiddleware.checkPermission.call(void 0, 'USERS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _usersdto.resetPasswordSchema), usersController.resetPassword);

exports. default = router;
