"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _errormiddleware = require('../../middleware/error.middleware');


 const getRoomTypes = async (tenantId) => {
  const roomTypes = await _database2.default.roomType.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: {
        select: { rooms: { where: { isActive: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return roomTypes.map((rt) => ({
    ...rt,
    roomCount: rt._count.rooms,
    _count: undefined,
  }));
}; exports.getRoomTypes = getRoomTypes;

 const getRoomTypeById = async (tenantId, id) => {
  const roomType = await _database2.default.roomType.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      _count: {
        select: { rooms: { where: { isActive: true } } },
      },
    },
  });

  if (!roomType) throw _errormiddleware.createError.call(void 0, 'Room type not found', 404);

  return {
    ...roomType,
    roomCount: roomType._count.rooms,
    _count: undefined,
  };
}; exports.getRoomTypeById = getRoomTypeById;

 const createRoomType = async (tenantId, dto) => {
  const existing = await _database2.default.roomType.findFirst({
    where: { tenantId, name: dto.name, isActive: true },
  });

  if (existing) throw _errormiddleware.createError.call(void 0, 'A room type with this name already exists', 409);

  return _database2.default.roomType.create({
    data: {
      tenantId,
      name: dto.name,
      description: dto.description,
      basePrice: dto.basePrice,
      maxOccupancy: dto.maxOccupancy,
      amenities: _nullishCoalesce(dto.amenities, () => ( [])),
      imageUrl: dto.imageUrl,
    },
  });
}; exports.createRoomType = createRoomType;

 const updateRoomType = async (tenantId, id, dto) => {
  const roomType = await _database2.default.roomType.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!roomType) throw _errormiddleware.createError.call(void 0, 'Room type not found', 404);

  if (dto.name && dto.name !== roomType.name) {
    const duplicate = await _database2.default.roomType.findFirst({
      where: { tenantId, name: dto.name, isActive: true, id: { not: id } },
    });
    if (duplicate) throw _errormiddleware.createError.call(void 0, 'A room type with this name already exists', 409);
  }

  return _database2.default.roomType.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
      ...(dto.maxOccupancy !== undefined && { maxOccupancy: dto.maxOccupancy }),
      ...(dto.amenities !== undefined && { amenities: dto.amenities }),
      ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
    },
  });
}; exports.updateRoomType = updateRoomType;

 const deleteRoomType = async (tenantId, id) => {
  const roomType = await _database2.default.roomType.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!roomType) throw _errormiddleware.createError.call(void 0, 'Room type not found', 404);

  const roomCount = await _database2.default.room.count({
    where: { roomTypeId: id, tenantId, isActive: true },
  });

  if (roomCount > 0) {
    throw _errormiddleware.createError.call(void 0, 
      `Cannot delete room type — it has ${roomCount} active room(s) assigned to it. Reassign or deactivate those rooms first.`,
      400
    );
  }

  return _database2.default.roomType.update({
    where: { id },
    data: { isActive: false },
  });
}; exports.deleteRoomType = deleteRoomType;
