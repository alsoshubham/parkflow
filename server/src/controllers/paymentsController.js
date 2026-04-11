import { db } from '../models/data.js';

export const paymentsController = {
  getAll(req, res) {
    const { role } = req.user;
    const payments = role === 'Admin' || role === 'Operator'
      ? db.payments
      : db.payments.filter(p => p.userId === req.user.id);
    res.json(payments);
  },

  create(req, res) {
    const payment = {
      ...req.body,
      id: db.genId('PAY'),
      userId: req.user.id,
      status: 'success',
      createdAt: new Date().toISOString(),
      txnId: `TXN${Date.now()}`,
    };
    db.payments.push(payment);
    db.save();
    res.status(201).json(payment);
  },
};
