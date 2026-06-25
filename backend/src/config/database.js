"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _client = require('@prisma/client');






const prisma =
  _nullishCoalesce(globalThis.__prisma, () => (
  new (0, _client.PrismaClient)({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  })));

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

exports. default = prisma;
