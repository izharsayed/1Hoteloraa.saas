"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _errormiddleware = require('../../middleware/error.middleware');


 const getVendors = async (tenantId, search) => {
  const where = { tenantId, isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const vendors = await _database2.default.vendor.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gstin: true,
      contactName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { purchases: true } },
    },
  });

  return vendors;
}; exports.getVendors = getVendors;

 const getVendorById = async (tenantId, id) => {
  const vendor = await _database2.default.vendor.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      purchases: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          purchaseNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          receivedAt: true,
        },
      },
    },
  });

  if (!vendor) {
    throw _errormiddleware.createError.call(void 0, 'Vendor not found', 404);
  }

  return vendor;
}; exports.getVendorById = getVendorById;

 const createVendor = async (tenantId, dto) => {
  const vendor = await _database2.default.vendor.create({
    data: { tenantId, ...dto },
  });

  return vendor;
}; exports.createVendor = createVendor;

 const updateVendor = async (
  tenantId,
  id,
  dto
) => {
  const existing = await _database2.default.vendor.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!existing) {
    throw _errormiddleware.createError.call(void 0, 'Vendor not found', 404);
  }

  const vendor = await _database2.default.vendor.update({
    where: { id },
    data: dto,
  });

  return vendor;
}; exports.updateVendor = updateVendor;

 const deleteVendor = async (tenantId, id) => {
  const existing = await _database2.default.vendor.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!existing) {
    throw _errormiddleware.createError.call(void 0, 'Vendor not found', 404);
  }

  await _database2.default.vendor.update({
    where: { id },
    data: { isActive: false },
  });
}; exports.deleteVendor = deleteVendor;
