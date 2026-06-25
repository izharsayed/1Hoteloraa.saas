"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _vendorsdto = require('./vendors.dto');
var _vendorscontroller = require('./vendors.controller'); var vendorController = _interopRequireWildcard(_vendorscontroller);

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);

router.get('/',    _authmiddleware.checkPermission.call(void 0, 'VENDORS', 'READ'),   vendorController.listVendors);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'VENDORS', 'READ'),   vendorController.getVendor);
router.post('/',   _authmiddleware.checkPermission.call(void 0, 'VENDORS', 'CREATE'), _validatemiddleware.validate.call(void 0, _vendorsdto.createVendorSchema), vendorController.createVendor);
router.put('/:id', _authmiddleware.checkPermission.call(void 0, 'VENDORS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _vendorsdto.updateVendorSchema), vendorController.updateVendor);
router.delete('/:id', _authmiddleware.checkPermission.call(void 0, 'VENDORS', 'DELETE'), vendorController.deleteVendor);

exports. default = router;
