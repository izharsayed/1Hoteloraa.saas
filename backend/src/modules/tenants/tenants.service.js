"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);

var _errormiddleware = require('../../middleware/error.middleware');

 const getTenantProfile = async (tenantId) => {
  const tenant = await _database2.default.tenant.findUnique({
    where: { id: tenantId },
    include: {
      subscription: true,
      features: true,
    },
  });

  if (!tenant) throw _errormiddleware.createError.call(void 0, 'Tenant not found', 404);
  return tenant;
}; exports.getTenantProfile = getTenantProfile;

 const updateTenant = async (tenantId, dto) => {
  const tenant = await _database2.default.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw _errormiddleware.createError.call(void 0, 'Tenant not found', 404);

  return _database2.default.tenant.update({
    where: { id: tenantId },
    data: dto ,
    include: {
      subscription: true,
      features: true,
    },
  });
}; exports.updateTenant = updateTenant;

 const getTenantFeatures = async (tenantId) => {
  return _database2.default.tenantFeature.findMany({
    where: { tenantId },
  });
}; exports.getTenantFeatures = getTenantFeatures;

 const toggleFeature = async (tenantId, feature) => {
  const existing = await _database2.default.tenantFeature.findUnique({
    where: {
      tenantId_feature: {
        tenantId,
        feature,
      },
    },
  });

  if (!existing) {
    return _database2.default.tenantFeature.create({
      data: {
        tenantId,
        feature,
        isEnabled: true,
      },
    });
  }

  return _database2.default.tenantFeature.update({
    where: {
      tenantId_feature: {
        tenantId,
        feature,
      },
    },
    data: {
      isEnabled: !existing.isEnabled,
    },
  });
}; exports.toggleFeature = toggleFeature;
