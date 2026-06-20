import prisma from '../../config/database';
import { UpdateSettingsDto } from './settings.dto';

export const getSettings = async (tenantId: string) => {
  const settings = await prisma.tenantSettings.findUnique({
    where: { tenantId },
  });

  if (settings) return settings;

  // Create default if not exists
  return prisma.tenantSettings.create({
    data: {
      tenantId,
      taxRate: 18,
      serviceCharge: 0,
      invoicePrefix: 'INV',
      kotPrefix: 'KOT',
      bookingPrefix: 'BKG',
    },
  });
};

export const updateSettings = async (tenantId: string, dto: UpdateSettingsDto) => {
  return prisma.tenantSettings.upsert({
    where: { tenantId },
    update: dto as any,
    create: {
      tenantId,
      taxRate: dto.taxRate ?? 18,
      serviceCharge: dto.serviceCharge ?? 0,
      invoicePrefix: dto.invoicePrefix ?? 'INV',
      kotPrefix: dto.kotPrefix ?? 'KOT',
      bookingPrefix: dto.bookingPrefix ?? 'BKG',
      footerNote: dto.footerNote,
      smtpHost: dto.smtpHost,
      smtpPort: dto.smtpPort,
      smtpUser: dto.smtpUser,
      smtpPass: dto.smtpPass,
      smsProvider: dto.smsProvider,
      smsApiKey: dto.smsApiKey,
    },
  });
};
