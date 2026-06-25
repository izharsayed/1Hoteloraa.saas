"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _errormiddleware = require('../../middleware/error.middleware');



 const getTables = async (tenantId) => {
  const tables = await _database2.default.table.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: [{ floor: 'asc' }, { name: 'asc' }],
  });
  return tables;
}; exports.getTables = getTables;

 const getTableById = async (tenantId, id) => {
  const table = await _database2.default.table.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      _count: { select: { orders: true } },
    },
  });
  if (!table) throw _errormiddleware.createError.call(void 0, 'Table not found', 404);
  return table;
}; exports.getTableById = getTableById;

 const createTable = async (tenantId, dto) => {
  const existing = await _database2.default.table.findFirst({
    where: { tenantId, name: dto.name, isActive: true },
  });
  if (existing) throw _errormiddleware.createError.call(void 0, `Table with name "${dto.name}" already exists`, 409);

  const table = await _database2.default.table.create({
    data: {
      tenantId,
      name: dto.name,
      capacity: _nullishCoalesce(dto.capacity, () => ( 4)),
      floor: dto.floor,
      section: dto.section,
    },
  });
  return table;
}; exports.createTable = createTable;

 const updateTable = async (tenantId, id, dto) => {
  const table = await _database2.default.table.findFirst({ where: { id, tenantId, isActive: true } });
  if (!table) throw _errormiddleware.createError.call(void 0, 'Table not found', 404);

  if (dto.name && dto.name !== table.name) {
    const duplicate = await _database2.default.table.findFirst({
      where: { tenantId, name: dto.name, isActive: true, id: { not: id } },
    });
    if (duplicate) throw _errormiddleware.createError.call(void 0, `Table with name "${dto.name}" already exists`, 409);
  }

  const updated = await _database2.default.table.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.capacity !== undefined && { capacity: dto.capacity }),
      ...(dto.floor !== undefined && { floor: dto.floor }),
      ...(dto.section !== undefined && { section: dto.section }),
    },
  });
  return updated;
}; exports.updateTable = updateTable;

 const updateTableStatus = async (tenantId, id, status) => {
  const table = await _database2.default.table.findFirst({ where: { id, tenantId, isActive: true } });
  if (!table) throw _errormiddleware.createError.call(void 0, 'Table not found', 404);

  const updated = await _database2.default.table.update({
    where: { id },
    data: { status },
  });
  return updated;
}; exports.updateTableStatus = updateTableStatus;

 const deleteTable = async (tenantId, id) => {
  const table = await _database2.default.table.findFirst({ where: { id, tenantId, isActive: true } });
  if (!table) throw _errormiddleware.createError.call(void 0, 'Table not found', 404);

  await _database2.default.table.update({
    where: { id },
    data: { isActive: false },
  });
  return { message: 'Table deleted successfully' };
}; exports.deleteTable = deleteTable;
