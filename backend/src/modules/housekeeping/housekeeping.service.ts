import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateTaskDto, UpdateTaskDto } from './housekeeping.dto';

const taskInclude = {
  room: {
    select: {
      id: true,
      number: true,
      floor: true,
      status: true,
      roomType: { select: { id: true, name: true } },
    },
  },
  assignedUser: {
    select: { id: true, name: true, email: true, userRole: true },
  },
} as const;

// ────────────────────────────────────────────────────────────────
// GET TASKS — list all with optional status filter
// ────────────────────────────────────────────────────────────────
export const getTasks = async (tenantId: string, status?: string) => {
  const where: Record<string, unknown> = { tenantId };
  if (status) {
    const valid = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'INSPECTED'];
    if (!valid.includes(status)) {
      throw createError(`Invalid status filter. Must be one of: ${valid.join(', ')}`, 400);
    }
    where.status = status;
  }

  const tasks = await prisma.housekeeping.findMany({
    where,
    include: taskInclude,
    orderBy: [{ status: 'asc' }, { scheduledAt: 'asc' }, { createdAt: 'desc' }],
  });

  return tasks;
};

// ────────────────────────────────────────────────────────────────
// GET TASK BY ID
// ────────────────────────────────────────────────────────────────
export const getTaskById = async (tenantId: string, id: string) => {
  const task = await prisma.housekeeping.findFirst({
    where: { id, tenantId },
    include: taskInclude,
  });

  if (!task) {
    throw createError('Housekeeping task not found', 404);
  }

  return task;
};

// ────────────────────────────────────────────────────────────────
// CREATE TASK
// ────────────────────────────────────────────────────────────────
export const createTask = async (tenantId: string, dto: CreateTaskDto) => {
  // Verify room belongs to tenant
  const room = await prisma.room.findFirst({ where: { id: dto.roomId, tenantId } });
  if (!room) {
    throw createError('Room not found', 404);
  }

  // Verify assignee belongs to tenant (if provided)
  if (dto.assignedTo) {
    const user = await prisma.user.findFirst({
      where: { id: dto.assignedTo, tenantId, isActive: true },
    });
    if (!user) {
      throw createError('Assigned user not found or inactive', 404);
    }
  }

  const task = await prisma.housekeeping.create({
    data: {
      tenantId,
      roomId: dto.roomId,
      assignedTo: dto.assignedTo ?? null,
      taskType: dto.taskType,
      notes: dto.notes ?? null,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      status: 'PENDING',
    },
    include: taskInclude,
  });

  return task;
};

// ────────────────────────────────────────────────────────────────
// UPDATE TASK (fields only, not status)
// ────────────────────────────────────────────────────────────────
export const updateTask = async (tenantId: string, id: string, dto: UpdateTaskDto) => {
  const existing = await prisma.housekeeping.findFirst({ where: { id, tenantId } });
  if (!existing) {
    throw createError('Housekeeping task not found', 404);
  }

  if (dto.roomId) {
    const room = await prisma.room.findFirst({ where: { id: dto.roomId, tenantId } });
    if (!room) throw createError('Room not found', 404);
  }

  if (dto.assignedTo) {
    const user = await prisma.user.findFirst({
      where: { id: dto.assignedTo, tenantId, isActive: true },
    });
    if (!user) throw createError('Assigned user not found or inactive', 404);
  }

  const task = await prisma.housekeeping.update({
    where: { id },
    data: {
      ...(dto.roomId !== undefined && { roomId: dto.roomId }),
      ...(dto.assignedTo !== undefined && { assignedTo: dto.assignedTo }),
      ...(dto.taskType !== undefined && { taskType: dto.taskType }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.scheduledAt !== undefined && {
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      }),
    },
    include: taskInclude,
  });

  return task;
};

// ────────────────────────────────────────────────────────────────
// UPDATE STATUS — sets timestamps, updates room if COMPLETED
// ────────────────────────────────────────────────────────────────
export const updateStatus = async (
  tenantId: string,
  id: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INSPECTED',
  userId: string
) => {
  const existing = await prisma.housekeeping.findFirst({ where: { id, tenantId } });
  if (!existing) {
    throw createError('Housekeeping task not found', 404);
  }

  const now = new Date();
  const statusData: Record<string, unknown> = { status };

  if (status === 'IN_PROGRESS') {
    statusData.startedAt = now;
  } else if (status === 'COMPLETED') {
    statusData.completedAt = now;
    if (!existing.startedAt) statusData.startedAt = now;
  } else if (status === 'PENDING') {
    // Allow resetting — clear timestamps
    statusData.startedAt = null;
    statusData.completedAt = null;
  }

  const task = await prisma.housekeeping.update({
    where: { id },
    data: statusData,
    include: taskInclude,
  });

  // When a task is COMPLETED, mark room as AVAILABLE
  if (status === 'COMPLETED') {
    await prisma.room.update({
      where: { id: existing.roomId },
      data: { status: 'AVAILABLE' },
    });
  }

  void userId; // auditing hook – userId available for future logs

  return task;
};

// ────────────────────────────────────────────────────────────────
// GET MY TASKS — tasks assigned to a specific user
// ────────────────────────────────────────────────────────────────
export const getMyTasks = async (tenantId: string, userId: string) => {
  const tasks = await prisma.housekeeping.findMany({
    where: { tenantId, assignedTo: userId },
    include: taskInclude,
    orderBy: [{ status: 'asc' }, { scheduledAt: 'asc' }, { createdAt: 'desc' }],
  });

  return tasks;
};

// ────────────────────────────────────────────────────────────────
// GET DASHBOARD — counts by status and by taskType
// ────────────────────────────────────────────────────────────────
export const getDashboard = async (tenantId: string) => {
  const [byStatus, byTaskType, recentTasks] = await Promise.all([
    // Count by status
    prisma.housekeeping.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { _all: true },
    }),
    // Count by task type
    prisma.housekeeping.groupBy({
      by: ['taskType'],
      where: { tenantId },
      _count: { _all: true },
    }),
    // Recent pending / in-progress tasks
    prisma.housekeeping.findMany({
      where: {
        tenantId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      include: taskInclude,
      orderBy: { scheduledAt: 'asc' },
      take: 10,
    }),
  ]);

  const statusCounts: Record<string, number> = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    INSPECTED: 0,
  };
  byStatus.forEach((row) => {
    statusCounts[row.status] = row._count._all;
  });

  const taskTypeCounts: Record<string, number> = {
    CLEANING: 0,
    INSPECTION: 0,
    MAINTENANCE: 0,
    TURNDOWN: 0,
  };
  byTaskType.forEach((row) => {
    taskTypeCounts[row.taskType] = row._count._all;
  });

  return {
    statusCounts,
    taskTypeCounts,
    totalTasks: Object.values(statusCounts).reduce((a, b) => a + b, 0),
    recentActiveTasks: recentTasks,
  };
};
