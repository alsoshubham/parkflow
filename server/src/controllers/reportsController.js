import { db } from '../models/data.js';

export const reportsController = {
  summary(req, res) {
    const totalBookings = db.bookings.length;
    const totalRevenue = db.payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
    const totalLots = db.lots.length;
    const activeSessions = db.sessions.filter(s => s.status === 'active').length;

    res.json({
      totalBookings,
      totalRevenue,
      totalLots,
      activeSessions,
      totalUsers: db.users.length,
    });
  },

  revenueByLot(req, res) {
    const result = db.lots.map(lot => {
      const lotBookings = db.bookings.filter(b => b.lotId === lot.id);
      const revenue = lotBookings.reduce((s, b) => s + (b.amount || 0), 0);
      return { lotId: lot.id, name: lot.name, revenue, bookings: lotBookings.length };
    });
    res.json(result);
  },
};
