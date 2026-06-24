"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _rolescontroller = require('./roles.controller'); var rolesController = _interopRequireWildcard(_rolescontroller);
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _rolesdto = require('./roles.dto');

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);
// Roles management is restricted to TENANT_ADMIN and SUPER_ADMIN only
router.use(_authmiddleware.authorize.call(void 0, 'SUPER_ADMIN', 'TENANT_ADMIN'));

router.get('/',    rolesController.getRoles);
router.get('/:id', rolesController.getRoleById);
router.post('/',   _validatemiddleware.validate.call(void 0, _rolesdto.createRoleSchema), rolesController.createRole);
router.put('/:id', _validatemiddleware.validate.call(void 0, _rolesdto.updateRoleSchema), rolesController.updateRole);
router.delete('/:id', rolesController.deleteRole);

exports. default = router;
