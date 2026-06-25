"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createFloorSchema = _zod.z.object({
  name: _zod.z.string().min(1).max(50),
}); exports.createFloorSchema = createFloorSchema;


