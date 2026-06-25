"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');




var _ordersdto = require('./orders.dto');








var _orderscontroller = require('./orders.controller');

const router = _express.Router.call(void 0, );

// All routes require authentication
router.use(_authmiddleware.authenticate);

router.get('/',   _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'READ'),   _orderscontroller.getOrders);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'READ'),  _orderscontroller.getOrderById);
router.post('/',  _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'CREATE'), _validatemiddleware.validate.call(void 0, _ordersdto.createOrderSchema), _orderscontroller.createOrder);
router.patch('/:id/status', _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _ordersdto.updateOrderStatusSchema), _orderscontroller.updateOrderStatus);
router.post('/:id/items',   _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'UPDATE'), _validatemiddleware.validate.call(void 0, _ordersdto.addItemsSchema), _orderscontroller.addItemsToOrder);
router.patch('/:id/items/:itemId/void', _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'UPDATE'), _orderscontroller.voidOrderItem);
router.delete('/:id', _authmiddleware.checkPermission.call(void 0, 'ORDERS', 'DELETE'), _orderscontroller.cancelOrder);

exports. default = router;
