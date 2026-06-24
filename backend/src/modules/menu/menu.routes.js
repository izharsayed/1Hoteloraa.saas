"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');
var _menucontroller = require('./menu.controller'); var menuController = _interopRequireWildcard(_menucontroller);
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');





var _menudto = require('./menu.dto');

var _uploadmiddleware = require('../../middleware/upload.middleware');

const router = _express.Router.call(void 0, );

router.use(_authmiddleware.authenticate);

// Menu Categories
router.get('/categories',     _authmiddleware.checkPermission.call(void 0, 'MENU', 'READ'),   menuController.getCategories);
router.post('/categories',    _authmiddleware.checkPermission.call(void 0, 'MENU', 'CREATE'), _validatemiddleware.validate.call(void 0, _menudto.createMenuCategorySchema), menuController.createCategory);
router.put('/categories/:id', _authmiddleware.checkPermission.call(void 0, 'MENU', 'UPDATE'), _validatemiddleware.validate.call(void 0, _menudto.updateMenuCategorySchema), menuController.updateCategory);
router.delete('/categories/:id', _authmiddleware.checkPermission.call(void 0, 'MENU', 'DELETE'), menuController.deleteCategory);

// Menu Items
router.get('/items',     _authmiddleware.checkPermission.call(void 0, 'MENU', 'READ'),   menuController.getMenuItems);
router.get('/items/:id', _authmiddleware.checkPermission.call(void 0, 'MENU', 'READ'),   menuController.getMenuItemById);
router.post('/items/upload', _authmiddleware.checkPermission.call(void 0, 'MENU', 'CREATE'), _uploadmiddleware.uploadImage.single('image'), menuController.uploadItemImage);
router.post('/items',    _authmiddleware.checkPermission.call(void 0, 'MENU', 'CREATE'), _validatemiddleware.validate.call(void 0, _menudto.createMenuItemSchema), menuController.createMenuItem);
router.put('/items/:id', _authmiddleware.checkPermission.call(void 0, 'MENU', 'UPDATE'), _validatemiddleware.validate.call(void 0, _menudto.updateMenuItemSchema), menuController.updateMenuItem);
router.delete('/items/:id', _authmiddleware.checkPermission.call(void 0, 'MENU', 'DELETE'), menuController.deleteMenuItem);

exports. default = router;
