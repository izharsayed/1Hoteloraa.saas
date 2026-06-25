"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);

var _errormiddleware = require('../../middleware/error.middleware');

 const getFolioByPaymentId = async (tenantId, paymentId) => {
  const payment = await _database2.default.payment.findFirst({
    where: { id: paymentId, tenantId },
  });
  if (!payment) throw _errormiddleware.createError.call(void 0, 'Payment not found', 404);

  return _database2.default.folioItem.findMany({
    where: { paymentId },
    orderBy: { createdAt: 'asc' },
  });
}; exports.getFolioByPaymentId = getFolioByPaymentId;

 const getFolioByReservationId = async (tenantId, reservationId) => {
  const payment = await _database2.default.payment.findFirst({
    where: { reservationId, tenantId },
  });

  if (!payment) return [];

  return _database2.default.folioItem.findMany({
    where: { paymentId: payment.id },
    orderBy: { createdAt: 'asc' },
  });
}; exports.getFolioByReservationId = getFolioByReservationId;

 const addFolioItem = async (tenantId, dto) => {
  const payment = await _database2.default.payment.findFirst({
    where: { id: dto.paymentId, tenantId },
  });
  if (!payment) throw _errormiddleware.createError.call(void 0, 'Payment not found', 404);

  return _database2.default.folioItem.create({
    data: {
      paymentId: dto.paymentId,
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
    },
  });
}; exports.addFolioItem = addFolioItem;

 const getGuestFolio = async (tenantId, reservationId) => {
  const reservation = await _database2.default.reservation.findFirst({
    where: { id: reservationId, tenantId },
    include: {
      guest: true,
      room: true,
      payment: true,
    },
  });

  if (!reservation) throw _errormiddleware.createError.call(void 0, 'Reservation not found', 404);

  const folioItems = reservation.payment
    ? await _database2.default.folioItem.findMany({
        where: { paymentId: reservation.payment.id },
        orderBy: { createdAt: 'asc' },
      })
    : [];

  // Structure charges, payments, and balance
  let totalCharges = reservation.totalAmount; // Base room + extra charges
  let totalPayments = 0;

  if (reservation.payment && reservation.payment.status === 'PAID') {
    totalPayments += reservation.payment.amount;
  }

  folioItems.forEach((item) => {
    if (item.type === 'CHARGE') {
      totalCharges += item.amount;
    } else if (item.type === 'PAYMENT') {
      totalPayments += item.amount;
    } else if (item.type === 'DISCOUNT') {
      totalCharges -= item.amount;
    }
  });

  const balance = totalCharges - totalPayments;

  return {
    reservation: {
      id: reservation.id,
      bookingRef: reservation.bookingRef,
      status: reservation.status,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      guest: reservation.guest,
      room: reservation.room,
    },
    baseCharges: {
      roomCharges: reservation.roomCharges,
      extraCharges: reservation.extraCharges,
      discount: reservation.discount,
      totalAmount: reservation.totalAmount,
    },
    folioItems,
    summary: {
      totalCharges,
      totalPayments,
      balance,
    },
  };
}; exports.getGuestFolio = getGuestFolio;
