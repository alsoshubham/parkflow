import { db } from '../models/data.js';

export const bookingsController = {
  getAll(req, res) {
    const { userId, role } = req.user;
    const bookings = role === 'Admin' || role === 'Operator'
      ? db.bookings
      : db.bookings.filter(b => b.userId === userId);
    res.json(bookings);
  },

  getById(req, res) {
    const booking = db.bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  },

  create(req, res) {
    const booking = {
      ...req.body,
      id: `BK-${new Date().getFullYear()}-${String(db.bookings.length + 1).padStart(4, '0')}`,
      userId: req.user.id,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(booking);
    res.status(201).json(booking);
  },

  cancel(req, res) {
    const idx = db.bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
    db.bookings[idx].status = 'cancelled';
    res.json(db.bookings[idx]);
  },
};
