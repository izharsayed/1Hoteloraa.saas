"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

// ─── Menu Category ───────────────────────────────────────────────────────────

 const createMenuCategorySchema = _zod.z.object({
  name: _zod.z.string().min(1).max(100),
  description: _zod.z.string().max(500).optional(),
  sortOrder: _zod.z.number().int().nonnegative().optional(),
}); exports.createMenuCategorySchema = createMenuCategorySchema;

 const updateMenuCategorySchema = _zod.z.object({
  name: _zod.z.string().min(1).max(100).optional(),
  description: _zod.z.string().max(500).optional(),
  sortOrder: _zod.z.number().int().nonnegative().optional(),
}); exports.updateMenuCategorySchema = updateMenuCategorySchema;

// ─── Menu Item ────────────────────────────────────────────────────────────────

 const createMenuItemSchema = _zod.z.object({
  menuCategoryId: _zod.z.string().uuid().optional(),
  name: _zod.z.string().min(1).max(150),
  description: _zod.z.string().max(1000).optional(),
  price: _zod.z.number().positive(),
  costPrice: _zod.z.number().nonnegative().optional(),
  imageUrl: _zod.z.string().optional().nullable(),
  isVeg: _zod.z.boolean().default(true),
  isAvailable: _zod.z.boolean().default(true),
  preparationTime: _zod.z.number().int().positive().optional(),
  sortOrder: _zod.z.number().int().nonnegative().optional(),
}); exports.createMenuItemSchema = createMenuItemSchema;

 const updateMenuItemSchema = _zod.z.object({
  menuCategoryId: _zod.z.string().uuid().optional(),
  name: _zod.z.string().min(1).max(150).optional(),
  description: _zod.z.string().max(1000).optional(),
  price: _zod.z.number().positive().optional(),
  costPrice: _zod.z.number().nonnegative().optional(),
  imageUrl: _zod.z.string().optional().nullable(),
  isVeg: _zod.z.boolean().optional(),
  isAvailable: _zod.z.boolean().optional(),
  preparationTime: _zod.z.number().int().positive().optional(),
  sortOrder: _zod.z.number().int().nonnegative().optional(),
}); exports.updateMenuItemSchema = updateMenuItemSchema;





