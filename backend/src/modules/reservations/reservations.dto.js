"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _zod = require('zod');

 const createReservationSchema = _zod.z
  .object({
    roomId: _zod.z.string().uuid('Invalid room ID'),
    guestId: _zod.z.string().uuid('Invalid guest ID'),
    checkInDate: _zod.z.string().min(1, 'Check-in date is required'),
    checkOutDate: _zod.z.string().min(1, 'Check-out date is required'),
    adults: _zod.z.number().int().min(1).default(1),
    children: _zod.z.number().int().min(0).default(0),
    ratePerNight: _zod.z.number().positive('Rate per night must be positive'),
    extraCharges: _zod.z.number().min(0).default(0),
    discount: _zod.z.number().min(0).default(0),
    specialRequest: _zod.z.string().max(1000).optional(),
    notes: _zod.z.string().max(1000).optional(),
    source: _zod.z.string().max(50).optional(),
  })
  .transform((data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay));
    const roomCharges = totalNights * data.ratePerNight;
    const totalAmount = roomCharges + (_nullishCoalesce(data.extraCharges, () => ( 0))) - (_nullishCoalesce(data.discount, () => ( 0)));

    return {
      ...data,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      roomCharges,
      totalAmount: Math.max(0, totalAmount),
    };
  }); exports.createReservationSchema = createReservationSchema;

 const updateReservationSchema = _zod.z.object({
  specialRequest: _zod.z.string().max(1000).optional(),
  notes: _zod.z.string().max(1000).optional(),
  adults: _zod.z.number().int().min(1).optional(),
  children: _zod.z.number().int().min(0).optional(),
  extraCharges: _zod.z.number().min(0).optional(),
  discount: _zod.z.number().min(0).optional(),
}); exports.updateReservationSchema = updateReservationSchema;

 const updateStatusSchema = _zod.z.object({
  status: _zod.z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW']),
}); exports.updateStatusSchema = updateStatusSchema;




