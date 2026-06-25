"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _billingcontroller = require('./billing.controller'); var billingController = _interopRequireWildcard(_billingcontroller);
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _billingdto = require('./billing.dto');

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);

router.get('/order/:orderId', billingController.getBillByOrderId);
router.post('/generate', _validatemiddleware.validate.call(void 0, _billingdto.generateBillSchema), billingController.generateBill);
router.get('/recent', billingController.getRecentBills);
router.get('/daily-sales', billingController.getDailySales);

exports. default = router;
