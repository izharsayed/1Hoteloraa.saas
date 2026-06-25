"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');



var _purchasesdto = require('./purchases.dto');
var _purchasescontroller = require('./purchases.controller'); var purchaseController = _interopRequireWildcard(_purchasescontroller);

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);

router.get('/',    _authmiddleware.checkPermission.call(void 0, 'PURCHASES', 'READ'),   purchaseController.listPurchases);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'PURCHASES', 'READ'),   purchaseController.getPurchase);
router.post('/',   _authmiddleware.checkPermission.call(void 0, 'PURCHASES', 'CREATE'), _validatemiddleware.validate.call(void 0, _purchasesdto.createPurchaseSchema), purchaseController.createPurchase);
router.post('/:id/receive', _authmiddleware.checkPermission.call(void 0, 'PURCHASES', 'UPDATE'), purchaseController.receivePurchase);
router.patch('/:id/status', _authmiddleware.checkPermission.call(void 0, 'PURCHASES', 'UPDATE'), _validatemiddleware.validate.call(void 0, _purchasesdto.updatePurchaseStatusSchema), purchaseController.updatePurchaseStatus);

exports. default = router;
