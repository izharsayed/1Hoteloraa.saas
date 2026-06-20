import { z } from 'zod';

// ─── Menu Category ───────────────────────────────────────────────────────────

export const createMenuCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const updateMenuCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

// ─── Menu Item ────────────────────────────────────────────────────────────────

export const createMenuItemSchema = z.object({
  menuCategoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  costPrice: z.number().nonnegative().optional(),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().int().positive().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const updateMenuItemSchema = z.object({
  menuCategoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(150).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  costPrice: z.number().nonnegative().optional(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  preparationTime: z.number().int().positive().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export type CreateMenuCategoryDto = z.infer<typeof createMenuCategorySchema>;
export type UpdateMenuCategoryDto = z.infer<typeof updateMenuCategorySchema>;
export type CreateMenuItemDto = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemDto = z.infer<typeof updateMenuItemSchema>;
