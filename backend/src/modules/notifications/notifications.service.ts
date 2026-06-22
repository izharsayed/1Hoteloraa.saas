import prisma from '../../config/database';
import { CreateNotificationDto } from './notifications.dto';
import { createError } from '../../middleware/error.middleware';

export const createNotification = async (tenantId: string, dto: CreateNotificationDto) => {
  return prisma.notification.create({
    data: {
      tenantId,
      userId: dto.userId,
      role: dto.role,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      isRead: false,
    },
  });
};

export const getNotifications = async (tenantId: string, userId: string, role: string) => {
  return prisma.notification.findMany({
    where: {
      tenantId,
      OR: [
        { userId },
        { userId: null, role: role as any },
        { userId: null, role: null },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
};

export const markAsRead = async (tenantId: string, id: string, userId: string, role: string) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id,
      tenantId,
      OR: [
        { userId },
        { userId: null, role: role as any },
        { userId: null, role: null },
      ],
    },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (tenantId: string, userId: string, role: string) => {
  return prisma.notification.updateMany({
    where: {
      tenantId,
      OR: [
        { userId },
        { userId: null, role: role as any },
        { userId: null, role: null },
      ],
      isRead: false,
    },
    data: { isRead: true },
  });
};
