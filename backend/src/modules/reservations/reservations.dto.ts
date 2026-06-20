import { z } from 'zod';

export const createReservationSchema = z
  .object({
    roomId: z.string().uuid('Invalid room ID'),
    guestId: z.string().uuid('Invalid guest ID'),
    checkInDate: z.string().min(1, 'Check-in date is required'),
    checkOutDate: z.string().min(1, 'Check-out date is required'),
    adults: z.number().int().min(1).default(1),
    children: z.number().int().min(0).default(0),
    ratePerNight: z.number().positive('Rate per night must be positive'),
    extraCharges: z.number().min(0).default(0),
    discount: z.number().min(0).default(0),
    specialRequest: z.string().max(1000).optional(),
    notes: z.string().max(1000).optional(),
    source: z.string().max(50).optional(),
  })
  .transform((data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay));
    const roomCharges = totalNights * data.ratePerNight;
    const totalAmount = roomCharges + (data.extraCharges ?? 0) - (data.discount ?? 0);

    return {
      ...data,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      roomCharges,
      totalAmount: Math.max(0, totalAmount),
    };
  });

export const updateReservationSchema = z.object({
  specialRequest: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
  adults: z.number().int().min(1).optional(),
  children: z.number().int().min(0).optional(),
  extraCharges: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW']),
});

export type CreateReservationDto = z.infer<typeof createReservationSchema>;
export type UpdateReservationDto = z.infer<typeof updateReservationSchema>;
export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;
