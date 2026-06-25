"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _errormiddleware = require('../../middleware/error.middleware');


 const getFloors = async (tenantId) => {
  const floors = await _database2.default.floor.findMany({
    where: { tenantId },
    orderBy: { name: 'asc' },
  });
  
  if (floors.length === 0) {
    const defaults = ['Ground Floor', 'First Floor', 'Second Floor', 'Rooftop'];
    await _database2.default.floor.createMany({
      data: defaults.map(name => ({ tenantId, name })),
    });
    return await _database2.default.floor.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }
  
  return floors;
}; exports.getFloors = getFloors;

 const createFloor = async (tenantId, dto) => {
  const existing = await _database2.default.floor.findFirst({
    where: { tenantId, name: dto.name },
  });
  if (existing) throw _errormiddleware.createError.call(void 0, `Floor "${dto.name}" already exists`, 409);

  return await _database2.default.floor.create({
    data: {
      tenantId,
      name: dto.name,
    },
  });
}; exports.createFloor = createFloor;

 const deleteFloor = async (tenantId, id) => {
  const floor = await _database2.default.floor.findFirst({
    where: { id, tenantId },
  });
  if (!floor) throw _errormiddleware.createError.call(void 0, 'Floor not found', 404);

  await _database2.default.floor.delete({
    where: { id },
  });

  return { message: 'Floor deleted successfully' };
}; exports.deleteFloor = deleteFloor;
