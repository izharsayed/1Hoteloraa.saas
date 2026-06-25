"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _authmiddleware = require('../../middleware/auth.middleware');
var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _helpers = require('../../shared/helpers');
var _zod = require('zod');
var _validatemiddleware = require('../../middleware/validate.middleware');



const router = _express.Router.call(void 0, );

const createCategorySchema = _zod.z.object({
  name: _zod.z.string().min(1),
  description: _zod.z.string().optional(),
  type: _zod.z.enum(['MENU', 'INVENTORY', 'EXPENSE']),
});

// GET /categories?type=
router.get('/', _authmiddleware.authenticate, async (req, res, next) => {
  try {
    const { type } = req.query;
    const categories = await _database2.default.category.findMany({
      where: { tenantId: req.user.tenantId, ...(type ? { type: String(type) } : {}) },
      orderBy: { name: 'asc' },
    });
    _helpers.sendSuccess.call(void 0, res, categories);
  } catch (err) { next(err); }
});

// POST /categories
router.post('/', _authmiddleware.authenticate, _validatemiddleware.validate.call(void 0, createCategorySchema), async (req, res, next) => {
  try {
    const category = await _database2.default.category.create({ data: { tenantId: req.user.tenantId, ...req.body } });
    _helpers.sendSuccess.call(void 0, res, category, 'Category created', 201);
  } catch (err) { next(err); }
});

// PUT /categories/:id
router.put('/:id', _authmiddleware.authenticate, async (req, res, next) => {
  try {
    const category = await _database2.default.category.update({ where: { id: req.params.id }, data: req.body });
    _helpers.sendSuccess.call(void 0, res, category, 'Category updated');
  } catch (err) { next(err); }
});

// DELETE /categories/:id
router.delete('/:id', _authmiddleware.authenticate, async (req, res, next) => {
  try {
    await _database2.default.category.delete({ where: { id: req.params.id } });
    _helpers.sendSuccess.call(void 0, res, null, 'Category deleted');
  } catch (err) { next(err); }
});

exports. default = router;
