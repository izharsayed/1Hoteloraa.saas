"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _validatemiddleware = require('../../middleware/validate.middleware');
var _kotdto = require('./kot.dto');






var _kotcontroller = require('./kot.controller');

const router = _express.Router.call(void 0, );

// All routes require authentication
router.use(_authmiddleware.authenticate);

router.get('/',    _authmiddleware.checkPermission.call(void 0, 'KOT', 'READ'),   _kotcontroller.getKOTs);
router.get('/:id', _authmiddleware.checkPermission.call(void 0, 'KOT', 'READ'),   _kotcontroller.getKOTById);
router.post('/',   _authmiddleware.checkPermission.call(void 0, 'KOT', 'CREATE'), _validatemiddleware.validate.call(void 0, _kotdto.createKOTSchema), _kotcontroller.createKOT);
router.patch('/:id/status', _authmiddleware.checkPermission.call(void 0, 'KOT', 'UPDATE'), _validatemiddleware.validate.call(void 0, _kotdto.updateKOTStatusSchema), _kotcontroller.updateKOTStatus);
router.post('/:id/print',   _authmiddleware.checkPermission.call(void 0, 'KOT', 'READ'),   _kotcontroller.printKOT);

exports. default = router;
