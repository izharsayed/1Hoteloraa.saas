"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);


 const getSettings = async (tenantId) => {
  const settings = await _database2.default.tenantSettings.findUnique({
    where: { tenantId },
  });

  if (settings) return settings;

  // Create default if not exists
  return _database2.default.tenantSettings.create({
    data: {
      tenantId,
      taxRate: 18,
      serviceCharge: 0,
      invoicePrefix: 'INV',
      kotPrefix: 'KOT',
      bookingPrefix: 'BKG',
    },
  });
}; exports.getSettings = getSettings;

 const updateSettings = async (tenantId, dto) => {
  return _database2.default.tenantSettings.upsert({
    where: { tenantId },
    update: dto ,
    create: {
      tenantId,
      taxRate: _nullishCoalesce(dto.taxRate, () => ( 18)),
      serviceCharge: _nullishCoalesce(dto.serviceCharge, () => ( 0)),
      invoicePrefix: _nullishCoalesce(dto.invoicePrefix, () => ( 'INV')),
      kotPrefix: _nullishCoalesce(dto.kotPrefix, () => ( 'KOT')),
      bookingPrefix: _nullishCoalesce(dto.bookingPrefix, () => ( 'BKG')),
      footerNote: dto.footerNote,
      smtpHost: dto.smtpHost,
      smtpPort: dto.smtpPort,
      smtpUser: dto.smtpUser,
      smtpPass: dto.smtpPass,
      smsProvider: dto.smsProvider,
      smsApiKey: dto.smsApiKey,
    },
  });
}; exports.updateSettings = updateSettings;
